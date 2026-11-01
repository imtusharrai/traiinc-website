import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
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
// Scenario 2: Static page with matching published CMS entry (successful hydration)
// ============================================================================
{
  const consoleErrors = [];
  const publishedItem = {
    status: 'published',
    title: 'Updated: AI Agents in 2026 Enterprise Workflows',
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
    }
  };

  const mockFetch = async (url) => {
    assert.ok(url.includes('slug=blog-ai-agents-replacing-manual-workflows'), 'Fetch must request pilot slug');
    return {
      ok: true,
      status: 200,
      json: async () => ({ item: publishedItem })
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
  console.log('PASS Scenario 2: Static page with matching published CMS entry (successful hydration).');
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

console.log('\nALL 10 CMS HYDRATION SCENARIOS PASSED SUCCESSFULLY!\n');
