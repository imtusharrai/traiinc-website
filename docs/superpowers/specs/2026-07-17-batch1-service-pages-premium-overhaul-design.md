# Batch 1 — Service Pages Premium Overhaul (Design)

**Date:** 2026-07-17
**Status:** Awaiting user review
**Part of:** Full-site premium overhaul (4 batches). This spec covers **Batch 1 only**.

## Context

The home page was redesigned to a premium, "award-winning" look built from a
reusable component kit: split-hero card, `tmo-grid`, Verizon-style `cap-grid`,
`stat-highlights` strip, `stepper`, and a collapsible FAQ. The rest of the site
still uses an older visual language. This project propagates the home kit across
every page, batch by nav family, with **all content in `data/*.json` and zero
inline styles in the renderers**.

### Full-site sequencing (context, not scope)
- **Batch 1 (this spec):** Solutions + all service pages (`renderServicePage`).
- Batch 2: Industries + audience pages (startups, smb, enterprise, msmes).
- Batch 3: About-family + careers, partner, contact.
- Batch 4: pricing, app-store, legal, trust.

Each batch gets its own spec → plan → implementation cycle.

## Batch 1 Scope

### In scope
1. **10 service pages** served by `renderServicePage` (each keyed in `data/services.json`):
   `ai-automation`, `cloud-devops`, `content-creation`, `custom-software`,
   `data-analytics`, `digital-marketing`, `enterprise-platforms`, `mobile-apps`,
   `ui-ux-design`, `web-development`.
2. **Solutions page** (`renderSolutions`) — audit + de-hardcode only. Its
   capabilities grid was just redesigned (Verizon style); no visual rework, just
   confirm no inline styles / hardcoded copy remain.
3. **Nav cleanup** — remove the two dead Solutions mega-menu items
   (`business-communication.html`, `network-connectivity.html`) which have no
   page/data. (New pages for these deferred to a later batch.)
4. **Shared premium-kit helper layer** in `js/app.js` (foundation reused by later batches).

### Out of scope
- The extra `services.json` entries with no built html (`cybersecurity`,
  `lead-gen-scraping`, `motion-video`, `workflow-automation`, `flutter-app-development`,
  `ecommerce-development`, `custom-crm-development`, `wordpress-cms-development`) —
  no route, not built.
- `renderTechPage`, `renderMobileServicePage`, `renderAudiencePage`, `renderMSME`
  (Batch 2+). Their shared `bento-grid` / `msme-hero` classes are **not** modified.
- Refactoring the home page onto the new helpers (deferred; home left as-is to
  avoid regression this batch).
- Building actual `business-communication` / `network-connectivity` pages.

## Key Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Design language | Reuse home component kit uniformly (one product feel) |
| De-hardcode depth | Content → JSON **and** kill all inline `style=` → CSS classes |
| Service hero (no photos exist) | **Photo-free split-hero variant**: gradient panel + oversized service icon + badge |
| Shared classes (`bento-*`, `msme-hero`) | Not restyled globally; service pages get their own new premium classes |
| Home refactor | Deferred — home untouched this batch |
| Execution | Extract shared kit helpers; rebuild `renderServicePage` to consume them |

## Architecture

### Shared premium-kit helpers (new, in `js/app.js`)
Pure functions that take a data object and return home-kit premium markup. These
are the single source of premium sections for Batch 1 and all later batches.

- `buildSplitHero({ variant, badge, icon, accent, title, subtitle, cta, trust })`
  → split-hero card. `variant: 'gradient'` renders the photo-free left panel
  (gradient + big icon + badge) used by service pages. `variant: 'image'` (future)
  renders the photo panel home uses.
- `buildCardGrid({ subtitle, title, items, columns })` → premium card grid using a
  **new `service-card` class** styled to match home's `cap-cell`/`tmo-card`. Does
  **not** reuse `bento-card` (shared with other renderers).
