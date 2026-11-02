import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';
import workerModule from '../src/index.js';
import {
  buildEntrySql,
  buildImportBatchSql,
  writeSqlBatchFile,
  executeD1SqlFile,
  executeImportBatch,
  queryExistingSlugs
} from '../scripts/import-content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const configFile = 'wrangler.worker.jsonc';

console.log('Running Importer Write-Path & Transaction Integration Test Suite...\n');

// Helper to query local D1 via wrangler CLI
function queryLocalD1(sql) {
  const stdout = execFileSync('npx', [
    'wrangler',
    'd1',
    'execute',
    'traiinc-cms',
    '--local',
    '--config',
    configFile,
    '--json',
    '--command',
    sql
  ], {
    cwd: rootDir,
    encoding: 'utf8'
  });
  const parsed = JSON.parse(stdout);
  return (parsed && parsed[0] && parsed[0].results) || [];
}

// Helper to execute SQL against local D1 via wrangler CLI
function execLocalD1(sql) {
  return execFileSync('npx', [
    'wrangler',
    'd1',
    'execute',
    'traiinc-cms',
    '--local',
    '--config',
    configFile,
    '--command',
    sql
  ], {
    cwd: rootDir,
    encoding: 'utf8'
  });
}

// Find local D1 SQLite file for fast, direct worker testing
function getLocalD1Database() {
  const baseDir = path.join(rootDir, '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
  if (!fs.existsSync(baseDir)) return null;
  const files = fs.readdirSync(baseDir);
  const sqliteFile = files.find(f => f.endsWith('.sqlite') && !f.startsWith('metadata'));
  if (!sqliteFile) return null;
  return new DatabaseSync(path.join(baseDir, sqliteFile));
}

// Create Cloudflare D1 adapter wrapping local SQLite database
function createD1Adapter(sqlite) {
  return {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async first() {
              const stmt = sqlite.prepare(sql);
              return stmt.get(...args) || null;
            },
            async all() {
              const stmt = sqlite.prepare(sql);
              return { results: stmt.all(...args) };
            },
            async run() {
              const stmt = sqlite.prepare(sql);
              const info = stmt.run(...args);
              return { meta: { changes: info.changes } };
            }
          };
        }
      };
    },
    async batch(statements) {
      return [];
    }
  };
}

// ============================================================================
// Test 1: SQL Generation Safety Invariants (No BEGIN/COMMIT, No PRAGMA, insert-only)
// ============================================================================
{
  const sampleEntry = {
    content_type: 'blog',
    slug: 'test-invariants-slug',
    title: 'Test Invariants Title',
    data: { summary: 'Sample summary', sections: [{ heading: 'H1', body: 'B1' }] },
    seo: { meta_title: 'Meta Title', meta_description: 'Meta Desc' }
  };

  // Draft SQL batch
  const draftBatch = buildImportBatchSql([sampleEntry], 'author@traiinc.com');
  assert.strictEqual(draftBatch.includes('BEGIN TRANSACTION'), false, 'SQL batch must not contain BEGIN TRANSACTION');
  assert.strictEqual(draftBatch.includes('COMMIT'), false, 'SQL batch must not contain COMMIT');
  assert.strictEqual(draftBatch.includes('PRAGMA foreign_keys'), false, 'SQL batch must not contain PRAGMA foreign_keys');
  assert.strictEqual(draftBatch.includes('ON CONFLICT'), false, 'SQL batch must not contain ON CONFLICT (strictly insert-only)');
  assert.strictEqual(draftBatch.includes('UPDATE'), false, 'SQL batch must not contain UPDATE');
  assert.ok(draftBatch.includes("'draft'"), 'Default SQL batch must set draft status');
  assert.ok(draftBatch.includes("NULL\n);") || draftBatch.includes("NULL\r\n);"), 'Default SQL batch must set published_at to NULL');

  // Published SQL batch
  const pubBatch = buildImportBatchSql([sampleEntry], 'author@traiinc.com', 'published');
  assert.ok(pubBatch.includes("'published'"), 'Explicit published batch must set published status');
  assert.ok(pubBatch.includes("datetime('now')\n);") || pubBatch.includes("datetime('now')\r\n);"), 'Explicit published batch must set published_at');

  console.log('PASS Test 1: SQL batch generation complies with D1 batch standards (no explicit tx/pragma, insert-only).');
}

// ============================================================================
// Test 2: Default Import Generates Draft Status & Matching Revision in Local D1
// ============================================================================
const draftSlug = `test-draft-${Date.now()}`;
const testAuthor = `test-author-${Date.now()}@traiinc.com`;
let draftEntryId = null;

