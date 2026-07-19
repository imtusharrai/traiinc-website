# About Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the about page to match the home page's premium quality level — new split hero, upgraded team cards, bento-style work cards, milestone timeline, remove redundant sections, fix section rhythm and light mode.

**Architecture:** Data-driven static site. Content lives in `data/about.json`, rendered by `renderAbout()` in `js/app.js`, styled by `css/style.css`. All changes are purely presentational — no new dependencies, no build changes.

**Tech Stack:** Vanilla HTML/CSS/JS, CSS custom properties for theming, no framework.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `data/about.json` | Modify | Restructure hero, add team taglines, reduce advantages to 4, fold incubator into timeline, remove expertise + incubation objects |
| `js/app.js` | Modify (lines 671-792) | Rewrite `renderAbout()` — new split hero, premium team cards, bento work cards, milestone timeline cards, remove 2 sections |
| `css/style.css` | Modify (lines 4055-4113) | Replace all `about-*` styles with premium versions |

---

### Task 1: Update `data/about.json`

**Files:**
- Modify: `data/about.json` (full file, 210 lines)

- [ ] **Step 1: Rewrite the hero/header object**

Replace lines 2-8 of `data/about.json`:

```json
{
  "header": {
    "eyebrow": "ABOUT TRAI INC",
    "title": "Built by engineers.\nDriven by outcomes.",
    "description": "Founded in 2020, Trai Inc is an AI-native engineering team that ships Silicon Valley-grade software in weeks — not months. 138+ clients. 12+ industries. Zero bloat. We exist to democratize enterprise-grade engineering for businesses worldwide."
  },
```

This removes the old `intro` object — its content is merged into `header.description`.

- [ ] **Step 2: Add taglines to team members**

Update each team member to include a `tagline` field:

```json
"team": {
    "subtitle": "LEADERSHIP TEAM",
    "title": "The engineers and strategists behind our platform",
    "members": [
      {
        "name": "Tushar Rai",
        "role": "Founder & CEO",
        "image": "assets/team/tushar_3d.png",
        "tagline": "Full-stack engineer. Built 138+ client solutions."
      },
      {
        "name": "Neha Sharma",
        "role": "VP of Engineering",
        "image": "assets/team/neha_3d.png",
        "tagline": "Leads architecture across web and mobile."
      },
      {
        "name": "Harsh Pandey",
        "role": "Head of Cloud Architecture",
        "image": "assets/team/harsh_3d.png",
        "tagline": "AWS, Cloudflare, and infrastructure at scale."
      },
      {
        "name": "Pallavi Mehta",
        "role": "Head of Product & Design",
        "image": "assets/team/pallavi_3d.png",
        "tagline": "Figma to production. Pixel-perfect delivery."
      },
      {
        "name": "Vineet Saxena",
        "role": "Lead Full-Stack Engineer",
        "image": "assets/team/vineet_3d.png",
        "tagline": "React, Node, Flutter — end-to-end builder."
      },
      {
        "name": "Shipra Singh",
        "role": "Head of AI & Data Science",
        "image": "assets/team/shipra_3d.png",
        "tagline": "LLM integration, automation, and analytics."
      }
    ]
  },
```

- [ ] **Step 3: Reduce advantages from 6 to 4**

Replace the `model.advantages` array. Merge "Named Point of Contact" into "Dedicated Team", merge "Defined Update Cadence" into "Dedicated Team" body:

```json
"model": {
    "subtitle": "HOW WE WORK",
    "title": "AI-Native Delivery at Scale",
    "description": "We combine deep engineering expertise with AI-powered development tools to deliver faster, cleaner, and more cost-effective solutions than traditional agencies.",
    "advantages": [
      {
        "icon": "⚡",
        "title": "Dedicated Team & Point of Contact",
        "desc": "Every project gets a named project manager and senior engineers from day one. Weekly written updates, scheduled calls — one clear point of contact, not a rotating cast."
      },
      {
        "icon": "🧠",
        "title": "AI-Augmented Speed",
        "desc": "Our team uses Claude, Gemini, and agentic coding workflows to deliver enterprise-quality work in half the time of traditional agencies."
      },
      {
        "icon": "💰",
        "title": "Fixed-Price Transparency",
        "desc": "Every project is scoped upfront with a fixed price. No hourly billing, no surprise invoices, no scope creep."
      },
      {
        "icon": "🔒",
        "title": "Full IP Ownership",
        "desc": "You own 100% of the code, design assets, and infrastructure. Complete handover with documentation. Zero vendor lock-in."
      }
    ]
  },
```

- [ ] **Step 4: Update timeline — fold incubator into 2024 milestone**

