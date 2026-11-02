import assert from 'node:assert';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import workerModule from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('Running Phase 10C CMS Publishing Lifecycle & Cache Invalidation Test Suite...\n');

// 1. Locate local D1 SQLite database
function getLocalD1Database() {
  const baseDir = path.join(rootDir, '.wrangler/state/v3/d1/miniflare-D1DatabaseObject');
  if (!fs.existsSync(baseDir)) return null;
  const files = fs.readdirSync(baseDir);
  const sqliteFile = files.find(f => f.endsWith('.sqlite') && !f.startsWith('metadata'));
  if (!sqliteFile) return null;
  return new DatabaseSync(path.join(baseDir, sqliteFile));
}

// 2. D1 Adapter with robust batch and direct/bind statement support
function createD1Adapter(sqlite) {
  return {
    prepare(sql) {
      function makeStatement(args = []) {
        return {
          _sql: sql,
          _args: args,
          bind(...newArgs) {
            return makeStatement(newArgs);
          },
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
      return makeStatement();
    },
    async batch(statements) {
      sqlite.exec('BEGIN TRANSACTION;');
      try {
        const results = [];
        for (const prep of statements) {
          const stmt = sqlite.prepare(prep._sql);
          const info = stmt.run(...(prep._args || []));
          results.push({ meta: { changes: info.changes } });
        }
        sqlite.exec('COMMIT;');
        return results;
      } catch (err) {
        sqlite.exec('ROLLBACK;');
        throw err;
      }
    }
  };
}

const localDb = getLocalD1Database();
assert.ok(localDb, 'Local SQLite database must be available');

// 3. Spy Cache ExecutionContext
const purgedTagsHistory = [];
const mockCtx = {
  cache: {
    async purge({ tags }) {
      purgedTagsHistory.push(...tags);
      return { success: true };
    }
  }
};

const authorEmail = 'owner@traiinc.com';
const workerEnv = {
  ENVIRONMENT: 'test',
  ADMIN_ORIGIN: 'https://admin.traiinc.com',
  __testMember: { email: authorEmail, role: 'owner' },
  DB: createD1Adapter(localDb)
};

const testSlug = `lifecycle-test-${Date.now()}`;
let testEntryId = null;

// ============================================================================
// Step 1: Create Draft Entry (POST /api/admin/v1/entries)
// ============================================================================
{
  const purgeCountBefore = purgedTagsHistory.length;
  const createPayload = {
    title: 'Publishing Lifecycle Pilot Article',
    slug: testSlug,
    content_type: 'blog',
    data: {
      summary: 'Initial draft article summary for lifecycle validation.',
      sections: [
        { heading: 'Introduction', body: 'This is the initial draft paragraph.' }
      ]
    },
    seo: {
      meta_title: 'SEO Title · Lifecycle Test | Trai Inc',
      meta_description: 'Initial draft SEO description.',
      og_image: 'https://traiinc.com/img/blog/lifecycle-test.webp',
      canonical_url: `https://traiinc.com/${testSlug}`
    }
  };

  const createReq = new Request('https://api.traiinc.com/api/admin/v1/entries', {
    method: 'POST',
    headers: {
      'Origin': 'https://admin.traiinc.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createPayload)
  });

  const createRes = await workerModule.fetch(createReq, workerEnv, mockCtx);
  assert.strictEqual(createRes.status, 201, 'Create entry must return HTTP 201');
  const createData = await createRes.json();
  assert.ok(createData.id, 'Response must include generated entry id');
  assert.strictEqual(createData.status, 'draft', 'New entry must have draft status');
  testEntryId = createData.id;

  // Verify database record
  const stmt = localDb.prepare('SELECT status, published_at FROM cms_entries WHERE id = ?');
  const row = stmt.get(testEntryId);
  assert.strictEqual(row.status, 'draft', 'Database status must be draft');
  assert.strictEqual(row.published_at, null, 'Database published_at must be NULL for draft');

  // Verify paired revision
  const revStmt = localDb.prepare("SELECT count(*) AS count FROM cms_entry_revisions WHERE entry_id = ? AND status = 'draft'");
  const revRow = revStmt.get(testEntryId);
  assert.strictEqual(revRow.count, 1, 'Exactly one paired draft revision must exist');

  // Verify zero cache invalidations on draft creation
  assert.strictEqual(purgedTagsHistory.length, purgeCountBefore, 'Draft creation must not trigger cache invalidation');
  console.log('PASS Step 1: Create draft entry (HTTP 201, draft status, published_at NULL, 0 cache purges).');
}

// ============================================================================
// Step 2 & 3: Public API returns 404 for draft with Cache-Control: no-store
// ============================================================================
{
  const publicReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${testSlug}`, {
    method: 'GET'
  });

  const publicRes = await workerModule.fetch(publicReq, workerEnv, mockCtx);
  assert.strictEqual(publicRes.status, 404, 'Public content API must return HTTP 404 for draft entry');
  assert.strictEqual(publicRes.headers.get('cache-control'), 'no-store', 'Draft 404 must return Cache-Control: no-store');

  const publicData = await publicRes.json();
  assert.strictEqual(publicData.error, 'Not found');
  assert.strictEqual(publicData.item, undefined, 'Draft content and SEO must NOT be exposed publicly');
  console.log('PASS Steps 2 & 3: Public content API returns 404 with Cache-Control: no-store (zero draft leakage).');
}

// ============================================================================
// Step 4: Publish Entry (POST /api/admin/v1/entries/:id/publish)
// ============================================================================
{
  const purgeCountBefore = purgedTagsHistory.length;
  const publishReq = new Request(`https://api.traiinc.com/api/admin/v1/entries/${testEntryId}/publish`, {
    method: 'POST',
    headers: { 'Origin': 'https://admin.traiinc.com' }
  });

  const publishRes = await workerModule.fetch(publishReq, workerEnv, mockCtx);
  assert.strictEqual(publishRes.status, 200, 'Publish endpoint must return HTTP 200');
  const publishData = await publishRes.json();
  assert.strictEqual(publishData.status, 'published');

  // Verify database record
  const stmt = localDb.prepare('SELECT status, published_at FROM cms_entries WHERE id = ?');
  const row = stmt.get(testEntryId);
  assert.strictEqual(row.status, 'published', 'Database status must be published');
  assert.ok(row.published_at !== null, 'Database published_at must be populated');

  // Verify cache invalidation invoked
  const newPurges = purgedTagsHistory.slice(purgeCountBefore);
  assert.ok(newPurges.includes('cms-public-content'), 'Must purge cms-public-content tag on publish');
  assert.ok(newPurges.includes(`cms-entry:${testSlug}`), `Must purge cms-entry:${testSlug} tag on publish`);
  console.log('PASS Step 4: Publish entry (HTTP 200, status published, published_at populated, cache purged).');
}

// ============================================================================
// Steps 5, 6, 7 & 8: Public API returns 200 with content, SEO, and cache tags
// ============================================================================
{
  const publicReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${testSlug}`, {
    method: 'GET'
  });

  const publicRes = await workerModule.fetch(publicReq, workerEnv, mockCtx);
  assert.strictEqual(publicRes.status, 200, 'Public API must return HTTP 200 for published entry');

  // Step 7: Verify Cache Headers & Tags
  const cacheControl = publicRes.headers.get('cache-control') || '';
  const cacheTag = publicRes.headers.get('cache-tag') || '';

  assert.ok(cacheControl.includes('public'), 'Cache-Control must be public');
  assert.ok(cacheControl.includes('s-maxage=300'), 'Cache-Control must specify s-maxage=300');
  assert.ok(cacheControl.includes('must-revalidate'), 'Cache-Control must specify must-revalidate');
  assert.ok(cacheTag.includes('cms-public-content'), 'Cache-Tag must include cms-public-content');
  assert.ok(cacheTag.includes(`cms-entry:${testSlug}`), `Cache-Tag must include cms-entry:${testSlug}`);

  // Step 5 & 6: Verify Content and SEO payload
  const publicData = await publicRes.json();
  assert.ok(publicData.item, 'Response must have item');
  assert.strictEqual(publicData.item.title, 'Publishing Lifecycle Pilot Article');
  assert.strictEqual(publicData.item.data.summary, 'Initial draft article summary for lifecycle validation.');
  assert.strictEqual(publicData.item.seo.meta_title, 'SEO Title · Lifecycle Test | Trai Inc');
  assert.strictEqual(publicData.item.seo.meta_description, 'Initial draft SEO description.');
  assert.strictEqual(publicData.item.seo.og_image, 'https://traiinc.com/img/blog/lifecycle-test.webp');
  assert.strictEqual(publicData.item.seo.canonical_url, `https://traiinc.com/${testSlug}`);
  console.log('PASS Steps 5, 6, 7 & 8: Public API returns 200 with content, SEO, and edge cache tags.');
}

// ============================================================================
// Steps 9 & 10: Update Published Entry (PATCH /entries/:id) triggers revision & cache purge
// ============================================================================
{
  const purgeCountBefore = purgedTagsHistory.length;
  const updatePayload = {
    title: 'Updated: Publishing Lifecycle Article',
    data: {
      summary: 'Updated article summary with fresh insights.',
      sections: [
        { heading: 'Updated Section', body: 'Updated body paragraph with new data.' }
      ]
    },
    seo: {
      meta_title: 'Updated SEO Title · Lifecycle Test | Trai Inc',
      meta_description: 'Updated SEO description.',
      og_image: 'https://traiinc.com/img/blog/lifecycle-updated.webp',
      canonical_url: `https://traiinc.com/${testSlug}`
    }
  };

  const updateReq = new Request(`https://api.traiinc.com/api/admin/v1/entries/${testEntryId}`, {
    method: 'PATCH',
    headers: {
      'Origin': 'https://admin.traiinc.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatePayload)
  });

  const updateRes = await workerModule.fetch(updateReq, workerEnv, mockCtx);
  assert.strictEqual(updateRes.status, 200, 'Update must return HTTP 200');

  // Verify revisions in database
  const revStmt = localDb.prepare('SELECT count(*) AS count FROM cms_entry_revisions WHERE entry_id = ?');
  const revRow = revStmt.get(testEntryId);
  assert.strictEqual(revRow.count, 2, 'Exactly two revisions must exist after update');

  // Verify cache invalidation invoked for published entry
  const newPurges = purgedTagsHistory.slice(purgeCountBefore);
  assert.ok(newPurges.includes('cms-public-content'), 'Must purge cms-public-content on update of published entry');
  assert.ok(newPurges.includes(`cms-entry:${testSlug}`), `Must purge cms-entry:${testSlug} on update`);

  // Verify updated content available via public API
  const publicReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${testSlug}`, { method: 'GET' });
  const publicRes = await workerModule.fetch(publicReq, workerEnv, mockCtx);
  const publicData = await publicRes.json();
  assert.strictEqual(publicData.item.title, 'Updated: Publishing Lifecycle Article');
  assert.strictEqual(publicData.item.seo.meta_title, 'Updated SEO Title · Lifecycle Test | Trai Inc');
  console.log('PASS Steps 9 & 10: Update published entry creates new revision & triggers cache purge.');
}

// ============================================================================
// Steps 11, 12 & 13: Unpublish Entry (POST /entries/:id/unpublish) returns 404 no-store
// ============================================================================
{
  const purgeCountBefore = purgedTagsHistory.length;
  const unpublishReq = new Request(`https://api.traiinc.com/api/admin/v1/entries/${testEntryId}/unpublish`, {
    method: 'POST',
    headers: { 'Origin': 'https://admin.traiinc.com' }
  });

  const unpublishRes = await workerModule.fetch(unpublishReq, workerEnv, mockCtx);
  assert.strictEqual(unpublishRes.status, 200, 'Unpublish must return HTTP 200');
  const unpublishData = await unpublishRes.json();
  assert.strictEqual(unpublishData.status, 'draft');

  // Verify database status
  const stmt = localDb.prepare('SELECT status FROM cms_entries WHERE id = ?');
  const row = stmt.get(testEntryId);
  assert.strictEqual(row.status, 'draft');

  // Verify cache invalidation invoked
  const newPurges = purgedTagsHistory.slice(purgeCountBefore);
  assert.ok(newPurges.includes('cms-public-content'), 'Must purge cms-public-content on unpublish');
  assert.ok(newPurges.includes(`cms-entry:${testSlug}`), `Must purge cms-entry:${testSlug} on unpublish`);

  // Verify public API returns 404 with no-store
  const publicReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${testSlug}`, { method: 'GET' });
  const publicRes = await workerModule.fetch(publicReq, workerEnv, mockCtx);
  assert.strictEqual(publicRes.status, 404, 'Public API must return HTTP 404 after unpublish');
  assert.strictEqual(publicRes.headers.get('cache-control'), 'no-store', 'Unpublished 404 must be no-store');
  console.log('PASS Steps 11, 12 & 13: Unpublish entry (HTTP 200, status draft, public API 404 no-store, cache purged).');
}

// ============================================================================
// Step 14: Archive Entry (POST /entries/:id/archive)
// ============================================================================
{
  const archiveReq = new Request(`https://api.traiinc.com/api/admin/v1/entries/${testEntryId}/archive`, {
    method: 'POST',
    headers: { 'Origin': 'https://admin.traiinc.com' }
  });

  const archiveRes = await workerModule.fetch(archiveReq, workerEnv, mockCtx);
  assert.strictEqual(archiveRes.status, 200, 'Archive must return HTTP 200');
  const archiveData = await archiveRes.json();
  assert.strictEqual(archiveData.status, 'archived');

  const stmt = localDb.prepare('SELECT status FROM cms_entries WHERE id = ?');
  const row = stmt.get(testEntryId);
  assert.strictEqual(row.status, 'archived', 'Database status must be archived');

  const publicReq = new Request(`https://api.traiinc.com/api/public/v1/content?slug=${testSlug}`, { method: 'GET' });
  const publicRes = await workerModule.fetch(publicReq, workerEnv, mockCtx);
  assert.strictEqual(publicRes.status, 404, 'Public API must return HTTP 404 for archived entry');
  console.log('PASS Step 14: Archive entry (HTTP 200, status archived, public API returns 404).');
}