- `buildStatStrip({ items })` → `stat-highlights`-style metric strip (replaces the
  service stats row and proof studies where a metric strip fits).
- `buildStepper({ subtitle, title, steps })` → home `stepper` markup (replaces
  `process-grid`).
- `renderFaq(faq)` — already exists; reused.

Each helper emits **only classes**, no inline `style=`. Per-item accent color is
passed via `data-accent="<key>"` and resolved in CSS, not inline.

### `renderServicePage` recomposition
Rebuilt to call the helpers. Section order preserved so SEO/schema and existing
`services.json` content map cleanly:

1. Hero → `buildSplitHero({ variant: 'gradient', ... })`
2. Stats → `buildStatStrip`
3. Core features → `buildCardGrid` (`service-card`)
4. Proof studies → accent cards (kept) restyled premium, inline → class
5. Tech stack + use cases → kept, restyled premium
6. Benefits / why-us / industries → `buildCardGrid`
7. App pricing → kept, restyled premium
8. Delivery process → `buildStepper`
9. FAQ → `renderFaq`
10. Grand CTA → kept, restyled premium

### Data (`data/services.json`)
- Content already ~complete (badge, title, subtitle, icon, features, benefits,
  why_us, industries, proof, process, faq, cta, stats, tech_stack, use_cases).
- **Add if missing:** a per-service `accent` color key for the gradient hero panel
  and card accents (many entries already have `color`/`icon`; reuse those).
- No copy moves out of JSON — it already lives there. Verify each of the 10 pages
  renders with no renderer-side hardcoded strings.

### CSS (`css/style.css`)
- New classes: `.hero-split-card--gradient` (photo-free hero panel), `.service-card`
  (+ grid), accent resolution via `[data-accent="..."]` selectors.
- Restyle kept sections (stats, tech, pricing, grand-CTA) to premium tokens.
- **Do not** modify `.bento-*`, `.msme-hero`, `.conversion-*` shared rules.
- Remove the 4 inline `style=` occurrences from the renderer; replace with classes.

### Nav (`js/nav.js`)
- Remove the `business-communication` and `network-connectivity` entries from the
  Solutions mega-menu column.

## Data Flow
Unchanged from current architecture: `data-page` slug → `renderServicePage` fetches
`data/services.json` → looks up `service = data[slug]` → helpers build innerHTML →
`build.js` pre-renders each page to `dist/`.

## Error Handling
- Missing service key → existing "Service Not Found" fallback (kept).
- Optional sections (stats, proof, benefits, why_us, industries, app_pricing)
  already guarded by presence checks; helpers must no-op on empty/absent data.
- Hero icon/accent absent → helper falls back to a default accent + generic icon.

## Testing / Verification
- `node -c js/app.js` (syntax) after each edit.
- `npm run build` — all 10 service pages + solutions build without error.
- Grep `dist/` for leftover inline `style=` in the service page bodies and for any
  hardcoded copy that should be in JSON.
- Manual visual QA by the user (host has no browser automation — repo rule): spot
  check 2–3 service pages (e.g. cloud-devops, mobile-apps, digital-marketing) +
  solutions in light and dark mode, desktop and mobile widths.
- No `git push` / deploy without explicit user approval (repo rule).

## Risks
- **Shared-class regression:** mitigated by introducing new `service-card` /
  hero-gradient classes instead of restyling `bento-*` / `msme-hero`.
- **`services.json` shape drift:** the 10 entries may not be perfectly uniform
  (e.g. `tech_stack` is array in some, categorized in others — already handled).
  Helpers must tolerate both, as the current renderer does.
- **Solutions already-shipped look:** limited to de-hardcode; no visual rework.

## Deliverables
1. Shared kit helpers in `js/app.js`.
2. Rebuilt `renderServicePage`.
3. New/updated CSS classes; inline styles removed.
4. `services.json` accent fields added where missing.
5. Nav dead-item removal.
6. Rebuilt `dist/`.
7. Verified per the Testing section.
