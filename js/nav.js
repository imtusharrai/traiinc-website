/**
 * Trai Inc — Quytech-style Hanging Dropdown Navigation + Footer (nav.js)
 * Hanging mega-dropdowns with mixed-depth Layer 2 → Layer 3 switching
 */
(function () {

    // ── Chevron SVGs ─────────────────────────────────────────────────────
    const chevronDown = `<svg class="chevron" viewBox="0 0 10 6" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;
    const chevronRight = `<svg class="nav-l2-chevron" viewBox="0 0 6 10" width="6" height="10"><path d="M1 1l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;

    // ── Social icons ─────────────────────────────────────────────────────
    const socialIcons = {
        linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        twitter: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        instagram: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
        youtube: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
        whatsapp: `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.744 3.048 9.38L1.054 31.2l6.044-1.94a15.9 15.9 0 008.906 2.704C24.826 31.964 32 24.788 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.958 2.042-3.212 2.312-.86.182-1.98.328-5.754-1.236-4.83-2.004-7.938-6.902-8.18-7.222-.232-.32-1.948-2.596-1.948-4.952s1.232-3.508 1.67-3.988c.438-.48.956-.6 1.276-.6.32 0 .636.004.914.016.294.014.688-.112 1.076.82.396.952 1.348 3.288 1.466 3.528.118.24.198.518.04.836-.16.32-.24.518-.478.8-.24.28-.504.626-.72.84-.24.24-.488.498-.21.976.28.48 1.244 2.054 2.672 3.328 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.278-.32 1.196-1.392 1.514-1.872.318-.48.636-.396 1.076-.24.438.16 2.784 1.312 3.262 1.552.48.24.798.356.916.556.118.198.118 1.156-.278 2.272z"/></svg>`
    };

    // ── Vector Nav Icons (replacing OS emojis) ─────────────────────────────
    const navIcons = {
        d2c: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
        startups: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        smb: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
        enterprise: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        realestate: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
        healthcare: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
        fintech: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
        ecommerce: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>`,
        edtech: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
        logistics: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
        media: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
        travel: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>`,
        food: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
        manufacturing: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
        about: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
        team: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
        cases: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        careers: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>`,
        partner: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 001.4 0l4.6-4.6a1 1 0 000-1.4l-2-2"/><path d="m18 10 1-1a2 2 0 000-3l-2-2a2 2 0 00-3 0l-1 1"/><path d="m6 14 1 1a2 2 0 003 0l2-2a2 2 0 000-3l-1-1"/><path d="m2 18 4.6-4.6a1 1 0 011.4 0l2 2a1 1 0 010 1.4L5.4 21.4a1 1 0 01-1.4 0L2 19.4a1 1 0 010-1.4z"/></svg>`,
        contact: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>`,
        ai: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
        customSoftware: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        mobile: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
        cloud: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>`,
        data: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`,
        rocket: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-4 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4.5c1.45-1.45 4.5-2 4.5-2"/></svg>`,
        pitch: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20"/><path d="M21 3v11a2 2 0 01-2 2H5a2 2 0 01-2-2V3"/><path d="m7 21 5-5 5 5"/></svg>`,
        grants: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
        cohort: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`,
        pin: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`
    };

    // ══════════════════════════════════════════════════════════════════════
    // NAV DATA (High-Conviction 5 Service Pillars & Curated Industries)
    // ══════════════════════════════════════════════════════════════════════
    const navData = {
        aiEngineering: {
            label: "AI & Software Engineering",
            type: "flat",
            cols: [
                {
                    heading: "Engineering Pods & Capabilities",
                    items: [
                        { icon: navIcons.customSoftware, label: "Custom Software & SaaS", href: "custom-software.html", desc: "High-throughput web apps, multi-tenant SaaS & microservices" },
                        { icon: navIcons.ai, label: "AI Agents & Automation", href: "ai-automation.html", desc: "Autonomous workflows, voice front-offices & multi-agent swarms" },
                        { icon: navIcons.mobile, label: "Mobile Apps (iOS & Android)", href: "mobile-apps.html", desc: "Native Swift/Kotlin & Flutter apps built for 60fps performance" },
                        { icon: navIcons.enterprise, label: "Custom CRM & Enterprise ERP", href: "enterprise-platforms.html", desc: "Unified inventory, distribution & business management engines" },
                        { icon: navIcons.cloud, label: "Cloud Native & DevOps", href: "cloud-devops.html", desc: "Kubernetes, zero-downtime AWS/GCP pipelines & IaC" },
                        { icon: navIcons.data, label: "Data & Edge Pipelines", href: "data-analytics.html", desc: "Real-time streaming, dbt data models & low-latency edge APIs" }
                    ]
                }
            ],
            featured: {
                stat: "Senior Pod Delivery",
                title: "Production AI & Software Systems",
                desc: "Senior engineering pods delivering custom AI agents, SaaS platforms, and enterprise software at 40% lower burn.",
                ctaLabel: "Explore AI Engineering →",
                ctaHref: "ai-engineering.html"
            }
        },

        incubator: {
            label: "Startup Incubator & Funding",
            type: "flat",
            cols: [
                {
                    heading: "Zero-to-One Launchpad & Funding",
                    items: [
                        { icon: navIcons.startups, label: "Zero-to-One Incubation", href: "incubator.html#incubation", desc: "Idea validation, market sizing & lean system architecture" },
                        { icon: navIcons.rocket, label: "30-Day MVP Launchpad", href: "incubator.html#mvp-launchpad", desc: "Live web/mobile product with auth, payments & admin" },
                        { icon: navIcons.pitch, label: "Seed & Grant Readiness", href: "incubator.html#funding-readiness", desc: "12-15 slide pitch deck, 3-year model & investor data room" },
                        { icon: navIcons.grants, label: "DPIIT & SISFS Grants", href: "incubator.html#grants", desc: "Startup India Seed Fund & grant DPR documentation support" },
                        { icon: navIcons.cohort, label: "Apply for 2026 Cohort", href: "incubator.html#apply", desc: "Fixed-fee founder sprints or hybrid venture co-build partnership" }
                    ]
                }
            ],
            featured: {
                stat: "30-Day Launchpad",
                title: "Working Software Gets Funded",
                desc: "Investors fund working traction, not slide decks alone. We take you from napkin idea to live product and investor data room in 30 days.",
                ctaLabel: "Launch Your Startup / MVP →",
                ctaHref: "incubator.html"
            }
        },

        caseStudies: {
            label: "Case Studies",
            type: "flat",
            cols: [
                {
                    heading: "Quantified Production Deployments",
                    items: [
                        { icon: navIcons.cases, label: "Bhu Master (Agritech)", href: "clients.html#bhumaster", desc: "Automated land records & instant property verification platform" },
                        { icon: navIcons.cases, label: "Om Group (Education & Auto)", href: "clients.html#omgroup", desc: "Multi-campus ERP & real-time admissions engine" },
                        { icon: navIcons.cases, label: "Workezy (Coworking SaaS)", href: "clients.html#workezy", desc: "On-demand service booking, geo-dispatch & vendor payout engine" },
                        { icon: navIcons.cases, label: "Dashak Pharma (Supply Chain)", href: "clients.html#dashak", desc: "Pharma distribution tracking, batch compliance & wholesale portal" }
                    ]
                }
            ],
            featured: {
                stat: "138+ Client Deliveries",
                title: "Measured Business Impact",
                desc: "Explore verified outcomes: 4x lead velocity, automated operations, and enterprise software scaling.",
                ctaLabel: "View All Case Studies →",
                ctaHref: "clients.html"
            }
        },

        globalHubs: {
            label: "Global Hubs",
            type: "flat",
            cols: [
                {
                    heading: "Engineering HQ & Regional Meeting Hubs",
                    items: [
                        { icon: navIcons.pin, label: "Lucknow Global HQ & Incubator", href: "lucknow.html", desc: "DLF MyPad, Gomti Nagar — Core engineering pods & founder incubation" },
                        { icon: navIcons.pin, label: "Bengaluru Tech & Startup Hub", href: "bengaluru.html", desc: "100 Feet Rd, Indiranagar — Tier-1 product scoping & founder sessions" },
                        { icon: navIcons.pin, label: "Cape Town Africa Hub", href: "cape-town.html", desc: "Strand Street — SAST-aligned digital transformation & delivery" },
                        { icon: navIcons.pin, label: "Lusaka Zambia Hub", href: "lusaka.html", desc: "Lilayi — Regional enterprise software, fintech & CRM deployment" }
                    ]
                }
            ],
            featured: {
                stat: "In-Person & Virtual",
                title: "Book Strategy Call",
                desc: "Meet senior engineering architects at any of our 4 hubs or schedule a virtual strategy call.",
                ctaLabel: "Book Strategy Call →",
                ctaHref: "contact.html?type=strategy-call"
            }
        }
    };

    // ══════════════════════════════════════════════════════════════════════
    // DROPDOWN BUILDERS
    // ══════════════════════════════════════════════════════════════════════

    function buildFeaturedCard(featured) {
        if (!featured) return '';
        return `
            <div class="nav-featured-card">
                ${featured.stat ? `<div class="nav-featured-stat">${featured.stat}</div>` : ''}
                <h4>${featured.title}</h4>
                <p>${featured.desc}</p>
                <a href="${featured.ctaHref}" class="nav-featured-link">${featured.ctaLabel}</a>
            </div>
        `;
    }

    function buildFlatDropdown(menuId, data) {
        const colsHTML = data.cols.map(col => {
            const isGrid = col.items.length > 4;
            const containerClass = isGrid ? 'nav-dd-items-grid' : 'nav-dd-items';
            return `
            <div class="nav-dd-col">
                <div class="nav-dd-heading">${col.heading}</div>
                <div class="${containerClass}">
                ${col.items.map(item => {
                    const ext = item.external ? 'target="_blank" rel="noopener"' : '';
                    return `
                    <a href="${item.href}" class="nav-dd-item" ${ext}>
                        <span class="nav-dd-icon">${item.icon}</span>
                        <div class="nav-dd-text">
                            <span class="nav-dd-label">${item.label}</span>
                            <span class="nav-dd-desc">${item.desc}</span>
                        </div>
                    </a>`;
                }).join('')}
                </div>
            </div>
        `}).join('');

        return `
            <div class="nav-mega-dropdown nav-dd-${menuId}">
                <div class="nav-dd-inner">
                    <div class="nav-dd-cols">${colsHTML}</div>
                    <div class="nav-dd-featured">${buildFeaturedCard(data.featured)}</div>
                </div>
            </div>
        `;
    }

    function buildLayeredDropdown(menuId, data) {
        // Layer 2 list (left column)
        const l2HTML = data.categories.map((cat, idx) => `
            <div class="nav-l2-item ${idx === 0 ? 'active' : ''}"
                 data-cat-id="${cat.id}"
                 data-has-children="${cat.hasChildren}">
                <span>${cat.label}</span>
                ${cat.hasChildren ? chevronRight : ''}
            </div>
        `).join('');

        // Layer 3 panels (one per category with children)
        const l3PanelsHTML = data.categories.filter(c => c.hasChildren).map((cat, idx) => {
            const gridHTML = cat.subitems.map(sub =>
                `<a href="${sub.href}" class="nav-l3-link">
                    <span class="nav-l3-label">${sub.label}</span>
                    ${sub.desc ? `<span class="nav-l3-desc">${sub.desc}</span>` : ''}
                </a>`
            ).join('');

            const miniHTML = cat.miniFeature ? `
                <div class="nav-mini-feature">
                    <h4>${cat.miniFeature.title}</h4>
                    <p>${cat.miniFeature.desc}</p>
                    <a href="${cat.miniFeature.ctaHref}" class="nav-featured-link">${cat.miniFeature.ctaLabel}</a>
                </div>
            ` : '';

            return `
                <div class="nav-l3-panel ${idx === 0 ? 'active' : ''}" data-panel="${cat.id}">
                    <div class="nav-l3-grid">${gridHTML}</div>
                    ${miniHTML}
                </div>
            `;
        }).join('');

        // Featured panels (one per category WITHOUT children)
        const featuredPanelsHTML = data.categories.filter(c => !c.hasChildren).map(cat => `
            <div class="nav-l3-panel nav-featured-panel" data-panel="${cat.id}">
                <div class="nav-featured-full">
                    <div class="nav-featured-placeholder" style="background:${cat.featured.gradient}">
                        <span>${cat.featured.emoji}</span>
                    </div>
                    <h4>${cat.featured.title}</h4>
                    <p>${cat.featured.desc}</p>
                    <a href="${cat.featured.ctaHref}" class="nav-featured-link">${cat.featured.ctaLabel}</a>
                </div>
            </div>
        `).join('');

        return `
            <div class="nav-mega-dropdown nav-dd-${menuId} nav-dd-layered">
                <div class="nav-dd-layered-inner">
                    <div class="nav-l2-list">${l2HTML}</div>
                    <div class="nav-l3-container">
                        ${l3PanelsHTML}
                        ${featuredPanelsHTML}
                    </div>
                </div>
            </div>
        `;
    }

    function buildDropdown(menuId, data) {
        if (data.type === 'layered') {
            return buildLayeredDropdown(menuId, data);
        }
        return buildFlatDropdown(menuId, data);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MAIN NAV BUILDER
    // ══════════════════════════════════════════════════════════════════════

    async function buildNav() {
        const page = document.body.getAttribute('data-page') || '';

        const navHTML = `
            <div class="nav-container">
                <a href="index.html" class="logo"><img src="assets/logos/logo_white.png" alt="Trai Inc" class="nav-logo-img nav-logo-dark"><img src="assets/logos/logo_gradient.png" alt="Trai Inc" class="nav-logo-img nav-logo-light"></a>
                <ul class="nav-links" id="nav-links">
                    <li class="has-dropdown">
                        <a href="ai-engineering.html" class="${['ai-engineering','ai-automation','mobile-apps','web-development','custom-software','cloud-devops','enterprise-platforms','data-analytics'].includes(page)?'active':''}">${navData.aiEngineering.label} ${chevronDown}</a>
                        ${buildDropdown('aiEngineering', navData.aiEngineering)}
                    </li>
                    <li class="has-dropdown">
                        <a href="incubator.html" class="${['incubator','startups','funding-readiness'].includes(page)?'active':''}">${navData.incubator.label} ${chevronDown}</a>
                        ${buildDropdown('incubator', navData.incubator)}
                    </li>
                    <li class="has-dropdown">
                        <a href="clients.html" class="${['clients','case-studies'].includes(page)?'active':''}">${navData.caseStudies.label} ${chevronDown}</a>
                        ${buildDropdown('caseStudies', navData.caseStudies)}
                    </li>
                    <li class="has-dropdown">
                        <a href="contact.html#offices" class="${['lucknow','bengaluru','cape-town','lusaka','contact'].includes(page)?'active':''}">${navData.globalHubs.label} ${chevronDown}</a>
                        ${buildDropdown('globalHubs', navData.globalHubs)}
                    </li>
                    <li>
                        <a href="blog.html" class="${page === 'blog' || page.startsWith('blog-') ? 'active' : ''}">Blog</a>
                    </li>
                </ul>
                <div class="nav-actions">
                    <button class="full-menu-btn" id="full-menu-btn" aria-label="Open Full Menu">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
                        <span class="full-menu-label">Menu</span>
                    </button>
                    <div class="theme-toggle-wrap" id="theme-toggle-wrap">
                        <span class="theme-tooltip" id="theme-tooltip">Switch to Dark Mode</span>
                        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                            <span class="theme-toggle-track">
                                <span class="theme-toggle-thumb">
                                    <svg class="icon-sun" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 17a5 5 0 100-10 5 5 0 000 10zm0-12a1 1 0 001-1V3a1 1 0 00-2 0v1a1 1 0 001 1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm8-7a1 1 0 000-2h-1a1 1 0 000 2h1zM5 12a1 1 0 00-1-1H3a1 1 0 000 2h1a1 1 0 001-1zm11.95-6.364a1 1 0 000-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM7.757 17.657a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zm9.9 1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zM7.05 7.05a1 1 0 000-1.414l-.707-.707A1 1 0 004.93 6.343l.707.707A1 1 0 007.05 7.05z"/></svg>
                                    <svg class="icon-moon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
                                </span>
                            </span>
                        </button>
                    </div>
                    <a href="contact.html?type=strategy-call" class="btn-primary">Book Strategy Call</a>
                    <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">&#9776;</button>
                </div>
            </div>
        `;

        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = navHTML;
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 20);
            });
        }

        // ── Layer 2 → Layer 3 hover switching (Services dropdown) ──
        document.querySelectorAll('.nav-l2-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const catId = item.dataset.catId;
                const dropdown = item.closest('.nav-mega-dropdown');

                // Deactivate all L2 items
                dropdown.querySelectorAll('.nav-l2-item').forEach(i => i.classList.remove('active'));
                // Deactivate all L3 panels
                dropdown.querySelectorAll('.nav-l3-panel').forEach(p => p.classList.remove('active'));

                // Activate this item
                item.classList.add('active');

                // Activate matching panel
                const panel = dropdown.querySelector(`.nav-l3-panel[data-panel="${catId}"]`);
                if (panel) panel.classList.add('active');
            });
        });

        // ── Mobile toggle ──
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const navLinks  = document.getElementById('nav-links');
        if (mobileBtn && navLinks) {
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navLinks.classList.toggle('mobile-open');
                mobileBtn.innerHTML = navLinks.classList.contains('mobile-open') ? '✕' : '&#9776;';
            });
        }

        // ── Mobile accordion (tap to expand dropdown) ──
        document.querySelectorAll('.has-dropdown > a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 900) {
                    e.preventDefault();
                    link.parentElement.classList.toggle('mobile-expanded');
                }
            });
        });

        // ── Close on outside click ──
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#navbar') && navLinks) {
                navLinks.classList.remove('mobile-open');
                document.querySelectorAll('.has-dropdown').forEach(li => li.classList.remove('mobile-expanded'));
                if (mobileBtn) mobileBtn.innerHTML = '&#9776;';
            }
        });

        // ── Close on Escape ──
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks) {
                navLinks.classList.remove('mobile-open');
                document.querySelectorAll('.has-dropdown').forEach(li => li.classList.remove('mobile-expanded'));
                if (mobileBtn) mobileBtn.innerHTML = '&#9776;';
            }
        });

        // ── Theme Toggle ──
        function applyTheme(isLight) {
            document.body.classList.toggle('light-mode', isLight);
            const tooltip = document.getElementById('theme-tooltip');
            const toggle  = document.getElementById('theme-toggle');
            if (tooltip) tooltip.textContent = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
            if (toggle)  toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
            if (toggle)  toggle.classList.toggle('is-light', isLight);
        }

        const savedTheme = localStorage.getItem('trai-theme');
        applyTheme(savedTheme !== 'dark');

        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const nowLight = !document.body.classList.contains('light-mode');
                applyTheme(nowLight);
                localStorage.setItem('trai-theme', nowLight ? 'light' : 'dark');
            });
        }

        // ── Hamburger → Full Menu Button (opens mobile nav on desktop too) ──
        const fullMenuBtn = document.getElementById('full-menu-btn');
        if (fullMenuBtn && navLinks) {
            fullMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-open');
            });
        }

        // ── Bot Detection for SEO ──
        if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
            document.documentElement.classList.add('bot-detected');
        }

        // ── Footer ──
        const footerEl = document.getElementById('footer');
        if (footerEl) {
            footerEl.innerHTML = `
        <div class="container footer-top">
            <div class="footer-brand">
                <a href="index.html" class="footer-logo-wrap" aria-label="TRAI Inc home">
                    <span class="footer-logo-pulse"></span>
                    <img src="assets/logos/logo.png" alt="TRAI Inc" class="footer-logo-img">
                </a>
                <div class="footer-brand-name">TRAI Inc</div>
                <p class="footer-tagline" data-cms-bind="brand_tagline">AI-native software engineering consultancy &amp; startup incubator — shipping production AI systems, 30-day investor-ready MVPs, and enterprise software at lean burn.</p>
                <div class="footer-contact" data-cms-section="footer-contact">
                    <a href="tel:+917905495478" class="contact-link" data-cms-bind="phone">📞 +91 79054 95478</a><br>
                    <span class="contact-label">Enquiry:</span> <a href="mailto:hello@traiinc.com" class="contact-link" data-cms-bind="email">✉️ hello@traiinc.com</a><br>
                    <span class="contact-label">Support:</span> <a href="mailto:support@traiinc.com" class="contact-link">✉️ support@traiinc.com</a>
                </div>
                <div class="footer-social">
                    <a href="https://www.linkedin.com/company/trai-inc" target="_blank" rel="noopener" class="social-icon social-linkedin" aria-label="LinkedIn">${socialIcons.linkedin}</a>
                    <a href="https://x.com/inctrai" target="_blank" rel="noopener" class="social-icon social-x" aria-label="Twitter / X">${socialIcons.twitter}</a>
                    <a href="https://www.instagram.com/traiinc" target="_blank" rel="noopener" class="social-icon social-insta" aria-label="Instagram">${socialIcons.instagram}</a>
                    <a href="https://www.youtube.com/@traiinc" target="_blank" rel="noopener" class="social-icon social-yt" aria-label="YouTube">${socialIcons.youtube}</a>
                    <a href="https://wa.me/917905495478?text=Hi%20TRAI%20Inc,%20I'm%20looking%20for%20an%20enterprise%20software%20solution." target="_blank" rel="noopener" class="social-icon social-wa" aria-label="WhatsApp">${socialIcons.whatsapp}</a>
                </div>
            </div>
            <div class="link-group">
                <h4>AI &amp; Engineering</h4>
                <ul>
                    <li><a href="ai-engineering.html">AI &amp; Software Engineering</a></li>
                    <li><a href="custom-software.html">Custom Software &amp; SaaS</a></li>
                    <li><a href="ai-automation.html">AI Agents &amp; Automation</a></li>
                    <li><a href="mobile-apps.html">Mobile App Engineering</a></li>
                    <li><a href="enterprise-platforms.html">Enterprise CRM &amp; ERP</a></li>
                    <li><a href="cloud-devops.html">Cloud Native &amp; DevOps</a></li>
                    <li><a href="data-analytics.html">Data &amp; Edge Pipelines</a></li>
                </ul>
            </div>
            <div class="link-group">
                <h4>Startup Incubator</h4>
                <ul>
                    <li><a href="incubator.html">Startup Incubator &amp; Funding</a></li>
                    <li><a href="incubator.html#mvp-launchpad">30-Day MVP Launchpad</a></li>
                    <li><a href="incubator.html#funding-readiness">Seed &amp; Grant Readiness</a></li>
                    <li><a href="incubator.html#grants">DPIIT &amp; SISFS Grants</a></li>
                    <li><a href="incubator.html#apply">Apply for 2026 Cohort</a></li>
                    <li><a href="startups.html">Startups Program</a></li>
                    <li><a href="ai-engineering.html#estimator">Scope Estimator</a></li>
                </ul>
            </div>
            <div class="link-group">
                <h4>Global Hubs &amp; Proof</h4>
                <ul>
                    <li><a href="lucknow.html">Lucknow Global HQ</a></li>
                    <li><a href="bengaluru.html">Bengaluru Tech Hub</a></li>
                    <li><a href="cape-town.html">Cape Town Africa Hub</a></li>
                    <li><a href="lusaka.html">Lusaka Zambia Hub</a></li>
                    <li><a href="clients.html">Verified Case Studies</a></li>
                    <li><a href="about.html">About TRAI Inc</a></li>
                    <li><a href="contact.html?type=strategy-call">Book Strategy Call</a></li>
                </ul>
            </div>
            <div class="footer-newsletter">
                <h4>Stay in the loop</h4>
                <p>Quarterly briefings on multi-agent architectures, cloud economics, and high-scale systems.</p>
                <form class="newsletter-form">
                    <input type="email" name="email" placeholder="Work Email" required>
                    <button type="submit">Subscribe</button>
                </form>
                <div class="footer-badges">
                    <span class="footer-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:5px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Milestone-Driven Sprints</span>
                    <span class="footer-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:5px;"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>Senior Engineers Only</span>
                    <span class="footer-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:-2px;margin-right:5px;"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>100% Code Ownership</span>
                </div>
            </div>
        </div>
        <div class="footer-offices-strip">
            <div class="container footer-offices-container">
                <div class="footer-offices-header">
                    <div class="footer-offices-title-group">
                        <span class="footer-offices-kicker">Global Footprint</span>
                        <h4 class="footer-offices-heading">Our Global Engineering HQ &amp; Regional Hubs</h4>
                    </div>
                    <span class="footer-offices-tagline">Serving clients across Bengaluru, Delhi-NCR, Lucknow, Cape Town &amp; Lusaka</span>
                </div>
                <div class="footer-offices-grid" data-cms-section="offices">
                    <a href="lucknow.html" class="footer-office-card" style="text-decoration:none;color:inherit;display:flex;">
                        <div class="footer-office-card-head">
                            <span class="footer-office-flag" title="India" aria-label="India"><svg viewBox="0 0 640 480" width="22" height="16" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><path fill="#f93" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#128807" d="M0 320h640v160H0z"/><circle cx="320" cy="240" r="40" fill="none" stroke="#008" stroke-width="6"/><circle cx="320" cy="240" r="8" fill="#008"/></svg></span>
                            <div>
                                <strong class="footer-office-city">Lucknow, India</strong>
                                <span class="footer-office-type">Global Engineering HQ &amp; Startup Incubator</span>
                            </div>
                        </div>
                        <p class="footer-office-address">Tower B-2, 1109, 11th Floor, DLF MyPad, Vibhuti Khand, Gomti Nagar, Lucknow 226010 — Core AI/software engineering pods, founder incubation studio, and full-stack delivery center.</p>
                    </a>
                    <a href="bengaluru.html" class="footer-office-card" style="text-decoration:none;color:inherit;display:flex;">
                        <div class="footer-office-card-head">
                            <span class="footer-office-flag" title="India" aria-label="India"><svg viewBox="0 0 640 480" width="22" height="16" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><path fill="#f93" d="M0 0h640v160H0z"/><path fill="#fff" d="M0 160h640v160H0z"/><path fill="#128807" d="M0 320h640v160H0z"/><circle cx="320" cy="240" r="40" fill="none" stroke="#008" stroke-width="6"/><circle cx="320" cy="240" r="8" fill="#008"/></svg></span>
                            <div>
                                <strong class="footer-office-city">Bengaluru, India</strong>
                                <span class="footer-office-type">India Tech &amp; Startup Hub (Indiranagar)</span>
                            </div>
                        </div>
                        <p class="footer-office-address">660, 2nd Floor, 100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038 — In-person founder consultations, Tier-1 product scoping, and investor/startup ecosystem meetings.</p>
                    </a>
                    <a href="cape-town.html" class="footer-office-card" style="text-decoration:none;color:inherit;display:flex;">
                        <div class="footer-office-card-head">
                            <span class="footer-office-flag" title="South Africa" aria-label="South Africa"><svg viewBox="0 0 640 480" width="22" height="16" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><clipPath id="sa-fl"><path d="M0 0h640v480H0z"/></clipPath><g clip-path="url(#sa-fl)"><path fill="#000" d="M0 0h640v480H0z"/><path fill="#fff" d="M0 0h640v160H0z"/><path fill="#e03c31" d="M0 0h640v133.3H0z"/><path fill="#fff" d="M0 320h640v160H0z"/><path fill="#001489" d="M0 346.7h640V480H0z"/><path fill="#fc6" d="M0 0l240 240L0 480z"/><path fill="#000" d="M0 40l200 200L0 440z"/><path fill="#fff" d="M160 0h106.7L453.3 186.7H640v106.6H453.3L266.7 480H160l186.7-240z"/><path fill="#007749" d="M0 160h293.3L533.3 240 293.3 320H0v-53.3l186.7-26.7L0 213.3z"/></g></svg></span>
                            <div>
                                <strong class="footer-office-city">Cape Town, South Africa</strong>
                                <span class="footer-office-type">Southern Africa Hub (Strand Street)</span>
                            </div>
                        </div>
                        <p class="footer-office-address">WeWork, 80 Strand Street, Cape Town City Centre, Cape Town, Western Cape 8001 — Local discovery sessions, SAST-aligned project delivery, and digital transformation advisory.</p>
                    </a>
                    <a href="lusaka.html" class="footer-office-card" style="text-decoration:none;color:inherit;display:flex;">
                        <div class="footer-office-card-head">
                            <span class="footer-office-flag" title="Zambia" aria-label="Zambia"><svg viewBox="0 0 640 480" width="22" height="16" style="border-radius:2px;box-shadow:0 0 1px rgba(0,0,0,0.3);"><path fill="#198a00" d="M0 0h640v480H0z"/><g transform="translate(426.7,160)"><path fill="#de2010" d="M0 0h71.1v320H0z"/><path fill="#000" d="M71.1 0h71.1v320H71.1z"/><path fill="#ef7d00" d="M142.2 0h71.1v320H142.2z"/></g><path fill="#ef7d00" d="M497.8 80l44.4-40 44.5 40-20-40 35.6-20-40 10-20-30-20 30-40-10 35.5 20z"/></svg></span>
                            <div>
                                <strong class="footer-office-city">Lusaka, Zambia</strong>
                                <span class="footer-office-type">Zambia Operations Hub</span>
                            </div>
                        </div>
                        <p class="footer-office-address">Green Park Estate, Off Kafue Road, Lilayi, Lusaka 10101, Zambia — On-ground enterprise software, custom CRM/fintech deployment, and new venture partnerships.</p>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>© 2026 Trai Inc Services. All Rights Reserved</p>
            <div class="legal-links">
                <a href="terms.html">Terms of Service</a> |
                <a href="privacy.html">Privacy Policy</a> |
                <a href="refund.html">Refund Policy</a>
            </div>
        </div>
            `;
        }