// ============================================================================
// Step 15: Failed Mutations Do Not Trigger Cache Invalidation
// ============================================================================
{
  const purgeCountBefore = purgedTagsHistory.length;
  const nonExistentReq = new Request('https://api.traiinc.com/api/admin/v1/entries/00000000-0000-0000-0000-000000000000/publish', {
    method: 'POST',
    headers: { 'Origin': 'https://admin.traiinc.com' }
  });

  const res = await workerModule.fetch(nonExistentReq, workerEnv, mockCtx);
  assert.strictEqual(res.status, 404, 'Non-existent entry publish must return HTTP 404');
  assert.strictEqual(purgedTagsHistory.length, purgeCountBefore, 'Failed mutation must NOT trigger cache invalidation');
  console.log('PASS Step 15: Failed mutations do not trigger cache invalidation.');
}

// ============================================================================
// Step 16: Unauthorized Requests Cannot Mutate or Invalidate Cache
// ============================================================================
{
  const purgeCountBefore = purgedTagsHistory.length;
  const viewerEnv = {
    ...workerEnv,
    __testMember: { email: 'viewer@traiinc.com', role: 'viewer' }
  };

  const publishReq = new Request(`https://api.traiinc.com/api/admin/v1/entries/${testEntryId}/publish`, {
    method: 'POST',
    headers: { 'Origin': 'https://admin.traiinc.com' }
  });

  const res = await workerModule.fetch(publishReq, viewerEnv, mockCtx);
  assert.strictEqual(res.status, 403, 'Viewer role must be rejected with HTTP 403');
  assert.strictEqual(purgedTagsHistory.length, purgeCountBefore, 'Unauthorized request must NOT trigger cache invalidation');
  console.log('PASS Step 16: Unauthorized requests cannot mutate entries or trigger cache invalidation.');
}

