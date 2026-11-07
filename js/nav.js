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
        contact: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>`
    };

    // ══════════════════════════════════════════════════════════════════════
    // NAV DATA (High-Conviction 5 Service Pillars & Curated Industries)
    // ══════════════════════════════════════════════════════════════════════
    const navData = {
        whoWeHelp: {
            label: "Industries",
            type: "flat",
            cols: [
                {
                    heading: "By Business Stage",
                    items: [
                        { icon: navIcons.d2c, label: "Retail to D2C Brands", href: "d2c.html", desc: "Scale offline retail to pan-India e-commerce" },
                        { icon: navIcons.startups, label: "High-Growth Startups", href: "startups.html", desc: "Production MVPs, cloud architectures & rapid scale" },
                        { icon: navIcons.smb, label: "Mid-Market Enterprises", href: "smb.html", desc: "Custom ERPs, operational workflows & system modernization" },
                        { icon: navIcons.enterprise, label: "Large Enterprises", href: "enterprise.html", desc: "Multi-region cloud, autonomous AI agents & zero-trust security" }
                    ]
                },
                {
                    heading: "By Industry",
                    items: [
                        { icon: navIcons.realestate, label: "Real Estate & PropTech", href: "industries.html#realestate", desc: "Listing portals, virtual tours & CRM systems" },
                        { icon: navIcons.healthcare, label: "Healthcare & Pharma", href: "industries.html#healthcare", desc: "Supply chain tracking & compliance portals" },
                        { icon: navIcons.fintech, label: "FinTech & Banking", href: "industries.html#fintech", desc: "High-throughput ledgers & secure payments" },
                        { icon: navIcons.ecommerce, label: "E-Commerce & Retail", href: "industries.html#ecommerce", desc: "Headless storefronts & inventory automation" },
                        { icon: navIcons.edtech, label: "Education & EdTech", href: "industries.html#edtech", desc: "LMS engines & digital classrooms" },
                        { icon: navIcons.logistics, label: "Logistics & Supply Chain", href: "industries.html#logistics", desc: "Fleet routing, IoT telematics & dispatch" },
                        { icon: navIcons.manufacturing, label: "Manufacturing & Industrial", href: "industries.html#manufacturing", desc: "Custom MES, automated inventory & telemetry" },
                        { icon: navIcons.media, label: "Media & Entertainment", href: "industries.html#media", desc: "Streaming platforms & content distribution" },
                        { icon: navIcons.travel, label: "Travel & Hospitality", href: "industries.html#travel", desc: "Booking engines & guest experience suites" },
                        { icon: navIcons.food, label: "Food & Restaurant Tech", href: "industries.html#food", desc: "Centralized POS, delivery & kitchen dispatch" }
                    ]
                }
            ],
            featured: {
                title: "138+ Enterprise Deliveries",
                desc: "Real Estate, Healthcare, FinTech, and more — engineered with zero bloat and 100% IP ownership.",
                stat: "94% Client Retention",
                ctaLabel: "View Verified Case Studies →",
                ctaHref: "clients.html"
            }
        },

        services: {
            label: "Solutions",
            type: "layered",
            categories: [
                {
                    id: "ai-automation",
                    label: "AI & Agentic Automation",
                    hasChildren: true,
                    href: "ai-automation.html",
                    subitems: [
                        { label: "Autonomous Workflow Agents", href: "ai-automation.html#workflows", desc: "Rule-driven & LLM agents executing back-office tasks" },
                        { label: "Enterprise RAG & Knowledge Systems", href: "ai-automation.html#customer-service", desc: "Secure multi-tenant search over proprietary business data" },
                        { label: "Multi-Agent System (MAS) Networks", href: "ai-automation.html#mas", desc: "Distributed autonomous agent swarms for complex operations" },
                        { label: "AI Voice & Telephony Agents", href: "ai-automation.html#voice-agents", desc: "Human-grade conversational voice agents for sales & support" },
                        { label: "Lead Gen & Scraping Pipelines", href: "ai-automation.html#lead-gen", desc: "Automated prospecting, web data extraction & CRM sync" },
                        { label: "Predictive Analytics & Data Pipelines", href: "data-analytics.html", desc: "Real-time dashboards, dbt models & Apache Spark ETL" }
                    ],
                    miniFeature: {
                        title: "Autonomous <span class='highlight'>Intelligence</span>",
                        desc: "Deploy custom agentic infrastructure that operates 24/7 with senior architect oversight.",
                        ctaLabel: "Explore AI Solutions →",
                        ctaHref: "ai-automation.html"
                    }
                },
                {
                    id: "custom-software",
                    label: "Custom Software & Web",
                    hasChildren: true,
                    href: "custom-software.html",
                    subitems: [
                        { label: "Bespoke Web Applications", href: "custom-software.html#web-apps", desc: "High-throughput React, Next.js & Node.js platforms" },
                        { label: "Multi-Tenant SaaS Architecture", href: "custom-software.html#saas", desc: "Scalable subscription products with billing & RBAC" },
                        { label: "High-Performance API Systems", href: "custom-software.html#api", desc: "Zero-latency REST & GraphQL microservice backends" },
                        { label: "Modern Headless CMS Platforms", href: "custom-software.html#cms", desc: "Edge-cached dynamic content delivery architectures" },
                        { label: "Enterprise Systems Integration", href: "custom-software.html#integration", desc: "Bi-directional sync between legacy databases & cloud APIs" },
                        { label: "Custom E-Commerce Architectures", href: "custom-software.html#ecommerce", desc: "High-volume transactional storefronts & payment gateways" }
                    ],
                    miniFeature: {
                        title: "Production-Grade <span class='highlight'>Engineering</span>",
                        desc: "Zero-bloat, modular software systems engineered for enterprise longevity.",
                        ctaLabel: "Explore Custom Software →",
                        ctaHref: "custom-software.html"
                    }
                },
                {
                    id: "enterprise-platforms",
                    label: "Enterprise Platforms & Cloud",
                    hasChildren: true,
                    href: "enterprise-platforms.html",
                    subitems: [
                        { label: "Custom ERP & Supply Chain", href: "enterprise-platforms.html#erp", desc: "Multi-facility inventory, logistics & billing engines" },
                        { label: "Enterprise CRM & Dealership Platforms", href: "enterprise-platforms.html#crm", desc: "Lead distribution, sales tracking & automated pipelines" },
                        { label: "Cloud Migration & Architecture (AWS/GCP)", href: "cloud-devops.html#migration", desc: "Zero-downtime database and infrastructure cutovers" },
                        { label: "CI/CD & Kubernetes Orchestration", href: "cloud-devops.html#cicd", desc: "Automated testing, container clusters & blue-green deploys" },
                        { label: "Infrastructure as Code (Terraform)", href: "cloud-devops.html#iac", desc: "Deterministic multi-cloud provisioning & compliance" },
                        { label: "SOC 2 & Zero-Trust Governance", href: "enterprise-platforms.html#security", desc: "Pen-testing, encryption at rest/transit & audit logging" }
                    ],
                    miniFeature: {
                        title: "Enterprise <span class='highlight'>Reliability</span>",
                        desc: "High-availability cloud infrastructure engineered for 99.99% uptime.",
                        ctaLabel: "Explore Enterprise Platforms →",
                        ctaHref: "enterprise-platforms.html"
                    }
                },
                {
                    id: "mobile-apps",
                    label: "Mobile Application Engineering",
                    hasChildren: true,
                    href: "mobile-apps.html",
                    subitems: [
                        { label: "Native iOS & Android Engineering", href: "mobile-apps.html#native", desc: "Swift & Kotlin native apps optimized for performance" },
                        { label: "Cross-Platform Flutter Apps", href: "mobile-apps.html#flutter", desc: "Single codebase with 60fps native performance across iOS & Android" },
                        { label: "Offline-First Mobile Architecture", href: "mobile-apps.html#native", desc: "Local SQLite caching with resilient background sync" },
                        { label: "App Store Publishing & Compliance", href: "mobile-apps.html#publishing", desc: "Apple App Store & Google Play guideline certification" },
                        { label: "Enterprise Mobile Security", href: "mobile-apps.html#compliances", desc: "Biometric authentication, data encryption & secure storage" }
                    ],
                    miniFeature: {
                        title: "Seamless <span class='highlight'>Mobile UX</span>",
                        desc: "From concept to App Store feature in rapid milestone-driven sprints.",
                        ctaLabel: "Explore Mobile Apps →",
                        ctaHref: "mobile-apps.html"
                    }
                },
                {
                    id: "ui-ux-design",
                    label: "Product Strategy & UI/UX Design",
                    hasChildren: true,
                    href: "ui-ux-design.html",
                    subitems: [
                        { label: "User Research & Journey Mapping", href: "ui-ux-design.html#research", desc: "Customer journey mapping & friction-reduction analysis" },
                        { label: "Interactive Figma Prototyping", href: "ui-ux-design.html#prototyping", desc: "Clickable high-fidelity prototypes tested with real users" },
                        { label: "Living Design Systems & Tokens", href: "ui-ux-design.html#design-systems", desc: "Scalable component libraries in Figma and production code" },
                        { label: "High-Conversion Interface Design", href: "ui-ux-design.html#conversion", desc: "Data-driven UI iterations that lift retention & conversion" },
                        { label: "Comprehensive Brand Identity Systems", href: "ui-ux-design.html#branding", desc: "Logomarks, design guidelines & visual identity standards" },
                        { label: "Design-to-Code Engineering Handoff", href: "ui-ux-design.html#handoff", desc: "Pixel-perfect CSS specs and component documentation" }
                    ],
                    miniFeature: {
                        title: "Interfaces That <span class='highlight'>Convert</span>",
                        desc: "World-class digital product design backed by user behavioral data.",
                        ctaLabel: "Explore UI/UX Design →",
                        ctaHref: "ui-ux-design.html"
                    }
                }
            ]
        },

        whoWeAre: {
            label: "Company",
            type: "flat",
            cols: [
                {
                    heading: "About TRAI Inc",
                    items: [
                        { icon: navIcons.about, label: "About Us", href: "about.html", desc: "Our engineering philosophy & leadership" },
                        { icon: navIcons.team, label: "Leadership & Engineers", href: "about.html#team", desc: "Senior software architects & researchers" },
                        { icon: navIcons.cases, label: "Verified Case Studies", href: "clients.html", desc: "Tangible business metrics for real clients" },
                        { icon: navIcons.careers, label: "Careers", href: "careers.html", desc: "Join our senior engineering studio" }
                    ]
                },
                {
                    heading: "Connect & Engage",
                    items: [
                        { icon: navIcons.partner, label: "Partner With Us", href: "partner.html", desc: "Enterprise referral & white-label software partnerships" },
                        { icon: navIcons.contact, label: "Schedule Technical Discovery", href: "contact.html", desc: "Book an architecture & scoping session" }
                    ]
                }
            ],
            featured: {
                title: "Built For High Conviction",
                desc: "An elite AI-native software consultancy architecting production systems with fixed pricing and guaranteed delivery.",
                stat: "6+ Years · 138+ Clients",
                ctaLabel: "Meet Our Team →",
                ctaHref: "about.html"
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
                        <a href="about.html" class="${['about','careers','partner','incubation','contact'].includes(page)?'active':''}">${navData.whoWeAre.label} ${chevronDown}</a>
                        ${buildDropdown('whoWeAre', navData.whoWeAre)}
                    </li>
                    <li class="has-dropdown">
                        <a href="solutions.html" class="${['ai-automation','mobile-apps','web-development','custom-software','cloud-devops','digital-marketing','enterprise-platforms','hire-dedicated-developers','content-creation'].includes(page)?'active':''}">${navData.services.label} ${chevronDown}</a>
                        ${buildDropdown('services', navData.services)}
                    </li>
                    <li class="has-dropdown">
                        <a href="industries.html" class="${['industries','d2c','msmes','startups','smb','enterprise'].includes(page)?'active':''}">${navData.whoWeHelp.label} ${chevronDown}</a>
                        ${buildDropdown('whoWeHelp', navData.whoWeHelp)}
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
                    <a href="contact.html" class="btn-primary">Get a quote</a>
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
                <p class="footer-tagline" data-cms-bind="brand_tagline">AI-native software engineering consultancy — architecting custom software, scalable cloud systems, and autonomous multi-agent pipelines for ambitious enterprises.</p>
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
                <h4>Solutions</h4>
                <ul>
                    <li><a href="ai-automation.html">AI & Agentic Systems</a></li>
                    <li><a href="custom-software.html">Custom Software & Web</a></li>
                    <li><a href="enterprise-platforms.html">Enterprise Platforms & ERP</a></li>
                    <li><a href="cloud-devops.html">Cloud Native & DevOps</a></li>
                    <li><a href="mobile-apps.html">Mobile Engineering</a></li>
                    <li><a href="ui-ux-design.html">UI/UX Design Systems</a></li>
                    <li><a href="data-analytics.html">Data Engineering & Analytics</a></li>
                </ul>
            </div>
            <div class="link-group">
                <h4>Industries</h4>
                <ul>
                    <li><a href="enterprise.html">Large Enterprises</a></li>
                    <li><a href="startups.html">High-Growth Startups</a></li>
                    <li><a href="d2c.html">Retail & D2C Brands</a></li>
                    <li><a href="smb.html">Mid-Market Companies</a></li>
                    <li><a href="industries.html">All 12+ Industry Verticals</a></li>
                </ul>
                <h4 style="margin-top: 28px;">Company</h4>
                <ul>
                    <li><a href="about.html">About TRAI Inc</a></li>
                    <li><a href="clients.html">Verified Case Studies</a></li>
                    <li><a href="careers.html">Careers</a></li>
                    <li><a href="partner.html">Partnerships</a></li>
                    <li><a href="contact.html">Schedule Discovery</a></li>
                </ul>
            </div>
            <div class="link-group">
                <h4>Due Diligence</h4>
                <ul>
                    <li><a href="clients.html">Case Studies & Metrics</a></li>
                    <li><a href="choosing-a-development-partner.html">Trust & Due Diligence</a></li>
                    <li><a href="our-development-process.html">Engineering Sprint Model</a></li>
                    <li><a href="app-store.html">App Store Deployments</a></li>
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
                    <span class="footer-badge">🔒 Fixed-Price Contracts</span>
                    <span class="footer-badge">⚡ Senior Engineers Only</span>
                    <span class="footer-badge">🛡️ 100% Code Ownership</span>
                </div>
            </div>
        </div>
        <div class="footer-offices-strip">
            <div class="container footer-offices-container">
                <div class="footer-offices-header">
                    <div class="footer-offices-title-group">
                        <span class="footer-offices-kicker">Global Headquarters</span>
                        <h4 class="footer-offices-heading">Center of Software &amp; AI Engineering</h4>
                    </div>
                    <span class="footer-offices-tagline">Architecting and deploying production systems for clients across India, North America, and EMEA</span>
                </div>
                <div class="footer-offices-grid" data-cms-section="offices">
                    <div class="footer-office-card footer-office-card--hq">
                        <div class="footer-office-card-head">
                            <span class="footer-office-flag">📍</span>
                            <div>
                                <strong class="footer-office-city">Lucknow, India · Global Headquarters</strong>
                                <span class="footer-office-type">DLF MyPad Center of Engineering Excellence</span>
                            </div>
                        </div>
                        <p class="footer-office-address">B-2, 11th Floor, DLF MyPad, Opposite Hyatt Regency, Vibhuti Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226010</p>
                    </div>
                    <div class="footer-office-card">
                        <div class="footer-office-card-head">
                            <span class="footer-office-flag">🌐</span>
                            <div>
                                <strong class="footer-office-city">Distributed Senior Teams</strong>
                                <span class="footer-office-type">Bengaluru · San Francisco · London</span>
                            </div>
                        </div>
                        <p class="footer-office-address">Direct engineering communication across Indian Standard Time (IST), US Eastern/Pacific (EST/PST), and Central European Time (CET).</p>
                    </div>
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
