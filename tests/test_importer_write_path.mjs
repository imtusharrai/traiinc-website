import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
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

// ============================================================================
// Test 1: SQL Generation Safety Invariants (No BEGIN/COMMIT, No PRAGMA)
// ============================================================================
{
  const sampleEntry = {
    content_type: 'blog',
    slug: 'test-invariants-slug',
    title: 'Test Invariants Title',
    data: { summary: 'Sample summary', sections: [{ heading: 'H1', body: 'B1' }] },
    seo: { meta_title: 'Meta Title', meta_description: 'Meta Desc' }
  };

  const sqlBatch = buildImportBatchSql([sampleEntry], 'author@traiinc.com');

  assert.strictEqual(sqlBatch.includes('BEGIN TRANSACTION'), false, 'SQL batch must not contain BEGIN TRANSACTION');
  assert.strictEqual(sqlBatch.includes('COMMIT'), false, 'SQL batch must not contain COMMIT');
  assert.strictEqual(sqlBatch.includes('PRAGMA foreign_keys'), false, 'SQL batch must not contain PRAGMA foreign_keys');
  assert.strictEqual(sqlBatch.includes('ON CONFLICT'), false, 'SQL batch must not contain ON CONFLICT (strictly insert-only)');
  assert.strictEqual(sqlBatch.includes('UPDATE'), false, 'SQL batch must not contain UPDATE');

  assert.ok(sqlBatch.includes('INSERT INTO cms_entries'), 'Must contain INSERT INTO cms_entries');
  assert.ok(sqlBatch.includes('INSERT INTO cms_entry_revisions'), 'Must contain INSERT INTO cms_entry_revisions');

  console.log('PASS Test 1: SQL batch generation complies with D1 batch standards (no explicit tx/pragma, insert-only).');
}

// ============================================================================
// Test 2: Isolated Successful Write Path against Local D1
// ============================================================================
const testSlug = `test-integration-${Date.now()}`;
const testAuthor = `test-author-${Date.now()}@traiinc.com`;
let createdEntryId = null;

{
  const testEntry = {
    content_type: 'blog',
    slug: testSlug,
    title: 'Automated Integration Test Post',
    data: {
      summary: 'Integration test summary text',
      sections: [
        { heading: 'Section 1', body: 'Detailed paragraph 1' },
        { heading: 'Section 2', body: 'Detailed paragraph 2' }
      ]
    },
    seo: {
      meta_title: 'Automated Integration Test Post',
      meta_description: 'Integration test meta description text',
      canonical: `https://traiinc.com/blog/${testSlug}`
    }
  };

  // Execute write path
  const result = executeImportBatch([testEntry], testAuthor, false, configFile);
  assert.strictEqual(result.count, 1, 'Import result count must be 1');

  // Verify cms_entries
  const entries = queryLocalD1(`SELECT * FROM cms_entries WHERE slug = '${testSlug}';`);
  assert.strictEqual(entries.length, 1, 'Exactly one cms_entries row must be created');

  const entry = entries[0];
  createdEntryId = entry.id;
  assert.strictEqual(entry.slug, testSlug);
  assert.strictEqual(entry.title, testEntry.title);
  assert.strictEqual(entry.content_type, 'blog');
  assert.strictEqual(entry.status, 'published');
  assert.strictEqual(entry.created_by, testAuthor);
  assert.strictEqual(entry.updated_by, testAuthor);
  assert.deepStrictEqual(JSON.parse(entry.data_json), testEntry.data);
  assert.deepStrictEqual(JSON.parse(entry.seo_json), testEntry.seo);

  // Verify cms_entry_revisions
  const revisions = queryLocalD1(`SELECT * FROM cms_entry_revisions WHERE entry_id = '${createdEntryId}';`);
  assert.strictEqual(revisions.length, 1, 'Exactly one cms_entry_revisions row must be created');

  const revision = revisions[0];
  assert.strictEqual(revision.entry_id, createdEntryId);
  assert.strictEqual(revision.title, testEntry.title);
  assert.strictEqual(revision.status, 'published');
  assert.strictEqual(revision.actor_email, testAuthor);
  assert.deepStrictEqual(JSON.parse(revision.data_json), testEntry.data);
  assert.deepStrictEqual(JSON.parse(revision.seo_json), testEntry.seo);

  console.log('PASS Test 2: Exactly one cms_entries row and one paired revision created with expected content and author.');
}