// ============================================================================
// Step 17: Public Content List Cache Headers
// ============================================================================
{
  const listReq = new Request('https://api.traiinc.com/api/public/v1/content', { method: 'GET' });
  const listRes = await workerModule.fetch(listReq, workerEnv, mockCtx);
  assert.strictEqual(listRes.status, 200);

  const cacheControl = listRes.headers.get('cache-control') || '';
  const cacheTag = listRes.headers.get('cache-tag') || '';

  assert.ok(cacheControl.includes('public'));
  assert.ok(cacheControl.includes('s-maxage=300'));
  assert.strictEqual(cacheTag, 'cms-public-content');
  console.log('PASS Step 17: Public content list endpoint returns Cache-Tag: cms-public-content.');
}

// ============================================================================
// Step 18: State Isolation & Cleanup
// ============================================================================
{
  localDb.exec(`
    DELETE FROM cms_entry_revisions WHERE entry_id = '${testEntryId}';
    DELETE FROM cms_audit_logs WHERE entity_id = '${testEntryId}';
    DELETE FROM cms_entries WHERE id = '${testEntryId}';
  `);

  const stmt = localDb.prepare('SELECT count(*) AS count FROM cms_entries WHERE id = ?');
  const row = stmt.get(testEntryId);
  assert.strictEqual(row.count, 0, 'Test entry must be completely purged from local D1');
  console.log('PASS Step 18: Local D1 test state cleaned up (all test entries & revisions purged).');
}

console.log('\nALL 18 PUBLISHING LIFECYCLE & CACHE INVALIDATION TESTS PASSED SUCCESSFULLY!\n');
