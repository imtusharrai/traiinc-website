import assert from 'node:assert';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { queryExistingSlugs } from '../scripts/import-content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const importerScript = path.join(rootDir, 'scripts/import-content.js');

console.log('Running Importer Preflight Fail-Closed Test Suite...\n');

// ============================================================================
// Test 1: Remote D1 query failure fails closed (throws & exits nonzero)
// ============================================================================
{
  // 1a. Direct function test with simulated runner failure
  const mockFailingRunner = () => {
    const err = new Error('Remote Cloudflare API 500 Internal Server Error');
    err.stderr = Buffer.from('Error: Failed to connect to Cloudflare D1 service');
    throw err;
  };

  assert.throws(
    () => queryExistingSlugs(['test-slug'], true, 'wrangler.worker.jsonc', mockFailingRunner),
    (err) => {
      assert.ok(err.message.includes('D1 preflight command execution failed on remote database'));
      return true;
    },
    'queryExistingSlugs must throw on remote D1 failure'
  );

  // 1b. CLI process test with invalid config to trigger real remote preflight failure
  let cliExitedWithNonzero = false;
  try {
    execFileSync('node', [
      importerScript,
      '--dry-run',
      '--remote',
      '--config',
      'non-existent-config-file.jsonc',
      '--slug',
      'blog-ai-agents-replacing-manual-workflows'
    ], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (err) {
    cliExitedWithNonzero = true;
    assert.strictEqual(err.status, 1, 'CLI must exit with code 1 on remote preflight failure');
    assert.ok(
      err.stderr.includes('PREFLIGHT ERROR') || err.stderr.includes('D1 preflight command execution failed'),
      'Must report preflight error on stderr'
    );
  }
  assert.strictEqual(cliExitedWithNonzero, true, 'Remote failure must abort process');
  console.log('PASS Test 1: Remote D1 query failure fails closed (throws and exits nonzero).');
}

// ============================================================================
// Test 2: Local D1 query failure fails closed (throws & exits nonzero)
// ============================================================================
{
  // 2a. Direct function test with malformed runner JSON output
  const mockMalformedRunner = () => '<html>502 Bad Gateway</html>';

  assert.throws(
    () => queryExistingSlugs(['blog-ai-agents-replacing-manual-workflows'], false, 'wrangler.worker.jsonc', mockMalformedRunner),
    (err) => {
      assert.ok(err.message.includes('D1 preflight query returned unparseable JSON output'));
      return true;
    },
    'queryExistingSlugs must throw on unparseable D1 output'
  );

  // 2b. Direct function test with runner returning success: false
  const mockFailureRunner = () => JSON.stringify([{ success: false, error: 'Database disk image is malformed' }]);

  assert.throws(
    () => queryExistingSlugs(['blog-ai-agents-replacing-manual-workflows'], false, 'wrangler.worker.jsonc', mockFailureRunner),
    (err) => {
      assert.ok(err.message.includes('D1 preflight query was not successful'));
      return true;
    },
    'queryExistingSlugs must throw when D1 returns success: false'
  );

  // 2c. CLI process test with invalid config to trigger real local preflight failure
  let cliExitedWithNonzero = false;
  try {
    execFileSync('node', [
      importerScript,
      '--dry-run',
      '--local',
      '--config',
      'non-existent-config-file.jsonc',
      '--slug',
      'blog-ai-agents-replacing-manual-workflows'
    ], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (err) {
    cliExitedWithNonzero = true;
    assert.strictEqual(err.status, 1, 'CLI must exit with code 1 on local preflight failure');
  }
  assert.strictEqual(cliExitedWithNonzero, true, 'Local preflight failure must abort process');
  console.log('PASS Test 2: Local D1 query failure fails closed (throws and exits nonzero).');
}

// ============================================================================
// Test 3: Duplicate slug detected aborts before SQL generation (zero writes)
// ============================================================================
{
  // 3a. Direct function test verifying duplicate detected
  const mockDuplicateRunner = () => JSON.stringify([
    {
      success: true,
      results: [{ slug: 'blog-ai-agents-replacing-manual-workflows' }]
    }
  ]);

  const existing = queryExistingSlugs(['blog-ai-agents-replacing-manual-workflows'], false, 'wrangler.worker.jsonc', mockDuplicateRunner);
  assert.deepStrictEqual(existing, ['blog-ai-agents-replacing-manual-workflows']);

  // 3b. CLI process test against actual local D1 (where this slug exists)
  let cliDuplicateAborted = false;
  try {
    execFileSync('node', [
      importerScript,
      '--local',
      '--slug',
      'blog-ai-agents-replacing-manual-workflows'
    ], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (err) {
    cliDuplicateAborted = true;
    assert.strictEqual(err.status, 1, 'Duplicate slug must exit with code 1');
    assert.ok(err.stderr.includes('DUPLICATE SLUG DETECTED'), 'Must report duplicate slug');
    assert.ok(err.stderr.includes('strictly insert-only'), 'Must state strictly insert-only');
    assert.ok(err.stderr.includes('Zero database writes were executed'), 'Must confirm zero writes');
  }
  assert.strictEqual(cliDuplicateAborted, true, 'Write mode with duplicate slug must abort');
  console.log('PASS Test 3: Duplicate slug detected aborts before SQL generation (zero writes).');
}

// ============================================================================
// Test 4: Successful empty-result query passes preflight safely
// ============================================================================
{
  // 4a. Direct function test verifying empty results array returns []
  const mockEmptyRunner = () => JSON.stringify([
    {
      success: true,
      results: []
    }
  ]);

  const emptyResult = queryExistingSlugs(['blog-5-free-digital-tools-msme'], false, 'wrangler.worker.jsonc', mockEmptyRunner);
  assert.deepStrictEqual(emptyResult, [], 'Must return empty array on clean query with no duplicates');

  // 4b. CLI process dry-run test with un-imported slug (exists in data/ but not yet in D1)
  const stdout = execFileSync('node', [
    importerScript,
    '--dry-run',
    '--local',
    '--slug',
    'blog-5-free-digital-tools-msme'
  ], {
    cwd: rootDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  assert.ok(stdout.includes('DRY RUN - SAFE'), 'Dry run must report SAFE when no duplicates exist');
  assert.ok(stdout.includes('No duplicate slugs found in target database'), 'Must report no duplicates found');
  console.log('PASS Test 4: Successful empty-result query passes preflight safely.');
}

console.log('\nALL 4 IMPORTER PREFLIGHT FAIL-CLOSED TESTS PASSED!\n');