// ── WhatsApp FAB (Singleton without fake badge) ──
        if (!document.querySelector('.fab-logo')) {
            var whatsappNumber = '917905495478';
            var whatsappMessage = encodeURIComponent("Hi TRAI Inc, I'm looking for an enterprise digital solution.");
            var whatsappURL = 'https://wa.me/' + whatsappNumber + '?text=' + whatsappMessage;

            var fabLogo = document.createElement('a');
            fabLogo.className = 'fab-logo';
            fabLogo.href = whatsappURL;
            fabLogo.target = '_blank';
            fabLogo.rel = 'noopener noreferrer';
            fabLogo.setAttribute('aria-label', 'Chat with us on WhatsApp');
            fabLogo.innerHTML = '<svg viewBox="0 0 32 32" width="32" height="32" fill="white"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.744 3.048 9.38L1.054 31.2l6.044-1.94a15.9 15.9 0 008.906 2.704C24.826 31.964 32 24.788 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.958 2.042-3.212 2.312-.86.182-1.98.328-5.754-1.236-4.83-2.004-7.938-6.902-8.18-7.222-.232-.32-1.948-2.596-1.948-4.952s1.232-3.508 1.67-3.988c.438-.48.956-.6 1.276-.6.32 0 .636.004.914.016.294.014.688-.112 1.076.82.396.952 1.348 3.288 1.466 3.528.118.24.198.518.04.836-.16.32-.24.518-.478.8-.24.28-.504.626-.72.84-.24.24-.488.498-.21.976.28.48 1.244 2.054 2.672 3.328 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.278-.32 1.196-1.392 1.514-1.872.318-.48.636-.396 1.076-.24.438.16 2.784 1.312 3.262 1.552.48.24.798.356.916.556.118.198.118 1.156-.278 2.272z"/></svg>';
            document.body.appendChild(fabLogo);
        }
        
        // ── Newsletter form (real submit → /api/subscribe) ──
        var newsletterForms = document.querySelectorAll('.newsletter-form, .nl-form');
        newsletterForms.forEach(function(newsletterForm) {
            newsletterForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                var btn = newsletterForm.querySelector('button');
                var input = newsletterForm.querySelector('input[name="email"]') || newsletterForm.querySelector('input[type="email"]');
                var original = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = 'Sending…';
                try {
                    var formData = new FormData();
                    formData.append('email', input.value);
                    var res = await fetch('/api/subscribe', { method: 'POST', body: formData });
                    if (!res.ok) throw new Error('subscribe failed');
                    btn.innerHTML = 'Subscribed! ✅';
                    if (typeof newsletterForm.reset === 'function') newsletterForm.reset();
                    else input.value = '';
                } catch (err) {
                    btn.innerHTML = 'Try again';
                } finally {
                    setTimeout(function() {
                        btn.innerHTML = original;
                        btn.disabled = false;
                    }, 3000);
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildNav);
    } else {
        buildNav();
    }

})();
