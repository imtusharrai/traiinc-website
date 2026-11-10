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
 *   --status <status>       Status for imported entries: draft (default) or published.
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
let importStatus = 'draft';
let filterSlug = null;
let filterType = null;
let isRemote = false;
let confirmRemote = false;
let skipExisting = false;
let configFile = 'wrangler.worker.jsonc';
let authorEmail = 'imtusharrai@gmail.com';

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--dry-run') {
    isDryRun = true;
  } else if (arg === '--status') {
    importStatus = String(args[++i] || '').trim().toLowerCase();
    if (!['draft', 'published'].includes(importStatus)) {
      console.error(`\n[ARGUMENT ERROR] Invalid --status "${importStatus}". Supported values are 'draft' or 'published'.\n`);
      process.exit(1);
    }
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
  } else if (arg === '--skip-existing') {
    skipExisting = true;
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
  --status <status>       Status for imported entries: draft (default) or published
  --slug <slug>           Import only the specified slug
  --type <type>           Filter by content type (page, service, blog, case_study, landing_page, navigation, footer)
  --skip-existing         Skip entries that already exist in target database instead of aborting
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
  const landingSlugs = ['startups', 'smb', 'enterprise', 'd2c', 'msmes'];
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

  // 6. Global Navigation
  entries.push({
    content_type: 'navigation',
    slug: 'navigation',
    title: 'Main Navigation & Mega-Menu',
    summary: 'Global header navigation links, dropdowns, and featured callouts',
    data: {
      whoWeHelp: {
        label: 'Industries',
        title: 'Industries We Transform',
        items: [
          { label: 'Retail to D2C Brands', href: 'd2c.html', desc: 'Scale offline stores to pan-India D2C' },
          { label: 'Startups & MVPs', href: 'startups.html', desc: 'Go from idea to production in 30 days' },
          { label: 'Small & Medium Business', href: 'smb.html', desc: 'Modernize operations and eliminate spreadsheets' },
          { label: 'Large Enterprises', href: 'enterprise.html', desc: 'Cloud migration, AI integration, and zero-trust security' }
        ],
        featured: {
          title: '138+ Businesses Served',
          desc: 'Real Estate, Healthcare, FinTech, and more across 12+ industries.',
          ctaLabel: 'See Our Work →',
          ctaHref: 'clients.html'
        }
      },
      services: {
        label: 'Services',
        items: [
          { label: 'AI & Automation', href: 'ai-automation.html', desc: 'Autonomous AI agents and LLM integrations' },
          { label: 'Custom Software', href: 'custom-software.html', desc: 'Enterprise backends, APIs, and microservices' },
          { label: 'Cloud & DevOps', href: 'cloud-devops.html', desc: 'Zero-downtime architecture and multi-cloud ops' },
          { label: 'Mobile Apps', href: 'mobile-apps.html', desc: 'Native & cross-platform Flutter/React Native' },
          { label: 'Web Development', href: 'web-development.html', desc: 'Ultra-fast Next.js and Cloudflare edge sites' },
          { label: 'Data Analytics', href: 'data-analytics.html', desc: 'Dashboards, data lakes, and business intelligence' },
          { label: 'Enterprise Platforms', href: 'enterprise-platforms.html', desc: 'Custom ERP, CRM, and billing systems' },
          { label: 'UI/UX Design', href: 'ui-ux-design.html', desc: 'High-conversion design systems' },
          { label: 'Digital Marketing', href: 'digital-marketing.html', desc: 'Data-driven SEO, PPC, and growth loops' },
          { label: 'Content Creation', href: 'content-creation.html', desc: 'AI-assisted technical and multimedia content' }
        ]
      },
      company: {
        label: 'Company',
        items: [
          { label: 'About Us', href: 'about.html', desc: 'Our team, mission, and engineering culture' },
          { label: 'Development Process', href: 'our-development-process.html', desc: 'Milestone-driven, sprint-based delivery' },
          { label: 'Careers', href: 'careers.html', desc: 'Join our senior engineering team' },
          { label: 'Partner Program', href: 'partner.html', desc: 'Co-build and grow with Trai Inc' },
          { label: 'Clients & Case Studies', href: 'clients.html', desc: 'Verified outcomes and client testimonials' },
          { label: 'Contact', href: 'contact.html', desc: 'Direct access to senior leadership' }
        ]
      },
      cta: {
        label: 'Start Project',
        href: 'contact.html',
        phone: '+91 79054 95478'
      }
    },
    seo: {
      meta_title: 'Navigation | Trai Inc',
      meta_description: 'Global navigation structure for Trai Inc'
    }
  });

  // 7. Global Footer
  entries.push({
    content_type: 'footer',
    slug: 'footer',
    title: 'Global Website Footer & Locations',
    summary: 'Global footer links, office addresses, contact channels, and legal links',
    data: {
      brand_tagline: 'AI-native software engineering — delivering custom software, mobile apps, and automation systems for businesses across India.',
      contact: {
        phone: '+91 79054 95478',
        email_hello: 'hello@traiinc.com',
        email_support: 'support@traiinc.com',
        whatsapp: 'https://wa.me/917905495478?text=Hi%20Trai%20Inc,%20I%20am%20looking%20for%20a%20digital%20solution%20for%20my%20business.'
      },
      offices: [
        {
          city: 'Lucknow, India',
          type: 'Global Headquarters',
          flag: '🇮🇳',
          address: 'B-2, 11th Floor, DLF MyPad, Opposite Hyatt Regency, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010'
        },
        {
          city: 'Bengaluru, India',
          type: 'Technology & Engineering Hub',
          flag: '🇮🇳',
          address: '660, 2nd Floor, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038'
        },
        {
          city: 'Cape Town, South Africa',
          type: 'Africa Regional Hub',
          flag: '🇿🇦',
          address: 'WeWork, 80 Strand Street, Cape Town City Centre, Cape Town, Western Cape 8001'
        },
        {
          city: 'Lusaka, Zambia',
          type: 'Regional Delivery Office',
          flag: '🇿🇲',
          address: 'Green Park Estate, Off Kafue Road, Lilayi, Lusaka 10101, Zambia'
        }
      ],
      social: {
        linkedin: 'https://www.linkedin.com/company/trai-inc',
        twitter: 'https://x.com/inctrai',
        instagram: 'https://www.instagram.com/traiinc',
        youtube: 'https://www.youtube.com/@traiinc',
        whatsapp: 'https://wa.me/917905495478'
      },
      badges: [
        '🇮🇳 Made in India',
        '🔒 Milestone-Driven Sprints',
        '⚡ AI-Augmented Delivery'
      ],
      copyright: '© 2026 Trai Inc Services. All Rights Reserved'
    },
    seo: {
      meta_title: 'Footer | Trai Inc',
      meta_description: 'Global footer configuration for Trai Inc'
    }
  });

  // 8. Site Settings
  entries.push({
    content_type: 'page',
    slug: 'site-settings',
    title: 'Global Website Settings',
    summary: 'Global metadata, announcement banner, contact info, and business hours',
    data: {
      site_title: 'Trai Inc — AI-Native Engineering & Enterprise Platforms',
      primary_phone: '+91 79054 95478',
      primary_email: 'support@traiinc.com',
      whatsapp_url: 'https://wa.me/917905495478',
      announcement_banner: {
        active: false,
        message: '',
        link: ''
      },
      support_hours: 'Monday – Friday: 9:00 AM – 7:00 PM IST',
      emergency_support: '24/7 SLA available for enterprise clients'
    },
    seo: {
      meta_title: 'Site Settings | Trai Inc',
      meta_description: 'Global website settings for Trai Inc'
    }
  });

  return entries;
}

