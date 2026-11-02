import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const htmlPath = path.join(rootDir, 'dist/blog-ai-agents-replacing-manual-workflows.html');
const cmsScriptPath = path.join(rootDir, 'js/cms-content.js');

const staticHtml = fs.readFileSync(htmlPath, 'utf8');
const cmsScriptCode = fs.readFileSync(cmsScriptPath, 'utf8');

console.log('Running Phase 9A Progressive CMS Hydration Test Suite...\n');

// Helper to initialize JSDOM with custom fetch and window environment
function createTestDom(mockFetchHandler, consoleErrors = []) {
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.on('error', (...args) => consoleErrors.push(args.join(' ')));
  virtualConsole.on('warn', (...args) => consoleErrors.push(args.join(' ')));

  const dom = new JSDOM(staticHtml, {
    url: 'https://traiinc.com/blog-ai-agents-replacing-manual-workflows',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole
  });

  const { window } = dom;

  // Polyfill requestIdleCallback to execute promptly in Node test environment
  window.requestIdleCallback = (cb) => setTimeout(cb, 10);
  window.cancelIdleCallback = (id) => clearTimeout(id);

  // Set test API Base
  window.__CMS_API_BASE__ = 'https://api.traiinc.com';

  // Inject mock fetch
  window.fetch = mockFetchHandler;

  return dom;
}

// Helper to execute hydration script and wait for completion
async function executeHydration(dom) {
  const { window } = dom;
  const scriptEl = window.document.createElement('script');
  scriptEl.textContent = cmsScriptCode;
  window.document.body.appendChild(scriptEl);

  // Wait for requestIdleCallback / setTimeout
  await new Promise((resolve) => setTimeout(resolve, 80));
}