Update the 2024 milestone desc to mention the incubator:

```json
"timeline": {
    "subtitle": "OUR JOURNEY",
    "title": "Six Years of Building",
    "milestones": [
      {
        "year": "2020",
        "title": "Founded Trai Inc",
        "desc": "Launched as a digital marketing and software development firm in Lucknow, serving local businesses and startups."
      },
      {
        "year": "2021",
        "title": "Scaled to 50+ Clients",
        "desc": "Expanded service offerings and team. Delivered websites, marketing campaigns, and software across hospitality, retail, and real estate."
      },
      {
        "year": "2022-23",
        "title": "Enterprise & International Expansion",
        "desc": "Took on enterprise clients and expanded to international markets including the UK. Crossed 100+ total projects delivered."
      },
      {
        "year": "2024",
        "title": "AI-Native Transformation",
        "desc": "Adopted AI-augmented development workflows across the team. Integrated Claude, Gemini, and agentic coding tools. Launched intern incubation program training engineers on production projects from day one."
      },
      {
        "year": "2025-26",
        "title": "138+ Clients & Product Launch",
        "desc": "Crossed 138+ clients served. Began developing a proprietary SaaS product to scale the tools and systems that power client delivery."
      }
    ]
  },
```

- [ ] **Step 5: Remove `expertise` and `incubation` objects**

Delete the entire `expertise` object (lines 102-146) and the `incubation` object (lines 179-183). Keep `faq` and `cta` as-is.

- [ ] **Step 6: Verify JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('data/about.json','utf8')); console.log('Valid JSON')"`

Expected: `Valid JSON`

---

### Task 2: Rewrite `renderAbout()` in `js/app.js`

**Files:**
- Modify: `js/app.js` (lines 671-792, the `renderAbout` function)

- [ ] **Step 1: Replace the entire `renderAbout` function**

Replace lines 671-793 of `js/app.js` with:

