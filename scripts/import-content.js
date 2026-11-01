#!/usr/bin/env node
/**
 * scripts/import-content.js
 * 
 * Idempotent Content Importer for TRAI Inc CMS
 * Imports data from existing data/*.json files into Cloudflare D1 cms_entries.
 * 
 * Usage:
 *   node scripts/import-content.js [OPTIONS]
 * 
 * Options:
 *   --dry-run               Preview items without modifying the database.
 *   --slug <slug>           Import only a specific slug (e.g. blog-ai-agents-replacing-manual-workflows).
 *   --type <type>           Filter by content type (blog, service, page, landing_page, case_study).
 *   --local                 Execute against local D1 database (default).
 *   --remote                Execute against remote Cloudflare D1 database.
 *   --confirm-remote        Safety flag required when --remote is specified.
 *   --config <path>         Path to wrangler worker config (default: wrangler.worker.jsonc).
 *   --author <email>        Author email for audit & created_by (default: imtusharrai@gmail.com).
 *   --help, -h              Display help message.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');

// Parse CLI Arguments
const args = process.argv.slice(2);
let isDryRun = false;
let filterSlug = null;
let filterType = null;
let isRemote = false;
let confirmRemote = false;
let configFile = 'wrangler.worker.jsonc';
let authorEmail = 'imtusharrai@gmail.com';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--dry-run') {
    isDryRun = true;
  } else if (arg === '--slug') {
    filterSlug = args[++i];
  } else if (arg === '--type') {
    filterType = args[++i];
  } else if (arg === '--local') {
    isRemote = false;
  } else if (arg === '--remote') {
    isRemote = true;
  } else if (arg === '--confirm-remote') {
    confirmRemote = true;
  } else if (arg === '--config') {
    configFile = args[++i];
  } else if (arg === '--author') {
    authorEmail = args[++i];
  } else if (arg === '--help' || arg === '-h') {
    console.log(`
TRAI Inc CMS Content Importer

Usage: node scripts/import-content.js [OPTIONS]

Options:
  --dry-run               Preview mapping without writing to database
  --slug <slug>           Import only the specified slug
  --type <type>           Filter by content type (page, service, blog, case_study, landing_page)
  --local                 Target local D1 database (default)
  --remote                Target remote production D1 database
  --confirm-remote        Safety confirmation flag required when using --remote
  --config <path>         Path to wrangler config (default: wrangler.worker.jsonc)
  --author <email>        Author email (default: imtusharrai@gmail.com)
  --help, -h              Show this help message
`);
    process.exit(0);
  } else {
    console.error(`Error: Unknown argument "${arg}". Run with --help for options.`);
    process.exit(1);
  }
}

if (isRemote && !confirmRemote && !isDryRun) {
  console.error('\n[SAFETY ERROR] Targeting remote production D1 requires explicit confirmation.');
  console.error('Please pass --confirm-remote alongside --remote to proceed with production writes.\n');
  process.exit(1);
}

// Helper: Escape SQL single quotes
function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Helper: Strip HTML tags for clean text
function stripHtml(html) {
  return String(html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Convert blog content array into structured sections for CMS Admin
function extractBlogSections(contentArray) {
  const sections = [];
  let currentHeading = 'Introduction';
  let currentBodyParts = [];

  for (const block of contentArray) {
    if (block.type === 'heading' || block.type === 'subheading') {
      if (currentBodyParts.length > 0) {
        sections.push({
          heading: currentHeading,
          body: currentBodyParts.join('\n\n')
        });
        currentBodyParts = [];
      }
      currentHeading = block.text;
    } else if (block.type === 'paragraph' && block.text) {
      currentBodyParts.push(block.text);
    }
  }

  if (currentBodyParts.length > 0) {
    sections.push({
      heading: currentHeading,
      body: currentBodyParts.join('\n\n')
    });
  }

  return sections;
}

// Collect all content entries across data/
function collectEntries() {
  const entries = [];

  // 1. Blog posts (data/blog-*.json)
  const files = fs.readdirSync(dataDir);
  for (const file of files) {
    if (file.startsWith('blog-') && file.endsWith('.json')) {
      const slug = path.basename(file, '.json');
      const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      const meta = raw.meta || {};
      const content = raw.content || [];
      const sections = extractBlogSections(content);

      entries.push({
        content_type: 'blog',
        slug,
        title: meta.title || slug,
        summary: meta.description || '',
        data: {
          summary: meta.description || '',
          sections,
          meta,
          content,
          relatedPosts: raw.relatedPosts || [],
          takeaways: raw.takeaways || []
        },
        seo: {
          meta_title: `${meta.title || slug} | Trai Inc`,
          meta_description: meta.description || '',
          og_image: meta.image ? (meta.image.startsWith('http') ? meta.image : `https://traiinc.com${meta.image}`) : undefined,
          canonical_url: `https://traiinc.com/${slug}`
        }
      });
    }
  }

  // 2. Services (data/services.json)
  const servicesFile = path.join(dataDir, 'services.json');
  if (fs.existsSync(servicesFile)) {
    const services = JSON.parse(fs.readFileSync(servicesFile, 'utf8'));
    for (const [key, svc] of Object.entries(services)) {
      const title = stripHtml(svc.title || key);
      const summary = stripHtml(svc.subtitle || svc.desc || '');
      const sections = (svc.features || []).map(f => ({
        heading: f.title || '',
        body: `${f.desc || ''}${f.insight ? '\n\n' + f.insight : ''}`
      }));

      entries.push({
        content_type: 'service',
        slug: key,
        title,
        summary,
        data: {
          ...svc,
          summary,
          sections
        },
        seo: {
          meta_title: `${title} | Trai Inc`,
          meta_description: summary,
          canonical_url: `https://traiinc.com/${key}`
        }
      });
    }
  }

  // 3. Case Studies (data/case-studies.json)
  const caseStudiesFile = path.join(dataDir, 'case-studies.json');
  if (fs.existsSync(caseStudiesFile)) {
    const caseStudies = JSON.parse(fs.readFileSync(caseStudiesFile, 'utf8'));
    for (const [key, cs] of Object.entries(caseStudies)) {
      const title = stripHtml(cs.hero?.title || cs.title || key);
      const summary = stripHtml(cs.hero?.tag || cs.client_overview || cs.description || '');
      const sections = [];
      if (cs.tabs && Array.isArray(cs.tabs)) {
        cs.tabs.forEach(t => {
          sections.push({
            heading: t.label || t.title || '',
            body: t.content || t.desc || ''
          });
        });
      }
      if (cs.challenge) sections.push({ heading: 'Challenge', body: cs.challenge });
      if (cs.solution) sections.push({ heading: 'Solution', body: cs.solution });
      if (cs.results && Array.isArray(cs.results)) {
        sections.push({ heading: 'Results', body: cs.results.map(r => `• ${r}`).join('\n') });
      }

      entries.push({
        content_type: 'case_study',
        slug: key,
        title,
        summary,
        data: {
          ...cs,
          summary,
          sections
        },
        seo: {
          meta_title: `${title} — Case Study | Trai Inc`,
          meta_description: summary,
          canonical_url: `https://traiinc.com/${key}`
        }
      });
    }
  }

  // 4. Landing Pages
  const landingSlugs = ['startups', 'smb', 'enterprise', 'd2c'];
  for (const s of landingSlugs) {
    const fPath = path.join(dataDir, `${s}.json`);
    if (fs.existsSync(fPath)) {
      const raw = JSON.parse(fs.readFileSync(fPath, 'utf8'));
      const title = stripHtml(raw.hero?.title || raw.title || raw.hero_title || s);
      const summary = stripHtml(raw.hero?.subtitle || raw.hero_desc || raw.subtitle || '');
      entries.push({
        content_type: 'landing_page',
        slug: s,
        title,
        summary,
        data: {
          ...raw,
          summary,
          sections: (raw.modules || raw.features || []).map(m => ({
            heading: m.title || '',
            body: m.desc || m.description || ''
          }))
        },
        seo: {
          meta_title: `${title} | Trai Inc`,
          meta_description: summary,
          canonical_url: `https://traiinc.com/${s}`
        }
      });
    }
  }

  // 5. Standalone Pages
  const pageSlugs = [
    'home', 'about', 'contact', 'careers', 'clients', 'our-development-process',
    'partner', 'solutions', 'industries', 'app-store', 'choosing-a-development-partner',
    'blog', 'privacy', 'refund', 'terms'
  ];
  for (const s of pageSlugs) {
    const fPath = path.join(dataDir, `${s}.json`);
    if (fs.existsSync(fPath)) {
      const raw = JSON.parse(fs.readFileSync(fPath, 'utf8'));
      let title = s;
      let summary = '';

      if (s === 'home') {
        title = 'Enterprise Reliability. Startup Speed.';
        summary = raw.hero?.subtitle || '';
      } else if (s === 'about') {
        title = raw.header?.title || 'About Trai Inc';
        summary = raw.header?.subtitle || '';
      } else if (s === 'contact') {
        title = 'Contact & Consultation';
        summary = raw.subtitle || 'Talk directly to senior engineers';
      } else {
        title = raw.title || raw.hero?.title || raw.header?.title || (raw.meta && raw.meta.title) || s;
        summary = raw.description || raw.hero?.subtitle || raw.header?.subtitle || (raw.meta && raw.meta.description) || '';
      }

      title = stripHtml(title);
      summary = stripHtml(summary);

      // Extract sections if privacy/terms/refund or has sections
      let sections = [];
      if (raw.sections && Array.isArray(raw.sections)) {
        sections = raw.sections.map(sec => ({
          heading: sec.heading || sec.title || '',
          body: Array.isArray(sec.paragraphs) ? sec.paragraphs.join('\n\n') : (sec.body || sec.desc || '')
        }));
      }

      entries.push({
        content_type: 'page',
        slug: s,
        title,
        summary,
        data: {
          ...raw,
          summary,
          sections
        },
        seo: {
          meta_title: `${title} | Trai Inc`,
          meta_description: summary,
          canonical_url: s === 'home' ? 'https://traiinc.com' : `https://traiinc.com/${s}`
        }
      });
    }
  }

  return entries;
}

// Main execution
(async function main() {
  console.log('────────────────────────────────────────────────────────');
  console.log('TRAI Inc CMS Content Importer');
  console.log('────────────────────────────────────────────────────────');
  console.log(`Target Mode    : ${isRemote ? 'REMOTE (Production D1)' : 'LOCAL (Local D1)'}`);
  console.log(`Dry Run        : ${isDryRun ? 'YES (Preview only)' : 'NO (Writes enabled)'}`);
  console.log(`Config File    : ${configFile}`);
  console.log(`Author Email   : ${authorEmail}`);
  if (filterSlug) console.log(`Filter Slug    : ${filterSlug}`);
  if (filterType) console.log(`Filter Type    : ${filterType}`);
  console.log('────────────────────────────────────────────────────────');

  const allEntries = collectEntries();
  const filtered = allEntries.filter(entry => {
    if (filterSlug && entry.slug !== filterSlug) return false;
    if (filterType && entry.content_type !== filterType) return false;
    return true;
  });

  if (filtered.length === 0) {
    console.log('No entries matched the specified criteria.');
    process.exit(0);
  }

  console.log(`Found ${filtered.length} entries to process:\n`);

  filtered.forEach((e, idx) => {
    const dataSize = Buffer.byteLength(JSON.stringify(e.data));
    const secCount = (e.data.sections && e.data.sections.length) || 0;
    console.log(`[${idx + 1}/${filtered.length}] [${e.content_type}] "${e.slug}" — "${e.title}" (${secCount} sections, ${dataSize} bytes)`);
  });

  if (isDryRun) {
    console.log('\n[DRY RUN] Inspection complete. No database changes were made.');
    if (filtered.length === 1) {
      console.log('\nSample Entry Payload:');
      console.log(JSON.stringify(filtered[0], null, 2).slice(0, 1000) + '...\n');
    }
    process.exit(0);
  }

  // Build SQL Statements
  const sqlStatements = [
    'PRAGMA foreign_keys = ON;',
    'BEGIN TRANSACTION;'
  ];

  for (const entry of filtered) {
    const entryId = crypto.randomUUID();
    const revisionId = crypto.randomUUID();
    const dataJson = JSON.stringify(entry.data);
    const seoJson = JSON.stringify(entry.seo);

    sqlStatements.push(`
INSERT INTO cms_entries (
  id, content_type, slug, title, data_json, seo_json, status, created_by, updated_by, created_at, updated_at, published_at
) VALUES (
  ${sqlEscape(entryId)},
  ${sqlEscape(entry.content_type)},
  ${sqlEscape(entry.slug)},
  ${sqlEscape(entry.title)},
  ${sqlEscape(dataJson)},
  ${sqlEscape(seoJson)},
  'published',
  ${sqlEscape(authorEmail)},
  ${sqlEscape(authorEmail)},
  datetime('now'),
  datetime('now'),
  datetime('now')
)
ON CONFLICT(slug) DO UPDATE SET
  content_type = excluded.content_type,
  title = excluded.title,
  data_json = excluded.data_json,
  seo_json = excluded.seo_json,
  status = excluded.status,
  updated_by = excluded.updated_by,
  updated_at = datetime('now'),
  published_at = COALESCE(cms_entries.published_at, datetime('now'));

INSERT INTO cms_entry_revisions (
  id, entry_id, title, data_json, seo_json, status, actor_email, created_at
)
SELECT
  ${sqlEscape(revisionId)},
  id,
  title,
  data_json,
  seo_json,
  status,
  updated_by,
  datetime('now')
FROM cms_entries
WHERE slug = ${sqlEscape(entry.slug)};
`);
  }

  sqlStatements.push('COMMIT;');

  // Write temporary SQL file
  const tmpDir = path.join(rootDir, '.wrangler', 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const sqlFilePath = path.join(tmpDir, `import-${Date.now()}.sql`);
  fs.writeFileSync(sqlFilePath, sqlStatements.join('\n'), 'utf8');

  console.log(`\nGenerated SQL batch file: ${sqlFilePath} (${fs.statSync(sqlFilePath).size} bytes)`);
  console.log('Executing SQL transaction against D1...');

  const d1Args = [
    'wrangler',
    'd1',
    'execute',
    'traiinc-cms',
    '--config',
    configFile,
    isRemote ? '--remote' : '--local',
    '--file',
    sqlFilePath,
    '-y'
  ];

  try {
    const stdout = execFileSync('npx', d1Args, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe']
    });
    console.log(stdout);
    console.log('✓ Successfully executed content import!');
  } catch (err) {
    console.error('\n✗ D1 Execution Failed:');
    if (err.stdout) console.error(err.stdout);
    if (err.stderr) console.error(err.stderr);
    process.exit(1);
  } finally {
    if (fs.existsSync(sqlFilePath)) {
      fs.unlinkSync(sqlFilePath);
    }
  }

  // Verification step
  console.log('\nVerifying imported entries in D1...');
  const verifySql = `SELECT content_type, slug, title, status, updated_at FROM cms_entries ${filterSlug ? `WHERE slug = ${sqlEscape(filterSlug)}` : ''} ORDER BY updated_at DESC LIMIT 10;`;
  try {
    const verifyStdout = execFileSync('npx', [
      'wrangler',
      'd1',
      'execute',
      'traiinc-cms',
      '--config',
      configFile,
      isRemote ? '--remote' : '--local',
      '--command',
      verifySql
    ], {
      cwd: rootDir,
      encoding: 'utf8'
    });
    console.log(verifyStdout);
  } catch (verifyErr) {
    console.warn('Notice: Verification query finished with warning:', verifyErr.message);
  }
})();
