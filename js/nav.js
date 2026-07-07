/**
 * Trai Inc — Mega Dropdown Navigation + Footer (nav.js)
 * Phase 9: 5-item mega-menu, 5-column sitemap footer
 */
(function () {

    // ── 3D Gradient Icon helper ──────────────────────────────────────────────
    function icon3d(emoji, from, to) {
        return `<span class="icon-3d" style="background:linear-gradient(135deg,${from},${to})">${emoji}</span>`;
    }

    // ── Nav Mega-Menu Data (5 top-level items) ──────────────────────────────
    const navData = {
        services: {
            layout: "3-column",
            featured: {
                title: "End-to-End Product Engineering",
                desc: "Build scalable, intelligent systems tailored to your workflows.",
                ctaLabel: "Book a Scoping Call →",
                ctaHref: "https://calendar.app.google/PUsxADQBnpQsTrDbA"
            },
            groups: [
                {
                    heading: "Software Development",
                    items: [
                        { icon: "🏗️", label: "Custom Software",       href: "custom-software.html", desc: "Full-cycle product engineering" },
                        { icon: "🏢", label: "Enterprise Platforms",  href: "enterprise-platforms.html", desc: "ERP, HRMS & integrations" },
                        { icon: "🤝", label: "Custom CRM",            href: "custom-crm-development.html", desc: "Zero per-seat-fee internal tools" },
                    ]
                },
                {
                    heading: "Web Development",
                    items: [
                        { icon: "💻", label: "Web Development",       href: "web-development.html", desc: "React, Next.js & full-stack" },
                        { icon: "📰", label: "WordPress & CMS",       href: "wordpress-cms-development.html", desc: "Custom themes & headless CMS" },
                        { icon: "🛍️", label: "E-commerce",            href: "ecommerce-development.html", desc: "Shopify, WooCommerce & headless" },
                    ]
                },
                {
                    heading: "Mobile Apps Development",
                    items: [
                        { icon: "📱", label: "Mobile Apps",           href: "mobile-apps.html", desc: "iOS, Android & cross-platform" },
                        { icon: "🤖", label: "Android App Development", href: "mobile-android-app-development.html", desc: "Native Android applications" },
                        { icon: "🍎", label: "iOS App Development",    href: "mobile-ios-app-development.html", desc: "Native iPhone & iPad apps" },
                        { icon: "🪶", label: "Flutter Development",   href: "flutter-app-development.html", desc: "Single codebase, native performance" },
                        { icon: "🌐", label: "PWA Development",        href: "mobile-pwa-development.html", desc: "Progressive Web Apps" },
                        { icon: "⌚", label: "Wearable App Development", href: "mobile-wearable-app-development.html", desc: "Apple Watch & Wear OS" },
                        { icon: "🔄", label: "Cross-Platform App Dev", href: "mobile-cross-platform-app-development.html", desc: "React Native & Flutter" },
                        { icon: "🎮", label: "Mobile Game Development", href: "mobile-mobile-game-development.html", desc: "Unity & 2D/3D games" },
                        { icon: "⚡", label: "Native Mobile App Dev",   href: "mobile-native-mobile-app-development.html", desc: "High-performance native code" },
                        { icon: "📐", label: "App Prototype & Strategy", href: "mobile-app-prototype-strategy.html", desc: "UI/UX & technical scoping" },
                    ]
                },
                {
                    heading: "AI Development",
                    items: [
                        { icon: "⚙️", label: "AI Automation",         href: "ai-automation.html", desc: "LLMs, RAG & intelligent workflows" },
                        { icon: "🤖", label: "AI Agents & Chatbots",  href: "ai-agents.html", desc: "LangChain & autonomous agents" },
                        { icon: "🎙️", label: "AI Voice Agents",      href: "ai-voice-agents.html", desc: "Inbound/outbound voice AI" },
                        { icon: "🔄", label: "Workflow Automation",   href: "workflow-automation.html", desc: "n8n, Zapier, Make" },
                        { icon: "⚡", label: "AI Development",        href: "ai-automation-development.html", desc: "Custom AI systems for MSMEs" },
                    ]
                },
                {
                    heading: "Cloud Development",
                    items: [
                        { icon: "☁️", label: "Cloud & DevOps",        href: "cloud-devops.html", desc: "AWS, Azure, GCP migration" },
                    ]
                },
                {
                    heading: "Cybersecurity",
                    items: [
                        { icon: "🔒", label: "Cybersecurity",         href: "cybersecurity.html", desc: "Compliance, audits & zero-trust" },
                    ]
                },
                {
                    heading: "Design & Branding",
                    items: [
                        { icon: "🎨", label: "UI/UX Design",          href: "ui-ux-design.html", desc: "Figma, prototypes & branding" },
                        { icon: "🎬", label: "Motion & Video",        href: "motion-video.html", desc: "Animations & explainers" },
                    ]
                },
                {
                    heading: "Growth Marketing",
                    items: [
                        { icon: "📈", label: "Digital Marketing",     href: "digital-marketing.html", desc: "SEO, PPC & social media" },
                        { icon: "📊", label: "Data & Analytics",      href: "data-analytics.html", desc: "Pipelines, dashboards & BI" },
                        { icon: "🕸️", label: "Lead Gen & Scraping",  href: "lead-gen-scraping.html", desc: "Automated CRM population" },
                    ]
                },
                {
                    heading: "Dedicated Teams",
                    items: [
                        { icon: "👥", label: "Hire Dedicated Developers", href: "hire-dedicated-developers.html", desc: "Scale your engineering team" },
                    ]
                }
            ]
        },

        solutions: {
            layout: "2-column",
            featured: {
                title: "Tailored for Your Scale",
                desc: "Solutions mapped directly to your organization's maturity.",
                ctaLabel: "Find Your Solution →",
                ctaHref: "solutions.html"
            },
            groups: [
                {
                    heading: "By Business Size",
                    items: [
                        { icon: "🚀", label: "Startups",               href: "startups.html",   desc: "Speed to MVP, cost transparency" },
                        { icon: "🏪", label: "MSMEs",                  href: "msmes.html",      desc: "Ready-made apps, affordability" },
                        { icon: "📈", label: "SMB",                    href: "smb.html",        desc: "Scaling, automation, integration" },
                        { icon: "🏢", label: "Enterprise",             href: "enterprise.html", desc: "Compliance, process rigor, security" },
                    ]
                }
            ]
        },

        industries: {
            layout: "3-column",
            featured: {
                title: "Domain-Specific Expertise",
                desc: "We build secure, compliant systems tailored to industry standards.",
                ctaLabel: "See Case Studies →",
                ctaHref: "clients.html"
            },
            groups: [
                {
                    heading: "FinTech & Banking",
                    items: [
                        { icon: "💳", label: "Payment Gateways",             href: "industries.html", desc: "Secure transaction processing" },
                        { icon: "🪪", label: "KYC & Onboarding Systems",     href: "industries.html", desc: "Identity verification workflows" },
                        { icon: "🛡️", label: "Fraud Detection Engines",      href: "industries.html", desc: "Real-time anomaly detection" },
                        { icon: "🏦", label: "Loan Management Systems",      href: "industries.html", desc: "Origination to servicing" },
                        { icon: "📋", label: "Compliance & Reporting",        href: "industries.html", desc: "Regulatory dashboards & audit trails" },
                    ]
                },
                {
                    heading: "Healthcare",
                    items: [
                        { icon: "🏥", label: "Electronic Health Records",    href: "industries.html", desc: "Patient data management (EHR)" },
                        { icon: "📅", label: "Appointment Scheduling",       href: "industries.html", desc: "Booking & calendar systems" },
                        { icon: "🩺", label: "Telemedicine Platforms",        href: "industries.html", desc: "Remote consultation & video visits" },
                        { icon: "🔐", label: "HIPAA-Compliant Data Systems", href: "industries.html", desc: "Secure health data storage" },
                        { icon: "🧾", label: "Medical Billing & Claims",     href: "industries.html", desc: "Insurance claims processing" },
                    ]
                },
                {
                    heading: "E-Commerce & Retail",
                    items: [
                        { icon: "🛒", label: "Storefront & Checkout",        href: "industries.html", desc: "Cart, payment & order flow" },
                        { icon: "📦", label: "Inventory Management",         href: "industries.html", desc: "Stock tracking & replenishment" },
                        { icon: "🚚", label: "Order Fulfillment",            href: "industries.html", desc: "Picking, packing & shipping" },
                        { icon: "⭐", label: "Loyalty & Rewards Platforms",  href: "industries.html", desc: "Customer retention programs" },
                        { icon: "🏷️", label: "Product Information (PIM)",    href: "industries.html", desc: "Catalog & attribute management" },
                    ]
                },
                {
                    heading: "Logistics & Supply Chain",
                    items: [
                        { icon: "🚛", label: "Fleet Tracking & Telematics",  href: "industries.html", desc: "Real-time vehicle monitoring" },
                        { icon: "🗺️", label: "Route Optimization",           href: "industries.html", desc: "Shortest path & fuel savings" },
                        { icon: "🏭", label: "Warehouse Management (WMS)",   href: "industries.html", desc: "Storage & pick/pack systems" },
                        { icon: "📍", label: "Last-Mile Delivery Tracking",  href: "industries.html", desc: "Live delivery status & ETA" },
                    ]
                },
                {
                    heading: "EdTech & Learning",
                    items: [
                        { icon: "🎓", label: "Learning Management (LMS)",    href: "industries.html", desc: "Course delivery & tracking" },
                        { icon: "👩‍🎓", label: "Student & Learner Portals",    href: "industries.html", desc: "Dashboards & progress views" },
                        { icon: "🧠", label: "Adaptive Learning Engines",    href: "industries.html", desc: "Personalized learning paths" },
                        { icon: "📝", label: "Assessment & Certification",   href: "industries.html", desc: "Exams, grading & credentials" },
                    ]
                },
                {
                    heading: "Real Estate & PropTech",
                    items: [
                        { icon: "🏠", label: "Property Listing & CRM",       href: "industries.html", desc: "Lead & deal management" },
                        { icon: "🔭", label: "Virtual Tour Platforms",        href: "industries.html", desc: "360° property walkthroughs" },
                        { icon: "📄", label: "Lease & Tenant Management",    href: "industries.html", desc: "Contracts & rent tracking" },
                        { icon: "📐", label: "Plot & Inventory Tracking",    href: "industries.html", desc: "Land records & availability maps" },
                    ]
                },
                {
                    heading: "Media & Entertainment",
                    items: [
                        { icon: "📺", label: "Streaming & CMS Platforms",    href: "industries.html", desc: "Video delivery & content mgmt" },
                        { icon: "🔑", label: "Subscription & Paywall",       href: "industries.html", desc: "Membership & gated content" },
                        { icon: "💬", label: "Fan Engagement Tools",          href: "industries.html", desc: "Community & social features" },
                        { icon: "©️", label: "Digital Rights Management",     href: "industries.html", desc: "Content protection & licensing" },
                        { icon: "📢", label: "Ad Serving & Monetization",    href: "industries.html", desc: "Programmatic ad platforms" },
                    ]
                },
                {
                    heading: "Travel & Tourism",
                    items: [
                        { icon: "✈️", label: "Booking & Reservation",        href: "industries.html", desc: "Flights, hotels & packages" },
                        { icon: "🗓️", label: "Itinerary Planning Tools",     href: "industries.html", desc: "Trip builder & scheduling" },
                        { icon: "🔗", label: "Channel Management (OTA)",     href: "industries.html", desc: "Multi-platform distribution" },
                        { icon: "💰", label: "Dynamic Pricing Systems",       href: "industries.html", desc: "Demand-based rate optimization" },
                    ]
                }
            ]
        },
        company: {
            layout: "3-column",
            featured: {
                title: "Built for the Future",
                desc: "We are engineers and product strategists redefining how software is built.",
                ctaLabel: "Meet the Team →",
                ctaHref: "about.html"
            },
            groups: [
                {
                    heading: "Company",
                    items: [
                        { icon: "ℹ️", label: "About Us", href: "about.html", desc: "Our story & mission" },
                        { icon: "👥", label: "Our Team", href: "team.html", desc: "Meet our leadership" },
                        { icon: "💼", label: "Career", href: "careers.html", desc: "Join our growing team" },
                        { icon: "📞", label: "Contact Us", href: "contact.html", desc: "Get in touch" },
                        { icon: "💡", label: "Our Purpose", href: "our-purpose.html", desc: "Our mission & vision" }
                    ]
                },
                {
                    heading: "Why Trai",
                    items: [
                        { icon: "⭐", label: "Client Reviews", href: "client-reviews.html", desc: "What our clients say" },
                        { icon: "🤝", label: "Our Clients", href: "clients.html", desc: "Organizations we work with" }
                    ]
                },
                {
                    heading: "Our Process",
                    items: [
                        { icon: "🔄", label: "Our Development Process", href: "our-development-process.html", desc: "AI-native workflow" },
                        { icon: "📋", label: "Engagement Models", href: "engagement-models.html", desc: "Ways we work together" },
                        { icon: "💬", label: "Project Communication Strategy", href: "project-communication-strategy.html", desc: "How we keep you updated" },
                        { icon: "✅", label: "Hiring Checklist", href: "choosing-a-development-partner.html", desc: "What to check before you hire" }
                    ]
                },
                {
                    heading: "Partner With Us",
                    items: [
                        { icon: "🤝", label: "Partner With Us", href: "partner.html", desc: "Reseller & agency programs" }
                    ]
                }
            ]
        },

        case_studies: {
            layout: "2-column",
            featured: {
                title: "Real Results",
                desc: "Explore how we've helped organizations transform their operations and build scalable software.",
                ctaLabel: "View All Work →",
                ctaHref: "clients.html"
            },
            groups: [
                {
                    heading: "Our Work",
                    items: [
                        { icon: "📋", label: "Case Studies", href: "clients.html", desc: "Real results for real businesses" },
                        { icon: "📦", label: "App Store", href: "app-store.html", desc: "Own your app outright" }
                    ]
                }
            ]
        }
    };

    // ── Build generalized mega-menu ───────────────────────────────────────
    function buildMegaMenu(menuId, data) {
        let sidebarHTML = '';
        let panesHTML = '';

        if (data.layout === "3-column") {
            const accordionHTML = data.groups.map((group, idx) => {
                const gridClass = group.items.length >= 4 ? 'tech-pane-grid grid-cols-2' : 'tech-pane-grid grid-cols-1';
                return `
                <div class="tech-cat-btn ${idx === 0 ? 'active' : ''}" data-target="${menuId}-pane-${idx}">
                    ${group.heading}
                    <svg viewBox="0 0 10 6" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>
                </div>
                <div class="tech-pane ${idx === 0 ? 'active' : ''}" id="${menuId}-pane-${idx}">
                    <div class="${gridClass}">
                        ${group.items.map(item => `
                            <a href="${item.href}" class="tech-item-link">
                                <strong><span class="inline-icon">${item.icon}</span> ${item.label}</strong>
                                <span>${item.desc}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
                `;
            }).join('');

            return `
                <div class="mega-dropdown mega-${menuId} layout-3-col">
                    <div class="mega-inner-generalized">
                        <div class="tech-accordion">
                            ${accordionHTML}
                        </div>
                        <div class="tech-featured">
                            <div class="tech-featured-box">
                                <h3>${data.featured.title}</h3>
                                <p>${data.featured.desc}</p>
                                <a href="${data.featured.ctaHref}" class="tech-featured-cta">${data.featured.ctaLabel}</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 2-column layout (no sidebar, just panes in a grid + featured panel)
            panesHTML = data.groups.map((group, idx) => {
                const gridClass = group.items.length >= 4 ? 'tech-pane-grid grid-cols-2' : 'tech-pane-grid grid-cols-1';
                return `
                <div class="mega-group">
                    <h3 class="mega-group-heading">${group.heading}</h3>
                    <div class="${gridClass}">
                        ${group.items.map(item => `
                            <a href="${item.href}" class="tech-item-link">
                                <strong><span class="inline-icon">${item.icon}</span> ${item.label}</strong>
                                <span>${item.desc}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
            }).join('');

            return `
                <div class="mega-dropdown mega-${menuId} layout-2-col">
                    <div class="mega-inner-generalized">
                        <div class="tech-panes-container two-col-panes">
                            ${panesHTML}
                        </div>
                        <div class="tech-featured">
                            <div class="tech-featured-box">
                                <h3>${data.featured.title}</h3>
                                <p>${data.featured.desc}</p>
                                <a href="${data.featured.ctaHref}" class="tech-featured-cta">${data.featured.ctaLabel}</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // ── Chevron SVG ──────────────────────────────────────────────────────────
    const chevron = `<svg class="chevron" viewBox="0 0 10 6" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;

    // ── SVG Icons for footer socials ─────────────────────────────────────────
    const socialIcons = {
        linkedin: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        twitter: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        instagram: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
        youtube: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
        whatsapp: `<svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.744 3.048 9.38L1.054 31.2l6.044-1.94a15.9 15.9 0 008.906 2.704C24.826 31.964 32 24.788 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.958 2.042-3.212 2.312-.86.182-1.98.328-5.754-1.236-4.83-2.004-7.938-6.902-8.18-7.222-.232-.32-1.948-2.596-1.948-4.952s1.232-3.508 1.67-3.988c.438-.48.956-.6 1.276-.6.32 0 .636.004.914.016.294.014.688-.112 1.076.82.396.952 1.348 3.288 1.466 3.528.118.24.198.518.04.836-.16.32-.24.518-.478.8-.24.28-.504.626-.72.84-.24.24-.488.498-.21.976.28.48 1.244 2.054 2.672 3.328 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.278-.32 1.196-1.392 1.514-1.872.318-.48.636-.396 1.076-.24.438.16 2.784 1.312 3.262 1.552.48.24.798.356.916.556.118.198.118 1.156-.278 2.272z"/></svg>`
    };

    // ── Inject full nav ──────────────────────────────────────────────────────
    async function buildNav() {
        const page = document.body.getAttribute('data-page') || '';
        
        let techHTML = '';
        try {
            const techRes = await fetch('data/technologies.json');
            if (techRes.ok) {
                const techData = await techRes.json();
                
                const techMegaData = {
                    layout: "3-column",
                    featured: {
                        title: "AI-First for Modern Businesses",
                        desc: "Build scalable, intelligent systems tailored to your workflows.",
                        ctaLabel: "Explore Solutions →",
                        ctaHref: "solutions.html"
                    },
                    groups: [
                        { heading: "Frontend & Mobile", cats: ['frontend', 'mobile'] },
                        { heading: "Backend & Databases", cats: ['backend', 'database'] },
                        { heading: "AI & Automation", cats: ['ai-llms'] },
                        { heading: "Cloud & DevOps", cats: ['cloud-devops'] },
                        { heading: "CMS & E-Commerce", cats: ['cms'] }
                    ].map(col => {
                        const items = [];
                        col.cats.forEach(catId => {
                            const cat = techData.categories.find(c => c.id === catId);
                            if (cat) {
                                cat.technologies.forEach(tech => {
                                    items.push({
                                        icon: tech.icon || "💻",
                                        label: tech.name,
                                        href: `tech-${tech.id}.html`,
                                        desc: tech.description
                                    });
                                });
                            }
                        });
                        return { heading: col.heading, items: items };
                    })
                };
                navData.tech = techMegaData;
                techHTML = buildMegaMenu('tech', techMegaData);
            }
        } catch (e) {
            console.error("Failed to load technologies for nav", e);
        }

        const navHTML = `
            <div class="nav-container">
                <a href="index.html" class="logo">TRAI</a>
                <ul class="nav-links" id="nav-links">
                    <li class="has-dropdown">
                        <a href="about.html" class="${['about','team','careers','contact','our-purpose','client-reviews','clients','our-development-process','engagement-models','project-communication-strategy','partner'].includes(page)?'active':''}">Who We Are ${chevron}</a>
                        ${buildMegaMenu('company', navData.company)}
                    </li>
                    <li class="has-dropdown">
                        <a href="solutions.html" class="${['solutions','custom-software','web-development','ai-automation','ai-agents','ai-voice-agents','cloud-devops','cybersecurity','data-analytics','digital-marketing','enterprise-platforms','lead-gen-scraping','mobile-apps','motion-video','ui-ux-design','workflow-automation','flutter-app-development','ecommerce-development','custom-crm-development','wordpress-cms-development','ai-automation-development'].includes(page)?'active':''}">Services ${chevron}</a>
                        ${buildMegaMenu('services', navData.services)}
                    </li>
                    <li class="has-dropdown">
                        <a href="#" class="${['startups','msmes','smb','enterprise'].includes(page)?'active':''}">Solutions ${chevron}</a>
                        ${buildMegaMenu('solutions', navData.solutions)}
                    </li>
                    <li class="has-dropdown">
                        <a href="industries.html" class="${page==='industries'?'active':''}">Industries ${chevron}</a>
                        ${buildMegaMenu('industries', navData.industries)}
                    </li>
                    <li class="has-dropdown">
                        <a href="#" class="${page.startsWith('tech-')?'active':''}">Technologies ${chevron}</a>
                        ${techHTML}
                    </li>
                    <li class="has-dropdown">
                        <a href="clients.html" class="${['clients','app-store','choosing-a-development-partner'].includes(page)?'active':''}">Case Studies ${chevron}</a>
                        ${buildMegaMenu('case_studies', navData.case_studies)}
                    </li>
                </ul>
                <div class="nav-actions">
                    <button class="full-menu-btn hide-on-mobile" id="full-menu-btn" aria-label="Open Full Menu">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
                        <span class="full-menu-label">Menu</span>
                    </button>
                    <!-- Theme Toggle Switch -->
                    <div class="theme-toggle-wrap" id="theme-toggle-wrap">
                        <span class="theme-tooltip" id="theme-tooltip">Switch to Light Mode</span>
                        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                            <span class="theme-toggle-track">
                                <span class="theme-toggle-thumb">
                                    <!-- Sun icon -->
                                    <svg class="icon-sun" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 17a5 5 0 100-10 5 5 0 000 10zm0-12a1 1 0 001-1V3a1 1 0 00-2 0v1a1 1 0 001 1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm8-7a1 1 0 000-2h-1a1 1 0 000 2h1zM5 12a1 1 0 00-1-1H3a1 1 0 000 2h1a1 1 0 001-1zm11.95-6.364a1 1 0 000-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM7.757 17.657a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zm9.9 1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zM7.05 7.05a1 1 0 000-1.414l-.707-.707A1 1 0 004.93 6.343l.707.707A1 1 0 007.05 7.05z"/></svg>
                                    <!-- Moon icon -->
                                    <svg class="icon-moon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
                                </span>
                            </span>
                        </button>
                    </div>
                    <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary">Let's Talk</a>
                    <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu">&#9776;</button>
                </div>
            </div>

            <div id="full-menu-overlay" class="full-menu-overlay">
                <div class="full-menu-header">
                    <a href="index.html" class="logo">TRAI</a>
                    <button class="full-menu-close" id="full-menu-close" aria-label="Close menu">✕</button>
                </div>
                <div class="full-menu-body">
                    <div class="fm-col fm-level1" id="fm-level1"></div>
                    <div class="fm-col fm-level2" id="fm-level2"></div>
                    <div class="fm-col fm-level3" id="fm-level3"></div>
                </div>
            </div>
        `;

        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = navHTML;
            // Scroll effect
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 20);
            });
        }

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

        // ── Tech Flyout Hover Logic ──
        const catBtns = document.querySelectorAll('.tech-cat-btn');
        const panes = document.querySelectorAll('.tech-pane');
        catBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                catBtns.forEach(b => b.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.target).classList.add('active');
            });
            // Support click for mobile/touch
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                catBtns.forEach(b => b.classList.remove('active'));
                panes.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.target).classList.add('active');
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
        // ── Theme Toggle Logic ──────────────────────────────────────────────
        function applyTheme(isLight) {
            document.body.classList.toggle('light-mode', isLight);
            const tooltip = document.getElementById('theme-tooltip');
            const toggle  = document.getElementById('theme-toggle');
            if (tooltip) tooltip.textContent = isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode';
            if (toggle)  toggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
            if (toggle)  toggle.classList.toggle('is-light', isLight);
        }

        // Init from localStorage
        const savedTheme = localStorage.getItem('trai-theme');
        applyTheme(savedTheme === 'light');

        // Click handler
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const nowLight = !document.body.classList.contains('light-mode');
                applyTheme(nowLight);
                localStorage.setItem('trai-theme', nowLight ? 'light' : 'dark');
            });
        }

        // ── Full Menu Overlay Logic ─────────────────────────────────────────
        const fullMenuBtn = document.getElementById('full-menu-btn');
        const fullMenuOverlay = document.getElementById('full-menu-overlay');
        const fullMenuClose = document.getElementById('full-menu-close');
        const col1 = document.getElementById('fm-level1');
        const col2 = document.getElementById('fm-level2');
        const col3 = document.getElementById('fm-level3');

        if (fullMenuBtn && fullMenuOverlay) {
            const l1Items = [
                { id: 'company', label: 'Who We Are' },
                { id: 'services', label: 'Services' },
                { id: 'solutions', label: 'Solutions' },
                { id: 'industries', label: 'Industries' },
                { id: 'tech', label: 'Technologies' },
                { id: 'case_studies', label: 'Case Studies' }
            ];

            let activeL1 = 'company';
            let activeL2 = 0;

            function renderFullMenu() {
                // Column 1
                col1.innerHTML = l1Items.map(item => 
                    `<button class="fm-l1-btn ${activeL1 === item.id ? 'active' : ''}" data-id="${item.id}">
                        ${item.label}
                        <span class="fm-arrow">→</span>
                    </button>`
                ).join('');

                // Column 2
                const dataL1 = navData[activeL1];
                if (dataL1 && dataL1.groups) {
                    col2.innerHTML = dataL1.groups.map((group, idx) => 
                        `<button class="fm-l2-btn ${activeL2 === idx ? 'active' : ''}" data-idx="${idx}">
                            ${group.heading}
                            <span class="fm-arrow">→</span>
                        </button>`
                    ).join('');
                } else {
                    col2.innerHTML = '';
                }

                // Column 3
                if (dataL1 && dataL1.groups && dataL1.groups[activeL2]) {
                    const group = dataL1.groups[activeL2];
                    col3.innerHTML = group.items.map(item => 
                        `<a href="${item.href}" class="fm-l3-link">
                            <span class="fm-l3-icon">${item.icon}</span>
                            <div class="fm-l3-text">
                                <span class="fm-l3-label">${item.label}</span>
                                <span class="fm-l3-desc">${item.desc}</span>
                            </div>
                        </a>`
                    ).join('');
                } else {
                    col3.innerHTML = '';
                }
            }

            fullMenuBtn.addEventListener('click', () => {
                fullMenuOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                activeL1 = 'company';
                activeL2 = 0;
                renderFullMenu();
            });

            fullMenuClose.addEventListener('click', () => {
                fullMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });

            fullMenuOverlay.addEventListener('click', (e) => {
                const l1Btn = e.target.closest('.fm-l1-btn');
                if (l1Btn) {
                    activeL1 = l1Btn.dataset.id;
                    activeL2 = 0;
                    renderFullMenu();
                }

                const l2Btn = e.target.closest('.fm-l2-btn');
                if (l2Btn) {
                    activeL2 = parseInt(l2Btn.dataset.idx);
                    renderFullMenu();
                }
            });
        }

        // ── Bot Detection for SEO ─────────────────────────────────────────
        if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
            document.documentElement.classList.add('bot-detected');
        }

        // ── Footer Builder (5-column sitemap) ─────────────────────────────
        const footerEl = document.getElementById('footer');
        if (footerEl) {
            footerEl.innerHTML = `
        <div class="container footer-top">
            <div class="footer-brand">
                <a href="index.html" class="footer-logo-wrap" aria-label="Trai Inc Services home">
                    <span class="footer-logo-pulse"></span>
                    <img src="assets/logos/logo.png" alt="Trai Inc Services" class="footer-logo-img">
                </a>
                <div class="footer-brand-name">Trai Inc Services</div>
                <p class="footer-tagline">AI-native software engineering — delivering custom software, mobile apps, and automation systems for businesses across India.</p>
                <div class="footer-contact">
                    <a href="tel:+917905495478" class="contact-link">📞 +91 79054 95478</a><br>
                    <a href="mailto:hello@traiinc.com" class="contact-link">✉️ hello@traiinc.com</a>
                </div>
                <div class="footer-social">
                    <a href="https://www.linkedin.com/company/trai-inc" target="_blank" rel="noopener" class="social-icon" aria-label="LinkedIn">${socialIcons.linkedin}</a>
                    <a href="https://x.com/inctrai" target="_blank" rel="noopener" class="social-icon" aria-label="Twitter / X">${socialIcons.twitter}</a>
                    <a href="https://www.instagram.com/traiinc" target="_blank" rel="noopener" class="social-icon" aria-label="Instagram">${socialIcons.instagram}</a>
                    <a href="https://www.youtube.com/@traiinc" target="_blank" rel="noopener" class="social-icon" aria-label="YouTube">${socialIcons.youtube}</a>
                    <a href="https://wa.me/917905495478" target="_blank" rel="noopener" class="social-icon social-wa" aria-label="WhatsApp">${socialIcons.whatsapp}</a>
                </div>
            </div>
            <div class="link-group">
                <h4>Services</h4>
                <ul>
                    <li><a href="custom-software.html">Custom Software</a></li>
                    <li><a href="web-development.html">Web Development</a></li>
                    <li><a href="mobile-apps.html">Mobile Apps</a></li>
                    <li><a href="ai-automation.html">AI & Automation</a></li>
                    <li><a href="ai-agents.html">AI Agents</a></li>
                    <li><a href="cloud-devops.html">Cloud & DevOps</a></li>
                    <li><a href="cybersecurity.html">Cybersecurity</a></li>
                    <li><a href="ui-ux-design.html">UI/UX Design</a></li>
                    <li><a href="digital-marketing.html">Digital Marketing</a></li>
                    <li><a href="data-analytics.html">Data & Analytics</a></li>
                </ul>
            </div>
            <div class="link-group">
                <h4>Solutions</h4>
                <ul>
                    <li><a href="startups.html">Startups</a></li>
                    <li><a href="msmes.html">MSMEs</a></li>
                    <li><a href="smb.html">SMB</a></li>
                    <li><a href="enterprise.html">Enterprise</a></li>
                </ul>
                <h4 style="margin-top: 24px;">Company</h4>
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="careers.html">Careers</a></li>
                    <li><a href="incubation.html">Incubation</a></li>
                    <li><a href="partner.html">Partners</a></li>
                    <li><a href="blog.html">Blog</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="link-group">
                <h4>Resources</h4>
                <ul>
                    <li><a href="clients.html">Case Studies</a></li>
                    <li><a href="app-store.html">App Store</a></li>
                    <li><a href="choosing-a-development-partner.html">Trust & Due Diligence</a></li>
                    <li><a href="industries.html">Industries</a></li>
                </ul>
                <h4 style="margin-top: 24px;">Location</h4>
                <p>Tower B-2, 1109, DLF MyPad,<br>Opposite Hyatt Regency, Vibhuti Khand,<br>Gomti Nagar, Lucknow, UP 226010</p>
                <h4 class="footer-hours-heading">Hours</h4>
                <p>Mon–Sat: 10am – 7pm IST<br>Sun: By appointment</p>
            </div>
            <div class="footer-newsletter">
                <h4>Stay in the loop</h4>
                <p>Monthly insights on cloud, AI trends, and engineering best practices.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="Work Email" required>
                    <button type="submit">Subscribe</button>
                </form>
                <div class="footer-badges">
                    <span class="footer-badge">🇮🇳 Made in India</span>
                    <span class="footer-badge">🔒 Fixed-Price Contracts</span>
                    <span class="footer-badge">⚡ AI-Augmented Delivery</span>
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

        // ── WhatsApp Click-to-Chat FAB ────────────────────────────────────
        var whatsappNumber = '917905495478';
        var whatsappMessage = encodeURIComponent('Hi Trai! I am interested in learning more about your services.');
        var whatsappURL = 'https://wa.me/' + whatsappNumber + '?text=' + whatsappMessage;

        var fabLogo = document.createElement('a');
        fabLogo.className = 'fab-logo';
        fabLogo.href = whatsappURL;
        fabLogo.target = '_blank';
        fabLogo.rel = 'noopener noreferrer';
        fabLogo.setAttribute('aria-label', 'Chat with us on WhatsApp');
        fabLogo.innerHTML = '<svg viewBox="0 0 32 32" width="32" height="32" fill="white"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.744 3.048 9.38L1.054 31.2l6.044-1.94a15.9 15.9 0 008.906 2.704C24.826 31.964 32 24.788 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.958 2.042-3.212 2.312-.86.182-1.98.328-5.754-1.236-4.83-2.004-7.938-6.902-8.18-7.222-.232-.32-1.948-2.596-1.948-4.952s1.232-3.508 1.67-3.988c.438-.48.956-.6 1.276-.6.32 0 .636.004.914.016.294.014.688-.112 1.076.82.396.952 1.348 3.288 1.466 3.528.118.24.198.518.04.836-.16.32-.24.518-.478.8-.24.28-.504.626-.72.84-.24.24-.488.498-.21.976.28.48 1.244 2.054 2.672 3.328 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.278-.32 1.196-1.392 1.514-1.872.318-.48.636-.396 1.076-.24.438.16 2.784 1.312 3.262 1.552.48.24.798.356.916.556.118.198.118 1.156-.278 2.272z"/></svg><div class="chat-badge">1</div>';
        document.body.appendChild(fabLogo);

        // Newsletter form handler
        var newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                var btn = newsletterForm.querySelector('button');
                btn.innerHTML = 'Subscribed! ✅';
                btn.style.background = '#28a745';
                setTimeout(function() {
                    btn.innerHTML = 'Subscribe';
                    btn.style.background = '';
                    newsletterForm.reset();
                }, 3000);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildNav);
    } else {
        buildNav();
    }

})();