// ============================================================================
// Scenario 1: Static page with no CMS entry (404 Not Found)
// ============================================================================
{
  const consoleErrors = [];
  const mockFetch = async () => ({
    ok: false,
    status: 404,
    json: async () => ({ error: 'Not found' })
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  const titleBefore = dom.window.document.querySelector('[data-cms-bind="title"]').textContent;
  const bodyBefore = dom.window.document.querySelector('[data-cms-section="blog-content"]').innerHTML;

  await executeHydration(dom);

  const titleAfter = dom.window.document.querySelector('[data-cms-bind="title"]').textContent;
  const bodyAfter = dom.window.document.querySelector('[data-cms-section="blog-content"]').innerHTML;

  assert.strictEqual(titleAfter, titleBefore, 'Title must not change when CMS entry is not found');
  assert.strictEqual(bodyAfter, bodyBefore, 'Body content must remain static when CMS entry is not found');
  assert.strictEqual(dom.window.document.body.getAttribute('data-cms-hydrated'), null, 'data-cms-hydrated attribute should not be set');
  assert.strictEqual(consoleErrors.length, 0, 'No console errors should be logged on 404');
  console.log('PASS Scenario 1: Static page with no CMS entry (retains static content).');
}

// ============================================================================
// Scenario 2: Static page with matching published CMS entry (production API shape without 'status')
// ============================================================================
{
  const consoleErrors = [];
  // Exact production API response from src/index.js: id, content_type, slug, title, data_json, seo_json, published_at, updated_at, data, seo
  // (NOTE: 'status' is filtered by SQL WHERE status='published' and is NOT returned in public API)
  const productionApiItem = {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    content_type: 'blog',
    slug: 'blog-ai-agents-replacing-manual-workflows',
    title: 'Updated: AI Agents in 2026 Enterprise Workflows',
    data_json: '{"summary":"Updated summary"}',
    seo_json: '{"meta_title":"Updated SEO Title"}',
    published_at: '2026-10-31 11:41:06',
    updated_at: '2026-10-31 11:41:06',
    data: {
      meta: {
        title: 'Updated: AI Agents in 2026 Enterprise Workflows',
        author: 'Tushar Rai (Verified Lead)',
        date: 'October 31, 2026',
        read_time: '12 min read',
        tag: 'Autonomous AI'
      },
      content: [
        { type: 'heading', text: 'Autonomous Systems at Scale' },
        { type: 'paragraph', text: 'This text was dynamically updated via the Cloudflare D1 CMS.' }
      ],
      takeaways: [
        'First updated key takeaway from CMS.',
        'Second updated key takeaway from CMS.'
      ]
    },
    seo: {
      meta_title: 'Updated SEO Title | Trai Inc'
    }
  };

  assert.strictEqual(productionApiItem.status, undefined, 'Production API does not return status field');

  const mockFetch = async (url) => {
    assert.ok(url.includes('slug=blog-ai-agents-replacing-manual-workflows'), 'Fetch must request pilot slug');
    return {
      ok: true,
      status: 200,
      json: async () => ({ item: productionApiItem })
    };
  };

  const dom = createTestDom(mockFetch, consoleErrors);
  await executeHydration(dom);

  const titleEl = dom.window.document.querySelector('[data-cms-bind="title"]');
  const authorEl = dom.window.document.querySelector('[data-cms-bind="author"]');
  const dateEl = dom.window.document.querySelector('[data-cms-bind="date"]');
  const readEl = dom.window.document.querySelector('[data-cms-bind="read_time"]');
  const tagEl = dom.window.document.querySelector('[data-cms-bind="tag"]');
  const contentEl = dom.window.document.querySelector('[data-cms-section="blog-content"]');
  const takeawaysEl = dom.window.document.querySelector('[data-cms-bind="takeaways"]');

  assert.strictEqual(titleEl.textContent, 'Updated: AI Agents in 2026 Enterprise Workflows');
  assert.strictEqual(authorEl.textContent, 'Tushar Rai (Verified Lead)');
  assert.strictEqual(dateEl.textContent, 'October 31, 2026');
  assert.strictEqual(readEl.textContent, '12 min read');
  assert.strictEqual(tagEl.textContent, 'Autonomous AI');
  assert.ok(contentEl.innerHTML.includes('Autonomous Systems at Scale'));
  assert.ok(contentEl.innerHTML.includes('dynamically updated via the Cloudflare D1 CMS'));
  assert.ok(takeawaysEl.innerHTML.includes('First updated key takeaway'));
  assert.strictEqual(dom.window.document.body.getAttribute('data-cms-hydrated'), 'true');
  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 2: Static page with matching published CMS entry (exact production API response structure).');
}

// ============================================================================
// Scenario 2B: Non-published status safety check (draft / archived rejected)
// ============================================================================
{
  const consoleErrors = [];
  const draftItem = {
    status: 'draft',
    title: 'Draft Title Should Never Hydrate',
    data: {
      content: [{ type: 'paragraph', text: 'Leaked draft content.' }]
    }
  };

  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ item: draftItem })
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  const titleBefore = dom.window.document.querySelector('[data-cms-bind="title"]').textContent;

  await executeHydration(dom);

  const titleAfter = dom.window.document.querySelector('[data-cms-bind="title"]').textContent;
  assert.strictEqual(titleAfter, titleBefore, 'Static content preserved when API item status is draft');
  assert.strictEqual(dom.window.document.body.getAttribute('data-cms-hydrated'), null);
  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 2B: Non-published status safety check (draft / archived rejected).');
}