{
  const draftEntry = {
    content_type: 'blog',
    slug: draftSlug,
    title: 'Automated Draft Pilot Article',
    data: {
      summary: 'Draft summary text',
      sections: [{ heading: 'Introduction', body: 'Draft body paragraph' }]
    },
    seo: {
      meta_title: 'Automated Draft Pilot Article',
      meta_description: 'Draft SEO description'
    }
  };

  // Execute write path with default status (draft)
  const result = executeImportBatch([draftEntry], testAuthor, false, configFile);
  assert.strictEqual(result.count, 1, 'Import result count must be 1');

  // Verify cms_entries
  const entries = queryLocalD1(`SELECT * FROM cms_entries WHERE slug = '${draftSlug}';`);
  assert.strictEqual(entries.length, 1, 'Exactly one cms_entries row must be created');

  const entry = entries[0];
  draftEntryId = entry.id;
  assert.strictEqual(entry.slug, draftSlug);
  assert.strictEqual(entry.status, 'draft', 'Default import must set status to draft');
  assert.strictEqual(entry.published_at, null, 'Draft entry published_at must be NULL');
  assert.strictEqual(entry.created_by, testAuthor);
  assert.strictEqual(entry.updated_by, testAuthor);

  // Verify cms_entry_revisions
  const revisions = queryLocalD1(`SELECT * FROM cms_entry_revisions WHERE entry_id = '${draftEntryId}';`);
  assert.strictEqual(revisions.length, 1, 'Exactly one paired revision must be created');

  const rev = revisions[0];
  assert.strictEqual(rev.entry_id, draftEntryId);
  assert.strictEqual(rev.status, 'draft', 'Draft revision status must match draft entry status');
  assert.strictEqual(rev.actor_email, testAuthor);

  console.log('PASS Test 2: Default import generates draft status with published_at NULL and matching draft revision.');
}

// ============================================================================
// Test 3: Draft Content is Unavailable from Public Content API (Returns 404)
// ============================================================================
const localDb = getLocalD1Database();
assert.ok(localDb, 'Local SQLite database must be present for Worker endpoint tests');
const workerEnv = {
  ENVIRONMENT: 'test',
  ADMIN_ORIGIN: 'https://admin.traiinc.com',
  __testMember: { email: testAuthor, role: 'owner' },
  DB: createD1Adapter(localDb)
};

{
  // Test actual public Worker route: GET /api/public/v1/content?slug={slug}
  const publicReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${draftSlug}`, {
    method: 'GET'
  });

  const publicRes = await workerModule.fetch(publicReq, workerEnv);
  assert.strictEqual(publicRes.status, 404, 'Public content API must return 404 for draft entries');
  const body = await publicRes.json();
  assert.strictEqual(body.error, 'Not found', 'Public error message must be "Not found"');

  console.log('PASS Test 3: Draft content is unavailable from public content API (GET /api/public/v1/content returns 404).');
}

// ============================================================================
// Test 4: Draft Content is Accessible via Authenticated Admin Entry API (Returns 200)
// ============================================================================
{
  // Test actual admin Worker route: GET /api/admin/v1/entries/{id}
  const adminReq = new Request(`https://api.traiinc.com/api/admin/v1/entries/${draftEntryId}`, {
    method: 'GET',
    headers: { 'Origin': 'https://admin.traiinc.com' }
  });

  const adminRes = await workerModule.fetch(adminReq, workerEnv);
  assert.strictEqual(adminRes.status, 200, 'Admin API must return 200 for draft entries');
  const body = await adminRes.json();
  assert.strictEqual(body.item.id, draftEntryId);
  assert.strictEqual(body.item.slug, draftSlug);
  assert.strictEqual(body.item.status, 'draft');
  assert.strictEqual(body.revisions.length, 1);
  assert.strictEqual(body.revisions[0].status, 'draft');

  console.log('PASS Test 4: Draft content is accessible via authenticated admin entry API (GET /api/admin/v1/entries/{id} returns 200).');
}

// ============================================================================
// Test 5: Explicit Published Status Generates Published Status and Timestamp
// ============================================================================
const pubSlug = `test-pub-${Date.now()}`;
let pubEntryId = null;