// Query existing slugs from target database to enforce fail-closed invariant
function queryExistingSlugs(slugs, isRemote, configFile, execFn = execFileSync) {
  if (!slugs || slugs.length === 0) return [];
  const slugsList = slugs.map(s => sqlEscape(s)).join(', ');
  const checkSql = `SELECT slug FROM cms_entries WHERE slug IN (${slugsList});`;

  let rawOut;
  try {
    rawOut = execFn('npx', [
      'wrangler',
      'd1',
      'execute',
      'traiinc-cms',
      '--config',
      configFile,
      isRemote ? '--remote' : '--local',
      '--command',
      checkSql,
      '--json'
    ], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe']
    });
  } catch (err) {
    const errorDetails = err.stderr ? err.stderr.toString().trim() : (err.message || String(err));
    throw new Error(`D1 preflight command execution failed on ${isRemote ? 'remote' : 'local'} database: ${errorDetails}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(rawOut);
  } catch (parseErr) {
    throw new Error(`D1 preflight query returned unparseable JSON output: ${String(rawOut).slice(0, 200)}`);
  }

  if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].success) {
    const d1ErrMsg = (parsed && parsed[0] && (parsed[0].error || (parsed[0].errors && parsed[0].errors[0]))) || 'D1 returned failure in preflight';
    throw new Error(`D1 preflight query was not successful: ${d1ErrMsg}`);
  }

  if (Array.isArray(parsed[0].results)) {
    return parsed[0].results.map(r => r.slug);
  }

  throw new Error(`D1 preflight query response missing expected results array`);
}

// Build SQL statements for a single entry and its corresponding revision (strictly paired)
function buildEntrySql(entry, authorEmail, entryId = crypto.randomUUID(), revisionId = crypto.randomUUID(), status = 'draft') {
  if (!['draft', 'published'].includes(status)) {
    throw new Error(`Invalid status "${status}". Must be 'draft' or 'published'.`);
  }
  const isDraft = status === 'draft';
  const dataJson = JSON.stringify(entry.data);
  const seoJson = JSON.stringify(entry.seo);

  const entrySql = `INSERT INTO cms_entries (
  id, content_type, slug, title, data_json, seo_json, status, created_by, updated_by, created_at, updated_at, published_at
) VALUES (
  ${sqlEscape(entryId)},
  ${sqlEscape(entry.content_type)},
  ${sqlEscape(entry.slug)},
  ${sqlEscape(entry.title)},
  ${sqlEscape(dataJson)},
  ${sqlEscape(seoJson)},
  ${sqlEscape(status)},
  ${sqlEscape(authorEmail)},
  ${sqlEscape(authorEmail)},
  datetime('now'),
  datetime('now'),
  ${isDraft ? 'NULL' : "datetime('now')"}
);`;

  const revisionSql = `INSERT INTO cms_entry_revisions (
  id, entry_id, title, data_json, seo_json, status, actor_email, created_at
) VALUES (
  ${sqlEscape(revisionId)},
  ${sqlEscape(entryId)},
  ${sqlEscape(entry.title)},
  ${sqlEscape(dataJson)},
  ${sqlEscape(seoJson)},
  ${sqlEscape(status)},
  ${sqlEscape(authorEmail)},
  datetime('now')
);`;

  return [entrySql, revisionSql];
}

// Build combined SQL batch for all entries without transaction pragma/wrapper keywords
function buildImportBatchSql(entries, authorEmail, status = 'draft') {
  if (!['draft', 'published'].includes(status)) {
    throw new Error(`Invalid status "${status}". Must be 'draft' or 'published'.`);
  }
  const statements = [];
  for (const entry of entries) {
    statements.push(...buildEntrySql(entry, authorEmail, undefined, undefined, status));
  }
  return statements.join('\n\n');
}

// Write temporary SQL batch file for D1 execution
function writeSqlBatchFile(sqlContent) {
  const tmpDir = path.join(rootDir, '.wrangler', 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const sqlFilePath = path.join(tmpDir, `import-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.sql`);
  fs.writeFileSync(sqlFilePath, sqlContent, 'utf8');
  return sqlFilePath;
}

// Execute SQL file against D1 (Cloudflare D1 treats files as atomic implicit transactions)
function executeD1SqlFile(sqlFilePath, isRemote, configFile, execFn = execFileSync) {
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
    return execFn('npx', d1Args, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['inherit', 'pipe', 'pipe']
    });
  } catch (err) {
    const errorDetails = err.stderr ? err.stderr.toString().trim() : (err.message || String(err));
    throw new Error(`D1 execution failed on ${isRemote ? 'remote' : 'local'} database: ${errorDetails}`);
  }
}

// Execute atomic batch import with preflight duplicate check
function executeImportBatch(entries, authorEmail, isRemote, configFile, execFn = execFileSync, status = 'draft', skipExisting = false) {
  if (!['draft', 'published'].includes(status)) {
    throw new Error(`Invalid status "${status}". Must be 'draft' or 'published'.`);
  }
  if (!entries || entries.length === 0) return { count: 0, stdout: '' };

  const slugs = entries.map(e => e.slug);
  const existingSlugs = queryExistingSlugs(slugs, isRemote, configFile, execFn);
  if (existingSlugs.length > 0) {
    if (skipExisting) {
      entries = entries.filter(e => !existingSlugs.includes(e.slug));
      if (entries.length === 0) return { count: 0, stdout: 'All entries already exist in target database.' };
    } else {
      throw new Error(`Duplicate slug(s) detected: ${existingSlugs.join(', ')}. Write aborted with zero changes.`);
    }
  }

  const sqlContent = buildImportBatchSql(entries, authorEmail, status);
  const sqlFilePath = writeSqlBatchFile(sqlContent);

  try {
    const stdout = executeD1SqlFile(sqlFilePath, isRemote, configFile, execFn);
    return { count: entries.length, stdout };
  } finally {
    if (fs.existsSync(sqlFilePath)) {
      try { fs.unlinkSync(sqlFilePath); } catch (_) {}
    }
  }
}

// Main execution
async function main() {
  console.log('────────────────────────────────────────────────────────');
  console.log('TRAI Inc CMS Content Importer');
  console.log('────────────────────────────────────────────────────────');
  console.log(`Target Mode    : ${isRemote ? 'REMOTE (Production D1)' : 'LOCAL (Local D1)'}`);
  console.log(`Import Status  : ${importStatus.toUpperCase()}`);
  console.log(`Dry Run        : ${isDryRun ? 'YES (Preview only)' : 'NO (Writes enabled)'}`);
  console.log(`Config File    : ${configFile}`);
  console.log(`Author Email   : ${authorEmail}`);
  if (filterSlug) console.log(`Filter Slug    : ${filterSlug}`);
  if (filterType) console.log(`Filter Type    : ${filterType}`);
  console.log('────────────────────────────────────────────────────────');

  const allEntries = collectEntries();
  let filtered = allEntries.filter(entry => {
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

  console.log('\nChecking target database for existing entries...');
  let existingSlugs;
  try {
    existingSlugs = queryExistingSlugs(filtered.map(e => e.slug), isRemote, configFile);
  } catch (err) {
    console.error(`\n❌ [PREFLIGHT ERROR - DATABASE QUERY FAILED]`);
    console.error(`Failed to inspect ${isRemote ? 'remote production' : 'local'} D1 database to verify existing entries.`);
    console.error(`Preflight check failed closed: refusing to proceed when database state is unverified.`);
    console.error(`Error details: ${err.message}`);
    console.error(`Zero database writes were executed.\n`);
    process.exit(1);
  }

  if (existingSlugs.length > 0 && skipExisting) {
    console.log(`\nℹ️  [SKIP-EXISTING] Skipping ${existingSlugs.length} entry/entries already in target database:`);
    existingSlugs.forEach(s => console.log(`   • ${s}`));
    filtered = filtered.filter(e => !existingSlugs.includes(e.slug));
    if (filtered.length === 0) {
      console.log('\n✓ All target entries already exist in the database. Zero writes required.\n');
      process.exit(0);
    }
    console.log(`\nProceeding with import for remaining ${filtered.length} entries...`);
  }

  const sqlBatch = buildImportBatchSql(filtered, authorEmail, importStatus);

  if (isDryRun) {
    if (existingSlugs.length > 0 && !skipExisting) {
      console.log(`\n⚠️  [DRY RUN - EXISTING ENTRIES DETECTED]`);
      console.log(`The following ${existingSlugs.length} slug(s) ALREADY EXIST in the database and would be BLOCKED:`);
      existingSlugs.forEach(s => console.log(`   • ${s}`));
      console.log(`The importer is strictly insert-only and fails closed on duplicate slugs to prevent overwriting content.`);
    } else {
      console.log(`\n✓ [DRY RUN - SAFE] No duplicate slugs found in target database. Ready for insert.`);
    }

    console.log(`\n[DRY RUN] Generated SQL Batch Preview (${filtered.length} entries, ${Buffer.byteLength(sqlBatch)} bytes):`);
    console.log('────────────────────────────────────────────────────────');
    console.log(sqlBatch);
    console.log('────────────────────────────────────────────────────────');
    console.log('\n[DRY RUN] Inspection complete. Zero database writes were executed.\n');
    process.exit(0);
  }

  // FAIL CLOSED CHECK: If any slug already exists (and not skipped), ABORT immediately!
  if (existingSlugs.length > 0 && !skipExisting) {
    console.error(`\n❌ [ABORT - DUPLICATE SLUG DETECTED]`);
    console.error(`The following ${existingSlugs.length} slug(s) already exist in ${isRemote ? 'remote production' : 'local'} D1:`);
    existingSlugs.forEach(s => console.error(`   • ${s}`));
    console.error(`\nFailing safely: The importer is strictly insert-only to prevent overwriting existing content.`);
    console.error(`Use --skip-existing if you wish to import only new entries without failing.`);
    console.error(`Zero database writes were executed.\n`);
    process.exit(1);
  }

  console.log(`\nExecuting atomic SQL batch import (${filtered.length} entries)...`);
  const sqlFilePath = writeSqlBatchFile(sqlBatch);
  console.log(`Generated SQL batch file: ${sqlFilePath} (${fs.statSync(sqlFilePath).size} bytes)`);

  try {
    const stdout = executeD1SqlFile(sqlFilePath, isRemote, configFile);
    if (stdout) console.log(stdout);
    console.log('✓ Successfully executed content import!');
  } catch (err) {
    console.error('\n✗ D1 Execution Failed:');
    console.error(err.message);
    process.exit(1);
  } finally {
    if (fs.existsSync(sqlFilePath)) {
      try { fs.unlinkSync(sqlFilePath); } catch (_) {}
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
}

if (require.main === module) {
  main().catch(err => {
    console.error('Fatal importer error:', err);
    process.exit(1);
  });
}

module.exports = {
  queryExistingSlugs,
  collectEntries,
  extractBlogSections,
  sqlEscape,
  stripHtml,
  buildEntrySql,
  buildImportBatchSql,
  writeSqlBatchFile,
  executeD1SqlFile,
  executeImportBatch
};