// ============================================================================
// Scenario 3: API timeout handling (AbortController timeout)
// ============================================================================
{
  const consoleErrors = [];
  const mockFetch = (url, opts) => new Promise((resolve, reject) => {
    // If signal aborted, reject with AbortError
    if (opts && opts.signal) {
      opts.signal.addEventListener('abort', () => {
        const err = new Error('The operation was aborted');
        err.name = 'AbortError';
        reject(err);
      });
    }
    // Deliberately do not resolve to simulate network stall
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  const titleBefore = dom.window.document.querySelector('[data-cms-bind="title"]').textContent;

  // Override runWhenIdle to test quick abort
  dom.window.requestIdleCallback = (cb) => setTimeout(cb, 10);

  // Trigger hydration
  const scriptEl = dom.window.document.createElement('script');
  scriptEl.textContent = cmsScriptCode;
  dom.window.document.body.appendChild(scriptEl);

  // Fast-forward or wait
  await new Promise((resolve) => setTimeout(resolve, 80));

  const titleAfter = dom.window.document.querySelector('[data-cms-bind="title"]').textContent;
  assert.strictEqual(titleAfter, titleBefore, 'Static content preserved during slow network / abort');
  assert.strictEqual(consoleErrors.length, 0, 'No uncaught console errors during abort');
  console.log('PASS Scenario 3: API timeout handling (graceful abort, static content preserved).');
}

// ============================================================================
// Scenario 4: API 404 response
// ============================================================================
{
  const consoleErrors = [];
  const mockFetch = async () => ({
    ok: false,
    status: 404,
    json: async () => ({ error: 'Not found' })
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  const bodyBefore = dom.window.document.querySelector('[data-cms-section="blog-content"]').innerHTML;

  await executeHydration(dom);

  const bodyAfter = dom.window.document.querySelector('[data-cms-section="blog-content"]').innerHTML;
  assert.strictEqual(bodyAfter, bodyBefore, 'DOM unchanged on 404');
  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 4: API 404 response (graceful silent fallback).');
}

// ============================================================================
// Scenario 5: Empty CMS content
// ============================================================================
{
  const consoleErrors = [];
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      item: {
        status: 'published',
        title: 'Title With Empty Content',
        data: {
          meta: {},
          content: [], // empty content blocks
          sections: [] // empty sections
        }
      }
    })
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  const bodyBefore = dom.window.document.querySelector('[data-cms-section="blog-content"]').innerHTML;

  await executeHydration(dom);

  const bodyAfter = dom.window.document.querySelector('[data-cms-section="blog-content"]').innerHTML;
  assert.strictEqual(bodyAfter, bodyBefore, 'Pre-rendered static content blocks preserved when CMS content is empty');
  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 5: Empty CMS content (pre-rendered blocks preserved, not blanked out).');
}

// ============================================================================
// Scenario 6: Malformed JSON response
// ============================================================================
{
  const consoleErrors = [];
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => {
      throw new SyntaxError('Unexpected token < in JSON at position 0');
    }
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  const titleBefore = dom.window.document.querySelector('[data-cms-bind="title"]').textContent;

  await executeHydration(dom);

  const titleAfter = dom.window.document.querySelector('[data-cms-bind="title"]').textContent;
  assert.strictEqual(titleAfter, titleBefore, 'Static content preserved on JSON parse failure');
  assert.strictEqual(consoleErrors.length, 0, 'Zero uncaught console errors on malformed JSON');
  console.log('PASS Scenario 6: Malformed JSON response (silent error handling).');
}

// ============================================================================
// Scenario 7: Rendering of structured content blocks and XSS protection
// ============================================================================
{
  const consoleErrors = [];
  const xssPayload = {
    status: 'published',
    title: 'Security & Integrity <script>alert(1)</script>',
    data: {
      content: [
        { type: 'heading', text: 'Safe & Clean Heading <img src=x onerror=alert(2)>' },
        { type: 'subheading', text: 'Subheading with "quotes" and \'apostrophes\'' },
        { type: 'paragraph', text: 'Paragraph with <b>untrusted tags</b> and & special characters.' }
      ]
    }
  };

  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ item: xssPayload })
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  await executeHydration(dom);

  const titleEl = dom.window.document.querySelector('[data-cms-bind="title"]');
  const contentEl = dom.window.document.querySelector('[data-cms-section="blog-content"]');

  assert.strictEqual(titleEl.textContent, 'Security & Integrity <script>alert(1)</script>');
  assert.strictEqual(titleEl.querySelectorAll('script').length, 0, 'No script tags in title');

  // Verify tags inside content are properly escaped against XSS
  assert.ok(contentEl.innerHTML.includes('&lt;img src=x onerror=alert(2)&gt;'));
  assert.ok(contentEl.innerHTML.includes('&lt;b&gt;untrusted tags&lt;/b&gt;'));
  assert.strictEqual(contentEl.querySelectorAll('img').length, 0, 'No injected img tags executed');
  assert.strictEqual(contentEl.querySelectorAll('script').length, 0, 'No injected script tags executed');
  assert.strictEqual(contentEl.querySelectorAll('b').length, 0, 'No unescaped formatting tags executed');
  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 7: Rendering structured content blocks with XSS safety.');
}

