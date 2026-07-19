# About Page Redesign — Design Spec

**Date**: 2026-07-18
**Scope**: Redesign `renderAbout()` in `js/app.js`, update `data/about.json`, add/replace CSS in `css/style.css`
**Goal**: Bring the about page to the same premium quality level as the home page

---

## Current Problems

1. Flat text-only hero with no visual anchor
2. No section background rhythm — monotone top to bottom
3. Dated card design (thin borders, tiny emoji icons)
4. No imagery beyond team headshots
5. Capabilities section duplicates home page
6. Bare timeline (dots + text, no visual weight)
7. Intern Incubator is orphan text paragraph — has its own page, doesn't need a section here
8. Light mode sections blend together (no contrast alternation)
9. Typography hierarchy is flat across sections
10. Red accent overused on every subtitle

---

## New Section Structure

### 1. Hero — Split Layout (matches home page pattern)

**Layout**: Two-column split. Left = text content, Right = gradient visual/abstract treatment (CSS-only, no image dependency).

**Left column**:
- Eyebrow: `ABOUT TRAI INC`
- Headline: `Built by engineers. Driven by outcomes.` (mission + philosophy + identity in one)
- Body: 2-sentence founding story hook — started 2020, AI-native from day one, 138+ clients across 12+ industries
- CTA button: `Meet the Team` (scrolls to #team)

**Right column**:
- Pure CSS decorative panel: radial gradient blobs using `var(--accent-color)` and `var(--brand-gradient)` with `filter: blur()`, layered on `var(--bg-darker)`. Same technique as `about-cta-glow` but larger and more prominent.
- No external images, no JS dependency.

**Stats bar** (below hero): Keep the 4 stats (138+, 6+, 12+, 50+) but style as a horizontal band with `bg-darker` background. This is the ONE place these numbers appear. Gradient text values, muted labels.

**Design tokens**: Same font sizes as home hero. `clamp(2.4rem, 5vw, 3.6rem)` for headline.

### 2. Team — Premium Cards

**Layout**: 3-column grid (2 rows of 3).

**Card design upgrade**:
- Larger photos: 120px diameter instead of 100px, with subtle gradient ring border (not plain `border-light`)
- Card gets subtle gradient background on hover (not flat `spec-card`)
- Name: 1.1rem, semibold
- Role: accent color, not muted gray
- Optional: one-liner tagline per member (e.g., "10+ years in cloud architecture")

**Section background**: Default (not shaded) — white in light, dark in dark. Creates contrast with stats bar above.

### 3. How We Work — Bento-Style Cards

**Reduce from 6 → 4 cards**:
1. **Dedicated Team** — merge "Named Point of Contact" and "Dedicated Team" into one
2. **AI-Augmented Speed** — keep
3. **Fixed-Price Transparency** — keep
4. **Full IP Ownership** — merge "Defined Update Cadence" into body text mentioning weekly updates

**Card design upgrade**:
- Gradient icon container (40×40 rounded square with subtle gradient bg) instead of raw emoji
- Larger padding, more whitespace
- 2-column grid on desktop (2×2), single column on mobile
- Match home page's `cap-cell` or `tmo-card` visual weight

**Section background**: Shaded (`bg-darker`) — creates rhythm after team section.

### 4. Timeline — Milestone Cards

**Layout**: Vertical timeline with card-based milestones instead of bare text.

**Upgrade**:
- Each milestone gets a card container (subtle border, padding)
- Year badge: pill-shaped, accent background, white text (not just colored text on gray bg)
- Timeline line: gradient from accent to transparent (not flat `border-light`)
- Timeline dots: larger (20px), with subtle glow/ring effect
- Milestone title: slightly larger (1.3rem)

**Keep**: All 5 milestones (2020, 2021, 2022-23, 2024, 2025-26). Add intern incubator mention to 2024 milestone instead of separate section.

**Section background**: Default (not shaded) — alternation continues.

### 5. REMOVED: Capabilities Section

Entirely removed. Home page covers all services. About page stays focused on identity, team, process, story.

### 6. REMOVED: Intern Incubator Section

Removed as standalone section. Mention folded into the 2024 timeline milestone: "Launched intern incubation program — training engineers on production projects from day one." Links to dedicated incubator page.

### 7. FAQ — Keep As-Is

Working well. No changes needed. Consistent with home page treatment.

### 8. CTA — Keep With Minor Polish

Keep the glow card. Ensure gradient glow works in both themes. No structural changes.

---

## CSS Changes

### Section Rhythm (applies to all about sections)

```
Section order:     Hero → Stats → Team → How We Work → Timeline → FAQ → CTA
Background:        gradient  darker  default  darker      default   darker  default
```

This creates the alternating light/dark rhythm the home page has.

### Light Mode Fixes

- Shaded sections use `var(--bg-light)` not pure white — creates visible bands
- Card borders get slightly more contrast in light mode
- Stats values keep gradient text (already works)
- Timeline line uses `var(--border-default)` not `var(--border-light)` for visibility

### Typography Scale

- Hero headline: `clamp(2.4rem, 5vw, 3.6rem)` — matches home
- Section titles (h2): `clamp(1.8rem, 3.5vw, 2.6rem)` — matches home
- Card titles: `1.15rem` — consistent
- Body text: `0.95rem` — consistent
- Mini-titles: keep current treatment but vary color — not all red. Use `var(--text-muted)` for non-primary sections, accent only for the most important section subtitle.

### Accent Strategy

- Red accent: Hero CTA button, stats gradient values, timeline year badges, bottom CTA button
- Muted accent: Section subtitles use `var(--text-muted)` uppercase tracking, not red
- This matches home page where mini-titles are often muted, not screaming red

---

## Data Changes (`data/about.json`)

### Hero — New Fields

```json
{
  "header": {
    "eyebrow": "ABOUT TRAI INC",
    "title": "Built by engineers. Driven by outcomes.",
    "description": "Founded in 2020, Trai Inc is an AI-native engineering team that ships Silicon Valley-grade software in weeks. 138+ clients. 12+ industries. Zero bloat."
  }
}
```

Remove `intro.text` (merged into hero description).

### Team — Add Taglines

Each member gets an optional `tagline` field:
```json
{
  "name": "Tushar Rai",
  "role": "Founder & CEO",
  "image": "assets/team/tushar_3d.png",
  "tagline": "Full-stack engineer. Built 138+ client solutions."
}
```

### How We Work — Reduce to 4

Remove "Named Point of Contact" and "Defined Update Cadence". Merge relevant details into "Dedicated Team" card body.

### Timeline — Add Incubator to 2024

Update 2024 milestone desc to include: "Launched intern incubation program training engineers on production projects from day one."

### Remove

- `expertise` object (entire capabilities section)
- `incubation` object (folded into timeline)

---

## Files Modified

| File | Change |
|------|--------|
| `data/about.json` | Restructure hero, add taglines, remove expertise/incubation, update timeline |
| `js/app.js` | Rewrite `renderAbout()` — new hero, upgraded team/cards/timeline, remove 2 sections |
| `css/style.css` | Replace all `about-*` styles with premium versions matching home page patterns |

---

## What This Does NOT Change

- Footer (shared via nav.js)
- Navbar (shared)
- FAQ renderer (shared `renderFaq()`)
- Any other page
- `build.js` schema logic (about page has no special schema beyond default)