{
  const pubEntry = {
    content_type: 'blog',
    slug: pubSlug,
    title: 'Automated Published Article',
    data: { summary: 'Published summary' },
    seo: { meta_title: 'Published Article' }
  };

  // Explicitly pass status = 'published'
  const result = executeImportBatch([pubEntry], testAuthor, false, configFile, undefined, 'published');
  assert.strictEqual(result.count, 1);

  const entries = queryLocalD1(`SELECT * FROM cms_entries WHERE slug = '${pubSlug}';`);
  assert.strictEqual(entries.length, 1);

  const entry = entries[0];
  pubEntryId = entry.id;
  assert.strictEqual(entry.status, 'published');
  assert.ok(entry.published_at !== null, 'Published entry must have non-null published_at');

  const revisions = queryLocalD1(`SELECT * FROM cms_entry_revisions WHERE entry_id = '${pubEntryId}';`);
  assert.strictEqual(revisions[0].status, 'published');

  // Verify public API returns 200 for published entry
  const pubReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${pubSlug}`, { method: 'GET' });
  const pubRes = await workerModule.fetch(pubReq, workerEnv);
  assert.strictEqual(pubRes.status, 200, 'Public API returns 200 for published entry');

  console.log('PASS Test 5: Explicit published status import sets published status, timestamp, and is available publicly.');
}

// ============================================================================
// Test 6: Manual Publishing and Unpublishing via Worker Admin Endpoints
// ============================================================================
{
  // 1. Publish draft entry via POST /api/admin/v1/entries/{id}/publish
  const publishReq = new Request(`https://api.traiinc.com/api/admin/v1/entries/${draftEntryId}/publish`, {
    method: 'POST',
    headers: { 'Origin': 'https://admin.traiinc.com' }
  });

  const publishRes = await workerModule.fetch(publishReq, workerEnv);
  assert.strictEqual(publishRes.status, 200, 'Publish endpoint must return 200');
  const publishData = await publishRes.json();
  assert.strictEqual(publishData.status, 'published');

  // Public API must now return 200
  const afterPubReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${draftSlug}`, { method: 'GET' });
  const afterPubRes = await workerModule.fetch(afterPubReq, workerEnv);
  assert.strictEqual(afterPubRes.status, 200, 'Public API must return 200 after manual publish');

  // 2. Unpublish entry via POST /api/admin/v1/entries/{id}/unpublish
  const unpublishReq = new Request(`https://api.traiinc.com/api/admin/v1/entries/${draftEntryId}/unpublish`, {
    method: 'POST',
    headers: { 'Origin': 'https://admin.traiinc.com' }
  });

  const unpublishRes = await workerModule.fetch(unpublishReq, workerEnv);
  assert.strictEqual(unpublishRes.status, 200, 'Unpublish endpoint must return 200');
  const unpublishData = await unpublishRes.json();
  assert.strictEqual(unpublishData.status, 'draft');

  // Public API must now return 404 again
  const afterUnpubReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${draftSlug}`, { method: 'GET' });
  const afterUnpubRes = await workerModule.fetch(afterUnpubReq, workerEnv);
  assert.strictEqual(afterUnpubRes.status, 404, 'Public API must return 404 after manual unpublish');

  console.log('PASS Test 6: Manual publishing (POST .../publish) and unpublishing (POST .../unpublish) lifecycle verified.');
}

// ============================================================================
// Test 7: Invalid Status Rejected Before D1 Execution
// ============================================================================
{
  const dummyEntry = {
    content_type: 'blog',
    slug: 'invalid-status-test',
    title: 'Invalid',
    data: {},
    seo: {}
  };

  assert.throws(
    () => buildEntrySql(dummyEntry, testAuthor, undefined, undefined, 'invalid'),
    /Invalid status "invalid"/,
    'buildEntrySql must reject invalid status'
  );

  assert.throws(
    () => buildImportBatchSql([dummyEntry], testAuthor, 'archived'),
    /Invalid status "archived"/,
    'buildImportBatchSql must reject unsupported status'
  );

  assert.throws(
    () => executeImportBatch([dummyEntry], testAuthor, false, configFile, undefined, 'unknown'),
    /Invalid status "unknown"/,
    'executeImportBatch must reject unsupported status before D1 execution'
  );

  // CLI argument validation
  let cliFailed = false;
  try {
    execFileSync('node', [
      path.join(rootDir, 'scripts/import-content.js'),
      '--status',
      'invalid-status'
    ], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (err) {
    cliFailed = true;
    assert.strictEqual(err.status, 1, 'CLI must exit with code 1 on invalid status');
  }
  assert.strictEqual(cliFailed, true, 'CLI must fail on invalid --status');

  console.log('PASS Test 7: Invalid status is rejected before D1 execution (both API and CLI exit nonzero).');
}

// ============================================================================
// Test 8: Duplicate Slug Produces Zero Writes
// ============================================================================
{
  const duplicateEntry = {
    content_type: 'blog',
    slug: draftSlug,
    title: 'Duplicate Attempt Post',
    data: { summary: 'Should never be inserted' },
    seo: { meta_title: 'Duplicate' }
  };

  assert.throws(
    () => executeImportBatch([duplicateEntry], testAuthor, false, configFile),
    (err) => {
      assert.ok(err.message.includes(`Duplicate slug(s) detected: ${draftSlug}`));
      return true;
    },
    'Importing duplicate slug must abort'
  );

  // Verify zero duplicate rows created
  const entries = queryLocalD1(`SELECT count(*) AS total FROM cms_entries WHERE slug = '${draftSlug}';`);
  assert.strictEqual(entries[0].total, 1, 'Total entries for slug must remain exactly 1');

  console.log('PASS Test 8: Duplicate slug aborts before execution (zero duplicate writes persisted).');
}

// ============================================================================
// Test 9: Rollback on Failure (D1 Batch Atomicity)
// ============================================================================
{
  const failSlug = `test-rollback-${Date.now()}`;
  const failEntryId = `entry-${Date.now()}`;
  const invalidForeignEntryId = '00000000-0000-0000-0000-000000000000'; // Non-existent foreign key

  const validEntrySql = `INSERT INTO cms_entries (
    id, content_type, slug, title, data_json, seo_json, status, created_by, updated_by, created_at, updated_at, published_at
  ) VALUES (
    '${failEntryId}', 'blog', '${failSlug}', 'Rollback Post', '{}', '{}', 'draft', '${testAuthor}', '${testAuthor}', datetime('now'), datetime('now'), NULL
  );`;

  const invalidRevisionSql = `INSERT INTO cms_entry_revisions (
    id, entry_id, title, data_json, seo_json, status, actor_email, created_at
  ) VALUES (
    'rev-bad-${Date.now()}', '${invalidForeignEntryId}', 'Rollback Post', '{}', '{}', 'draft', '${testAuthor}', datetime('now')
  );`;

  const failingBatchSql = `${validEntrySql}\n\n${invalidRevisionSql}`;
  const batchFilePath = writeSqlBatchFile(failingBatchSql);

  let batchFailed = false;
  try {
    executeD1SqlFile(batchFilePath, false, configFile);
  } catch (err) {
    batchFailed = true;
    assert.ok(
      err.message.includes('FOREIGN KEY constraint failed') || err.message.includes('SQLITE_CONSTRAINT'),
      'Must fail with foreign key constraint error'
    );
  } finally {
    if (fs.existsSync(batchFilePath)) fs.unlinkSync(batchFilePath);
  }

  assert.strictEqual(batchFailed, true, 'Failing batch must throw error');

  // Verify that statement 1 was completely ROLLED BACK
  const entries = queryLocalD1(`SELECT count(*) AS total FROM cms_entries WHERE slug = '${failSlug}';`);
  assert.strictEqual(entries[0].total, 0, 'Entry must be completely rolled back when paired revision insert fails');

  console.log('PASS Test 9: Failure in paired insert rolls back the entire batch (atomicity confirmed).');
}

// ============================================================================
// Test 10: Cleanup & State Isolation
// ============================================================================
{
  execLocalD1(`
    DELETE FROM cms_entry_revisions WHERE entry_id IN ('${draftEntryId}', '${pubEntryId}');
    DELETE FROM cms_audit_logs WHERE entity_id IN ('${draftEntryId}', '${pubEntryId}');
    DELETE FROM cms_entries WHERE id IN ('${draftEntryId}', '${pubEntryId}');
  `);

  const draftCheck = queryLocalD1(`SELECT count(*) AS total FROM cms_entries WHERE slug = '${draftSlug}';`);
  assert.strictEqual(draftCheck[0].total, 0, 'Draft test entry must be removed');

  const pubCheck = queryLocalD1(`SELECT count(*) AS total FROM cms_entries WHERE slug = '${pubSlug}';`);
  assert.strictEqual(pubCheck[0].total, 0, 'Published test entry must be removed');

  console.log('PASS Test 10: Local D1 test state cleaned up cleanly (all test records purged).');
}

console.log('\nALL 10 IMPORTER WRITE-PATH & TRANSACTION INTEGRATION TESTS PASSED!\n');