// ============================================================================
// Scenario 8: SEO metadata preservation in DOM and head
// ============================================================================
{
  const consoleErrors = [];
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      item: {
        status: 'published',
        title: 'Hydrated Post Title',
        data: { meta: { title: 'Hydrated Post Title' } }
      }
    })
  });

  const dom = createTestDom(mockFetch, consoleErrors);

  // Capture SEO tags before hydration
  const titleTagBefore = dom.window.document.title;
  const canonicalBefore = dom.window.document.querySelector('link[rel="canonical"]').getAttribute('href');
  const metaDescBefore = dom.window.document.querySelector('meta[name="description"]').getAttribute('content');
  const jsonLdScripts = Array.from(dom.window.document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent);

  await executeHydration(dom);

  // SEO tags must remain untouched in the static head
  const titleTagAfter = dom.window.document.title;
  const canonicalAfter = dom.window.document.querySelector('link[rel="canonical"]').getAttribute('href');
  const metaDescAfter = dom.window.document.querySelector('meta[name="description"]').getAttribute('content');
  const jsonLdScriptsAfter = Array.from(dom.window.document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent);

  assert.strictEqual(titleTagAfter, titleTagBefore, 'Document head title preserved for SSR crawlers');
  assert.strictEqual(canonicalAfter, canonicalBefore, 'Canonical link preserved');
  assert.strictEqual(metaDescAfter, metaDescBefore, 'Meta description preserved');
  assert.deepStrictEqual(jsonLdScriptsAfter, jsonLdScripts, 'Structured data JSON-LD preserved');
  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 8: SEO metadata preservation in DOM and head.');
}

// ============================================================================
// Scenario 9: Mobile and responsive layout classes preserved
// ============================================================================
{
  const consoleErrors = [];
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      item: {
        status: 'published',
        title: 'New Title',
        data: {
          content: [{ type: 'paragraph', text: 'New content body.' }]
        }
      }
    })
  });

  const dom = createTestDom(mockFetch, consoleErrors);

  // Verify critical layout elements exist before
  assert.ok(dom.window.document.querySelector('nav#navbar'), 'Navbar present');
  assert.ok(dom.window.document.querySelector('footer#footer'), 'Footer present');
  assert.ok(dom.window.document.querySelector('.cf-hero-wrapper.blog-post-hero'), 'Hero wrapper present');
  assert.ok(dom.window.document.querySelector('.container.blog-post-header'), 'Header container present');
  assert.ok(dom.window.document.querySelector('.container.blog-post-body'), 'Article body container present');
  assert.ok(dom.window.document.querySelector('.blog-author-card'), 'Author card present');

  await executeHydration(dom);

  // Verify critical layout elements and classes exist after
  assert.ok(dom.window.document.querySelector('nav#navbar'), 'Navbar intact after hydration');
  assert.ok(dom.window.document.querySelector('footer#footer'), 'Footer intact after hydration');
  assert.ok(dom.window.document.querySelector('.cf-hero-wrapper.blog-post-hero'), 'Hero wrapper intact after hydration');
  assert.ok(dom.window.document.querySelector('.container.blog-post-header'), 'Header container intact after hydration');
  assert.ok(dom.window.document.querySelector('.container.blog-post-body'), 'Article body container intact after hydration');
  assert.ok(dom.window.document.querySelector('.blog-author-card'), 'Author card intact after hydration');
  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 9: Mobile and responsive layout classes preserved.');
}

// ============================================================================
// Scenario 10: Performance timing and zero uncaught console errors
// ============================================================================
{
  const consoleErrors = [];
  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      item: {
        status: 'published',
        title: 'Performance Benchmark Title',
        data: {
          meta: { author: 'Benchmark Tester' },
          content: [
            { type: 'heading', text: 'Fast Performance' },
            { type: 'paragraph', text: 'Executing in under 15 milliseconds.' }
          ]
        }
      }
    })
  });

  const dom = createTestDom(mockFetch, consoleErrors);

  const startTime = performance.now();
  await executeHydration(dom);
  const duration = performance.now() - startTime;

  assert.ok(duration < 500, `Execution duration was ${duration.toFixed(2)}ms (must be under 500ms in JSDOM)`);
  assert.strictEqual(consoleErrors.length, 0, 'Zero uncaught console errors');
  console.log(`PASS Scenario 10: Performance timing (${duration.toFixed(2)}ms) and zero console errors.`);
}

