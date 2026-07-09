# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Install deps: `npm install`
- Build (pre-renders all pages into `dist/`): `npm run build` (runs `node build.js`)
- Serve the built site locally: `npx serve dist -p 8080`
- Syntax-check a JS file without running it: `node -c js/app.js`

There is no test suite, linter, or dev-server script beyond `build.js` itself (it spins up a throwaway HTTP server on port 9999 purely to let jsdom fetch pages during the build, then exits).

## Architecture

This is a static site with **no frontend framework and no bundler**. Content is data-driven; HTML files are thin shells.

- **Pages are shells, not templates.** Every `*.html` file at the repo root sets `<body data-page="slug">` and has an empty `#content` div. There is no server-side templating.
- **`js/app.js` is the render engine.** On `DOMContentLoaded` it reads `data-page`, looks up a renderer function in the `renderers` map, fetches the matching JSON from `data/{slug}.json` (or `data/services.json` for any slug in the `servicePages` array, or `data/technologies.json` for `tech-*` slugs), and calls `render{Page}(data)` to build the `#content` innerHTML. Each page type (home, about, solutions, industries, careers, etc.) has its own `render*` function in this file — when adding a page, add both the JSON shape and a renderer function here.
- **`js/nav.js`** injects the shared navbar (multi-layer mega-menu), footer markup is inlined directly in `app.js` (`footerHTML`), plus the WhatsApp FAB and theme toggle. These are injected on every page regardless of `data-page`.
- **`js/animations.js`** is a small scroll/fade-in observer, independent of the render pipeline.
- **`build.js` pre-renders everything.** Because pages are normally JS-rendered client-side (bad for SEO/crawlers), `build.js` boots a local HTTP server, loads each root-level `*.html` through `jsdom` with `runScripts: "dangerously"`, waits for `#content`/`#navbar` to finish populating, then serializes the fully-rendered DOM to `dist/`. It also:
  - injects per-page JSON-LD schema (Organization/LocalBusiness on home+contact, Service schema for the service pages listed inline in `build.js`, Article for the trust-partner page, Person schema per team member from `data/about.json`, FAQPage schema from any page's `faq.items`, Product schema for `app-store.html`),
  - injects BreadcrumbList schema on all non-home/404 pages,
  - generates `dist/sitemap.xml` from the pages it built,
  - cache-busts `?v=` query strings on `css/style.css`, `js/app.js`, `js/nav.js`.
  - Editing `build.js`'s per-page schema logic requires updating the hardcoded filename lists inside it (e.g. the array of service-page filenames) — it is not auto-derived from `data/`.
- **Content edits go in `data/*.json`, never in the HTML.** Each root JSON file corresponds to one page's `data-page` slug. `data/unused/` holds JSON for pages that were de-scoped/merged into pillar pages (kept for reference, not wired to any renderer or route).
- **Styling is one file:** `css/style.css` (~3700 lines), using CSS custom properties for light/dark theming. No CSS modules/preprocessor.
- **`functions/api/subscribe.js`** is a Cloudflare Pages Function (not part of the jsdom build) — handles newsletter/lead-magnet signup via the Resend API, reading `env.RESEND_API_KEY`.
- **`_redirects`** holds Cloudflare Pages redirect rules, largely legacy-URL cleanup from a prior Wix site plus internal route consolidation.
- **Deploy is Cloudflare Pages**, auto-building from the `main` branch on push.
- **`patch_app.py` / `patch_nav.py` / `patch_nav.js` / `patch_services.py`** at the repo root are one-off migration scripts used to bulk-edit `js/app.js`, `js/nav.js`, and `data/services.json` in past sessions. They are not part of any build step — treat them as disposable scratch scripts, not live tooling.

## Repo Rules (from `.agents/AGENTS.md`)

- Always wait for explicit user approval before `git push` to `main` or deploying to production — never treat a verification request as implicit approval.
- Before changing CSS/logic on shared/generic class names (e.g. `.tech-item-link`, `.mega-dropdown`, `buildMegaMenu()`), grep for other usages first to avoid regressions elsewhere.
- Browser automation/subagents are unsupported on this host (no Chrome remote debugging) — ask the user for manual visual QA instead of attempting it.