// ============================================================================
// Test 3: Duplicate Slug Aborts Without Writes
// ============================================================================
{
  const duplicateEntry = {
    content_type: 'blog',
    slug: testSlug,
    title: 'Duplicate Attempt Post',
    data: { summary: 'Should never be inserted' },
    seo: { meta_title: 'Duplicate' }
  };

  assert.throws(
    () => executeImportBatch([duplicateEntry], testAuthor, false, configFile),
    (err) => {
      assert.ok(err.message.includes(`Duplicate slug(s) detected: ${testSlug}`));
      return true;
    },
    'Importing duplicate slug must abort'
  );

  // Verify zero duplicate rows created
  const entries = queryLocalD1(`SELECT count(*) AS total FROM cms_entries WHERE slug = '${testSlug}';`);
  assert.strictEqual(entries[0].total, 1, 'Total entries for slug must remain exactly 1');

  const revisions = queryLocalD1(`SELECT count(*) AS total FROM cms_entry_revisions WHERE entry_id = '${createdEntryId}';`);
  assert.strictEqual(revisions[0].total, 1, 'Total revisions for entry must remain exactly 1');

  console.log('PASS Test 3: Duplicate slug aborts before execution (zero writes persisted).');
}

// ============================================================================
// Test 4: Rollback on Failure (D1 Batch Atomicity)
// ============================================================================
{
  const failSlug = `test-rollback-${Date.now()}`;
  const failEntryId = `entry-${Date.now()}`;
  const invalidForeignEntryId = '00000000-0000-0000-0000-000000000000'; // Does not exist

  // Build batch where statement 1 succeeds, but statement 2 violates foreign key constraint
  const validEntrySql = `INSERT INTO cms_entries (
    id, content_type, slug, title, data_json, seo_json, status, created_by, updated_by, created_at, updated_at, published_at
  ) VALUES (
    '${failEntryId}', 'blog', '${failSlug}', 'Rollback Post', '{}', '{}', 'published', '${testAuthor}', '${testAuthor}', datetime('now'), datetime('now'), datetime('now')
  );`;

  const invalidRevisionSql = `INSERT INTO cms_entry_revisions (
    id, entry_id, title, data_json, seo_json, status, actor_email, created_at
  ) VALUES (
    'rev-bad-${Date.now()}', '${invalidForeignEntryId}', 'Rollback Post', '{}', '{}', 'published', '${testAuthor}', datetime('now')
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
    import('node:fs').then(fs => {
      if (fs.existsSync(batchFilePath)) fs.unlinkSync(batchFilePath);
    });
  }

  assert.strictEqual(batchFailed, true, 'Failing batch must throw error');

  // Verify that statement 1 was ROLLED BACK
  const entries = queryLocalD1(`SELECT count(*) AS total FROM cms_entries WHERE slug = '${failSlug}';`);
  assert.strictEqual(entries[0].total, 0, 'Entry must be completely rolled back when paired revision insert fails');

  console.log('PASS Test 4: Failure in paired insert rolls back the entire batch (atomicity confirmed).');
}

// ============================================================================
// Test 5: Cleanup & State Isolation
// ============================================================================
{
  execLocalD1(`DELETE FROM cms_entry_revisions WHERE entry_id = '${createdEntryId}'; DELETE FROM cms_entries WHERE id = '${createdEntryId}';`);

  const entries = queryLocalD1(`SELECT count(*) AS total FROM cms_entries WHERE slug = '${testSlug}';`);
  assert.strictEqual(entries[0].total, 0, 'Test entry must be cleaned up from local D1');

  console.log('PASS Test 5: Local D1 test state cleaned up cleanly.');
}

console.log('\nALL 5 IMPORTER WRITE-PATH & TRANSACTION INTEGRATION TESTS PASSED!\n');