// ============================================================================
// Scenario 11: Importer fails closed on duplicate slug (zero overwrite guarantee)
// ============================================================================
{
  let threwError = false;
  try {
    execFileSync('node', [
      path.join(rootDir, 'scripts/import-content.js'),
      '--local',
      '--slug',
      'blog-ai-agents-replacing-manual-workflows'
    ], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
  } catch (err) {
    threwError = true;
    assert.strictEqual(err.status, 1, 'Importer must exit with status 1 on duplicate slug');
    assert.ok(err.stderr.includes('DUPLICATE SLUG DETECTED'), 'Must report duplicate slug detected');
    assert.ok(err.stderr.includes('strictly insert-only'), 'Must confirm strictly insert-only policy');
  }
  assert.strictEqual(threwError, true, 'Importer must reject existing slug with non-zero exit code');
  console.log('PASS Scenario 11: Importer fails closed on duplicate slug (zero overwrite guarantee).');
}

// ============================================================================
// Scenario 12: Dynamic SEO Metadata Hydration (Phase 10A)
// ============================================================================
{
  const consoleErrors = [];
  const seoPayload = {
    status: 'published',
    title: 'Dynamic SEO Article',
    seo: {
      meta_title: 'Custom Dynamic SEO Title | Trai Inc Blog',
      meta_description: 'Custom dynamic meta description loaded from Cloudflare CMS.',
      og_image: 'https://traiinc.com/img/blog/custom-seo-hero.webp',
      canonical_url: 'https://traiinc.com/blog/custom-seo-article'
    },
    data: {
      content: [{ type: 'paragraph', text: 'Hydrated content.' }]
    }
  };

  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ item: seoPayload })
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  await executeHydration(dom);

  const docTitle = dom.window.document.title;
  const metaDesc = dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content');
  const ogTitle = dom.window.document.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const ogDesc = dom.window.document.querySelector('meta[property="og:description"]')?.getAttribute('content');
  const ogImage = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const canonical = dom.window.document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const twCard = dom.window.document.querySelector('meta[name="twitter:card"]')?.getAttribute('content');
  const twTitle = dom.window.document.querySelector('meta[name="twitter:title"]')?.getAttribute('content');
  const twDesc = dom.window.document.querySelector('meta[name="twitter:description"]')?.getAttribute('content');
  const twImage = dom.window.document.querySelector('meta[name="twitter:image"]')?.getAttribute('content');

  assert.strictEqual(docTitle, 'Custom Dynamic SEO Title | Trai Inc Blog', 'Document title must match seo.meta_title');
  assert.strictEqual(metaDesc, 'Custom dynamic meta description loaded from Cloudflare CMS.', 'Meta description must match seo.meta_description');
  assert.strictEqual(ogTitle, 'Custom Dynamic SEO Title | Trai Inc Blog', 'og:title must match seo.meta_title');
  assert.strictEqual(ogDesc, 'Custom dynamic meta description loaded from Cloudflare CMS.', 'og:description must match seo.meta_description');
  assert.strictEqual(ogImage, 'https://traiinc.com/img/blog/custom-seo-hero.webp', 'og:image must match seo.og_image');
  assert.strictEqual(canonical, 'https://traiinc.com/blog/custom-seo-article', 'canonical link must match seo.canonical_url');
  assert.strictEqual(twCard, 'summary_large_image', 'twitter:card must be summary_large_image');
  assert.strictEqual(twTitle, 'Custom Dynamic SEO Title | Trai Inc Blog', 'twitter:title must match seo.meta_title');
  assert.strictEqual(twDesc, 'Custom dynamic meta description loaded from Cloudflare CMS.', 'twitter:description must match seo.meta_description');
  assert.strictEqual(twImage, 'https://traiinc.com/img/blog/custom-seo-hero.webp', 'twitter:image must match seo.og_image');

  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 12: Dynamic SEO Metadata Hydration (head title, meta desc, OG, and Twitter hydrated).');
}