```javascript
function renderAbout(data) {
    return `
    <!-- ════════ HERO — SPLIT (IDENTITY) ════════ -->
    <section class="about-hero">
        <div class="about-hero-split">
            <div class="about-hero-left">
                <p class="about-hero-eyebrow">${data.header.eyebrow}</p>
                <h1 class="about-hero-title">${data.header.title.replace(/\n/g, '<br>')}</h1>
                <p class="about-hero-desc">${data.header.description}</p>
                <a href="#team" class="btn-primary large about-hero-cta">Meet the Team</a>
            </div>
            <div class="about-hero-right">
                <div class="about-hero-glow about-hero-glow--1"></div>
                <div class="about-hero-glow about-hero-glow--2"></div>
                <div class="about-hero-glow about-hero-glow--3"></div>
            </div>
        </div>
    </section>

    <!-- ════════ STATS BAR ════════ -->
    <section class="about-stats">
        <div class="container">
            <div class="about-stats-row">
                ${data.numbers.stats.map(s => `
                <div class="about-stat fade-in">
                    <span class="about-stat-value">${s.value}</span>
                    <span class="about-stat-label">${s.label}</span>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ TEAM ════════ -->
    <section id="team" class="about-team">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.team.subtitle}</h4>
                <h2>${data.team.title}</h2>
            </div>
            <div class="about-team-grid">
                ${data.team.members.map(m => `
                <div class="about-team-card fade-in">
                    <div class="about-team-avatar">
                        <img src="${m.image}" alt="${m.name}" class="about-team-avatar-img" loading="lazy">
                    </div>
                    <h3 class="about-team-name">${m.name}</h3>
                    <p class="about-team-role">${m.role}</p>
                    ${m.tagline ? `<p class="about-team-tagline">${m.tagline}</p>` : ''}
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ HOW WE WORK — BENTO ════════ -->
    <section class="about-work">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.model.subtitle}</h4>
                <h2>${data.model.title}</h2>
                <p class="about-work-desc">${data.model.description}</p>
            </div>
            <div class="about-work-grid">
                ${data.model.advantages.map(a => `
                <div class="about-work-card fade-in">
                    <div class="about-work-icon">${a.icon}</div>
                    <h3 class="about-work-card-title">${a.title}</h3>
                    <p class="about-work-card-desc">${a.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ TIMELINE — MILESTONE CARDS ════════ -->
    <section class="about-timeline">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.timeline.subtitle}</h4>
                <h2>${data.timeline.title}</h2>
            </div>
            <div class="about-timeline-track">
                ${data.timeline.milestones.map(m => `
                <div class="about-milestone fade-in">
                    <div class="about-milestone-dot"></div>
                    <div class="about-milestone-card">
                        <span class="about-milestone-year">${m.year}</span>
                        <h3 class="about-milestone-title">${m.title}</h3>
                        <p class="about-milestone-desc">${m.desc}</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    ${renderFaq(data.faq)}

    <!-- ════════ CTA ════════ -->
    <section class="about-cta-section">
        <div class="container">
            <div class="about-cta-card fade-in">
                <div class="about-cta-glow"></div>
                <h2 class="about-cta-title">${data.cta.title}</h2>
                <p class="about-cta-desc">${data.cta.description}</p>
                <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large about-cta-btn">${data.cta.button_text}</a>
            </div>
        </div>
    </section>
    `;
}
```

- [ ] **Step 2: Syntax-check the file**

Run: `node -c js/app.js`

Expected: `Syntax OK` (or no output, which means success)

---

### Task 3: Replace all about page CSS

**Files:**
- Modify: `css/style.css` (lines 4055-4113)

- [ ] **Step 1: Replace the entire about CSS block**

Replace lines 4055-4113 (from the `/* ═══════════════════ ABOUT PAGE` comment through the `@media` block ending before `/* ═══════════════════ CONTACT PAGE`) with:

```css
/* ═══════════════════ ABOUT PAGE — premium redesign ═══════════════════ */

/* ── Hero Split ── */
.about-hero { padding: 120px 24px 0; overflow: hidden; }
.about-hero-split { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; max-width: 1200px; margin: 0 auto; align-items: center; min-height: 55vh; }
.about-hero-left { max-width: 560px; }
.about-hero-eyebrow { font-size: 0.82rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 20px; }
.about-hero-title { font-family: var(--font-heading); font-size: clamp(2.4rem, 5vw, 3.6rem); font-weight: 800; line-height: 1.15; margin-bottom: 24px; }
.about-hero-desc { color: var(--text-muted); font-size: 1.1rem; line-height: 1.7; margin-bottom: 36px; }
.about-hero-cta { display: inline-flex; }
.about-hero-right { position: relative; min-height: 350px; border-radius: 24px; overflow: hidden; background: var(--bg-darker); }
.about-hero-glow { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.35; }
.about-hero-glow--1 { width: 300px; height: 300px; top: -60px; right: -40px; background: var(--accent-color); }
.about-hero-glow--2 { width: 250px; height: 250px; bottom: -50px; left: -30px; background: #4F46E5; }
.about-hero-glow--3 { width: 180px; height: 180px; top: 40%; left: 40%; background: #e6a100; opacity: 0.2; }

/* ── Stats Bar ── */
.about-stats { padding: 50px 0; background: var(--bg-darker); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); }
.about-stats-row { display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; text-align: center; }
.about-stat-value { display: block; font-size: 2.5rem; font-family: var(--font-heading); font-weight: 800; background: var(--brand-gradient); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
.about-stat-label { display: block; color: var(--text-muted); font-size: 0.92rem; margin-top: 6px; }

/* ── Team ── */
.about-team { padding: 90px 0; scroll-margin-top: 80px; }
.about-team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 50px; max-width: 1000px; margin-left: auto; margin-right: auto; }
.about-team-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 20px; padding: 36px 24px; text-align: center; transition: transform 0.25s, box-shadow 0.25s; }
.about-team-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
.about-team-avatar { width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 20px; overflow: hidden; background: var(--brand-gradient); padding: 3px; }
.about-team-avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.about-team-name { font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 4px; }
.about-team-role { color: var(--accent-color); font-size: 0.9rem; font-weight: 600; margin-bottom: 8px; }
.about-team-tagline { color: var(--text-muted); font-size: 0.85rem; line-height: 1.5; }

/* ── How We Work (Bento) ── */
.about-work { padding: 90px 0; background: var(--bg-darker); }
.about-work-desc { color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; max-width: 650px; margin: 16px auto 0; }
.about-work-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-top: 50px; max-width: 900px; margin-left: auto; margin-right: auto; }
.about-work-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 20px; padding: 36px 30px; transition: transform 0.25s, box-shadow 0.25s; }
.about-work-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
.about-work-icon { width: 48px; height: 48px; border-radius: 14px; background: var(--bg-darker); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 18px; border: 1px solid var(--border-light); }
.about-work-card-title { font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 10px; }
.about-work-card-desc { color: var(--text-muted); font-size: 0.92rem; line-height: 1.65; }

/* ── Timeline (Milestone Cards) ── */
.about-timeline { padding: 90px 0; }
.about-timeline-track { margin-top: 50px; position: relative; padding-left: 50px; max-width: 800px; margin-left: auto; margin-right: auto; }
.about-timeline-track::before { content: ''; position: absolute; left: 19px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--accent-color), var(--border-light)); }
.about-milestone { position: relative; margin-bottom: 32px; }
.about-milestone-dot { position: absolute; left: -39px; top: 20px; width: 20px; height: 20px; border-radius: 50%; background: var(--accent-color); border: 4px solid var(--bg-card); box-shadow: 0 0 0 2px var(--accent-color), 0 0 12px var(--accent-glow); }
.about-milestone-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 16px; padding: 28px 30px; transition: transform 0.25s; }
.about-milestone-card:hover { transform: translateX(4px); }
.about-milestone-year { display: inline-block; padding: 4px 14px; border-radius: 20px; background: var(--accent-color); color: #fff; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; }
.about-milestone-title { font-family: var(--font-heading); font-size: 1.25rem; margin-bottom: 8px; }
.about-milestone-desc { color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; }

/* ── CTA ── */
.about-cta-section { padding: 90px 0; background: var(--bg-darker); }
.about-cta-card { padding: 80px 60px; text-align: center; border-radius: 30px; position: relative; overflow: hidden; max-width: 900px; margin: 0 auto; background: var(--bg-card); border: 1px solid var(--border-light); }
.about-cta-glow { position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: var(--brand-gradient); filter: blur(150px); opacity: 0.12; border-radius: 50%; }
.about-cta-title { font-family: var(--font-heading); font-size: clamp(1.8rem, 3.5vw, 2.6rem); margin-bottom: 16px; position: relative; }
.about-cta-desc { color: var(--text-muted); max-width: 600px; margin: 0 auto 36px; font-size: 1.05rem; line-height: 1.7; position: relative; }
.about-cta-btn { position: relative; }

/* ── About Responsive ── */
@media (max-width: 768px) {
    .about-hero-split { grid-template-columns: 1fr; gap: 40px; }
    .about-hero-right { min-height: 200px; }
    .about-hero { padding: 100px 20px 0; }
    .about-team-grid { grid-template-columns: 1fr 1fr; gap: 20px; }
    .about-work-grid { grid-template-columns: 1fr; }
    .about-stats-row { gap: 30px; }
    .about-timeline-track { padding-left: 40px; }
    .about-milestone-dot { left: -29px; width: 16px; height: 16px; }
    .about-timeline-track::before { left: 15px; }
    .about-cta-card { padding: 50px 24px; }
}
@media (max-width: 480px) {
    .about-team-grid { grid-template-columns: 1fr; }
    .about-hero-right { min-height: 160px; }
}
```

- [ ] **Step 2: Verify no broken CSS syntax**

Run: `node -e "const css = require('fs').readFileSync('css/style.css','utf8'); console.log('CSS lines:', css.split('\\n').length); console.log('Unclosed braces:', (css.match(/{/g)||[]).length - (css.match(/}/g)||[]).length)"`

Expected: `Unclosed braces: 0`

---

### Task 4: Build and verify

**Files:**
- All files from Tasks 1-3

- [ ] **Step 1: Run the build**

Run: `npm run build`

Expected: Build completes with no errors. `dist/about.html` is generated.

- [ ] **Step 2: Verify dist/about.html was generated with new content**

Run: `grep -c "about-hero-split\|about-milestone\|about-work-grid" dist/about.html`

Expected: At least 3 matches (confirms new class names are in the built output).

- [ ] **Step 3: Verify removed sections are gone**

Run: `grep -c "about-expertise\|about-incubation" dist/about.html`

Expected: `0` (confirms old sections removed).

- [ ] **Step 4: Serve and manually verify**

Run: `npx serve dist -p 8080`

Open `http://localhost:8080/about.html` in browser. Check:
- Split hero renders with gradient panel on right
- Stats bar shows 4 numbers with gradient text
- Team cards show with gradient ring avatars and taglines
- 4 bento work cards in 2×2 grid
- Timeline has milestone cards with pill year badges
- FAQ and CTA intact
- Toggle light/dark mode — section rhythm alternates correctly
- Mobile: resize to 375px — single column, no overflow

- [ ] **Step 5: Commit**

```bash
git add data/about.json js/app.js css/style.css
git commit -m "redesign: premium about page matching home page quality

- Split hero with gradient visual panel
- Upgraded team cards with gradient ring avatars and taglines
- Bento-style work cards (6 → 4, merged redundant items)
- Milestone timeline with card containers and pill year badges
- Removed redundant capabilities section (duplicated home page)
- Removed standalone incubator section (folded into timeline)
- Alternating section backgrounds for visual rhythm
- Light mode contrast improvements
- Strategic accent usage (not all-red subtitles)
- Full responsive: 3-col → 2-col → 1-col grid breakpoints

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```