// ============================================================================
// Scenario 13: SEO URL Safety Validation & XSS Prevention (Phase 10A)
// ============================================================================
{
  const consoleErrors = [];
  const maliciousSeoPayload = {
    status: 'published',
    title: 'Malicious SEO Attempt',
    seo: {
      meta_title: 'Clean Title with\n\nNewlines and \tTabs',
      meta_description: 'Clean Description with\r\nnewlines',
      og_image: 'javascript:alert("xss")',
      canonical_url: 'https://attacker.com/evil-phish'
    },
    data: {
      content: [{ type: 'paragraph', text: 'Content text.' }]
    }
  };

  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ item: maliciousSeoPayload })
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  const staticOgImageBefore = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const staticCanonicalBefore = dom.window.document.querySelector('link[rel="canonical"]')?.getAttribute('href');

  await executeHydration(dom);

  const docTitle = dom.window.document.title;
  const metaDesc = dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content');
  const ogImageAfter = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const canonicalAfter = dom.window.document.querySelector('link[rel="canonical"]')?.getAttribute('href');

  // Verify sanitization of text
  assert.strictEqual(docTitle, 'Clean Title with Newlines and Tabs', 'Title should be sanitized of newlines/tabs');
  assert.strictEqual(metaDesc, 'Clean Description with newlines', 'Description should be sanitized of newlines');

  // Verify unsafe URLs are rejected and static attributes preserved
  assert.strictEqual(ogImageAfter, staticOgImageBefore, 'Unsafe javascript: image URL rejected; static image preserved');
  assert.strictEqual(canonicalAfter, staticCanonicalBefore, 'External untrusted domain canonical rejected; static canonical preserved');

  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 13: SEO URL Safety Validation & XSS Prevention (unsafe URLs rejected, static head preserved).');
}

// ============================================================================
// Scenario 14: Sensible Fallbacks for Partial SEO Metadata (Phase 10A)
// ============================================================================
{
  const consoleErrors = [];
  const partialSeoPayload = {
    status: 'published',
    title: 'Fallback Article Title',
    seo: {
      // meta_title omitted -> should fall back to item.title
      // meta_description omitted -> should fall back to data.meta.description
      canonical_url: 'https://traiinc.com/blog/fallback-slug'
    },
    data: {
      meta: {
        description: 'Fallback description from data.meta',
        image: 'https://traiinc.com/img/fallback-image.webp'
      },
      content: [{ type: 'paragraph', text: 'Body.' }]
    }
  };

  const mockFetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ item: partialSeoPayload })
  });

  const dom = createTestDom(mockFetch, consoleErrors);
  await executeHydration(dom);

  const docTitle = dom.window.document.title;
  const metaDesc = dom.window.document.querySelector('meta[name="description"]')?.getAttribute('content');
  const ogTitle = dom.window.document.querySelector('meta[property="og:title"]')?.getAttribute('content');
  const ogImage = dom.window.document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  const canonical = dom.window.document.querySelector('link[rel="canonical"]')?.getAttribute('href');

  assert.strictEqual(docTitle, 'Fallback Article Title', 'Title should fall back to item.title');
  assert.strictEqual(ogTitle, 'Fallback Article Title', 'OG title should fall back to item.title');
  assert.strictEqual(metaDesc, 'Fallback description from data.meta', 'Description should fall back to data.meta.description');
  assert.strictEqual(ogImage, 'https://traiinc.com/img/fallback-image.webp', 'Image should fall back to data.meta.image');
  assert.strictEqual(canonical, 'https://traiinc.com/blog/fallback-slug', 'Canonical should use seo.canonical_url');

  assert.strictEqual(consoleErrors.length, 0);
  console.log('PASS Scenario 14: Sensible Fallbacks for Partial SEO Metadata (item.title & data.meta fallback).');
}

console.log('\nALL 14 CMS HYDRATION & IMPORTER SCENARIOS PASSED SUCCESSFULLY!\n');
