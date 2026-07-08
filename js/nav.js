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

    // ══════════════════════════════════════════════════════════════════════
    // NAV DATA
    // ══════════════════════════════════════════════════════════════════════
    const navData = {
        whoWeHelp: {
            label: "Industries",
            type: "flat",
            cols: [
                {
                    heading: "By Business Size",
                    items: [
                        { icon: "🏪", label: "MSMEs & Local Business", href: "msmes.html", desc: "Websites, WhatsApp from ₹15K" },
                        { icon: "🚀", label: "Startups", href: "startups.html", desc: "MVPs, cloud, go-to-market" },
                        { icon: "🏢", label: "Small & Medium Business", href: "smb.html", desc: "CRMs, automation, scaling" },
                        { icon: "🏗️", label: "Enterprise", href: "enterprise.html", desc: "Cloud migration, AI, security" }
                    ]
                },
                {
                    heading: "By Industry",
                    items: [
                        { icon: "🏠", label: "Real Estate & PropTech", href: "industries.html#realestate", desc: "CRM, listings, virtual tours" },
                        { icon: "🏥", label: "Healthcare", href: "industries.html#healthcare", desc: "Patient portals, compliance" },
                        { icon: "💰", label: "FinTech & Banking", href: "industries.html#fintech", desc: "Payments & compliance" },
                        { icon: "🛒", label: "E-Commerce & Retail", href: "industries.html#ecommerce", desc: "Storefronts & fulfillment" },
                        { icon: "🎓", label: "Education & EdTech", href: "industries.html#edtech", desc: "LMS, virtual classrooms" },
                        { icon: "🚚", label: "Logistics & Supply Chain", href: "industries.html#logistics", desc: "Route optimization, tracking" },
                        { icon: "🎬", label: "Media & Entertainment", href: "industries.html#media", desc: "Streaming, content platforms" },
                        { icon: "✈️", label: "Travel & Hospitality", href: "industries.html#travel", desc: "Booking, guest experience" },
                        { icon: "🍽️", label: "Food & Restaurant", href: "industries.html#food", desc: "POS, delivery, ordering" },
                        { icon: "🏭", label: "Manufacturing", href: "industries.html#manufacturing", desc: "ERP, inventory, automation" }
                    ]
                }
            ],
            featured: {
                title: "138+ Businesses Served",
                desc: "Real Estate, Healthcare, FinTech, and more — across 12+ industries.",
                stat: "94% client retention",
                ctaLabel: "See Our Work →",
                ctaHref: "clients.html"
            }
        },

        services: {
            label: "Services",
            type: "layered",
            categories: [
                {
                    id: "custom-software",
                    label: "Custom Software & Web",
                    hasChildren: true,
                    href: "custom-software.html",
                    subitems: [
                        { label: "Web Applications", href: "custom-software.html#web-apps" },
                        { label: "SaaS Platforms", href: "custom-software.html#saas" },
                        { label: "Enterprise Tools", href: "custom-software.html#enterprise" },
                        { label: "API Development", href: "custom-software.html#api" }
                    ],
                    miniFeature: {
                        title: "Full-Stack <span class='highlight'>Excellence</span>",
                        desc: "End-to-end engineering from MVP to enterprise scale.",
                        ctaLabel: "View All Services →",
                        ctaHref: "solutions.html"
                    }
                },
                {
                    id: "mobile-apps",
                    label: "Application Development",
                    hasChildren: true,
                    href: "mobile-apps.html",
                    subitems: [
                        { label: "iOS & Android Native", href: "mobile-apps.html#native" },
                        { label: "Cross-Platform (Flutter)", href: "mobile-apps.html#flutter" },
                        { label: "Desktop Applications", href: "mobile-apps.html#desktop" },
                        { label: "App Store Deployment", href: "mobile-apps.html#deployment" }
                    ],
                    miniFeature: {
                        title: "Smart, Scalable, <span class='highlight'>Secure</span>",
                        desc: "One codebase. Both platforms. Delivered in weeks.",
                        ctaLabel: "Explore Mobile →",
                        ctaHref: "mobile-apps.html"
                    }
                },
                {
                    id: "ai-automation",
                    label: "AI & Automation",
                    hasChildren: true,
                    href: "ai-automation.html",
                    subitems: [
                        { label: "AI Chatbots & Agents", href: "ai-automation.html#chatbots" },
                        { label: "Workflow Automation", href: "ai-automation.html#workflows" },
                        { label: "Voice AI", href: "ai-automation.html#voice" },
                        { label: "LLM Integration", href: "ai-automation.html#llm" }
                    ],
                    miniFeature: {
                        title: "AI-First for <span class='highlight'>Business</span>",
                        desc: "Intelligent solutions that automate and scale.",
                        ctaLabel: "Explore AI →",
                        ctaHref: "ai-automation.html"
                    }
                },
                {
                    id: "cloud-devops",
                    label: "Cloud & DevOps",
                    hasChildren: true,
                    href: "cloud-devops.html",
                    subitems: [
                        { label: "Cloud Migration", href: "cloud-devops.html#migration" },
                        { label: "CI/CD Pipelines", href: "cloud-devops.html#cicd" },
                        { label: "Serverless Architecture", href: "cloud-devops.html#serverless" }
                    ],
                    miniFeature: {
                        title: "Scale Without the <span class='highlight'>Bill</span>",
                        desc: "Modern infrastructure that costs pennies when idle.",
                        ctaLabel: "Explore Cloud →",
                        ctaHref: "cloud-devops.html"
                    }
                },
                {
                    id: "digital-marketing",
                    label: "Digital Marketing & SEO",
                    hasChildren: false,
                    href: "digital-marketing.html",
                    featured: {
                        emoji: "📈",
                        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        title: "Grow Your <span class='highlight'>Reach</span>",
                        desc: "Data-driven marketing that delivers measurable ROI.",
                        ctaLabel: "Explore Marketing →",
                        ctaHref: "digital-marketing.html"
                    }
                },
                {
                    id: "crm-enterprise",
                    label: "CRM & Enterprise Platforms",
                    hasChildren: false,
                    href: "enterprise-platforms.html",
                    featured: {
                        emoji: "⚙️",
                        gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                        title: "Replace <span class='highlight'>Spreadsheets</span>",
                        desc: "Custom CRMs and dashboards tailored to your workflow.",
                        ctaLabel: "Explore CRM →",
                        ctaHref: "enterprise-platforms.html"
                    }
                }
            ]
        },

        work: {
            label: "Case Studies",
            type: "flat",
            cols: [
                {
                    heading: "Proof",
                    items: [
                        { icon: "📊", label: "Case Studies", href: "clients.html", desc: "Real results for real businesses" },
                        { icon: "⭐", label: "Client Reviews", href: "client-reviews.html", desc: "What our clients say" },
                        { icon: "💰", label: "Pricing & Engagement", href: "pricing.html", desc: "Fixed price, advance-first" }
                    ]
                }
            ],
            featured: {
                title: "Proven Results",
                desc: "See how we have helped 138+ businesses transform their operations.",
                stat: "138+ Projects Delivered",
                ctaLabel: "Book a Free Consultation →",
                ctaHref: "https://calendar.app.google/PUsxADQBnpQsTrDbA"
            }
        },

        whoWeAre: {
            label: "Company",
            type: "flat",
            cols: [
                {
                    heading: "About",
                    items: [
                        { icon: "ℹ️", label: "About Us", href: "about.html", desc: "Our story & mission" },
                        { icon: "👥", label: "Our Team", href: "about.html#team", desc: "Meet the leadership" },
                        { icon: "💼", label: "Careers", href: "careers.html", desc: "Join the team" }
                    ]
                },
                {
                    heading: "Programs & Connect",
                    items: [
                        { icon: "🤝", label: "Partner With Us", href: "partner.html", desc: "Referral & white-label" },
                        { icon: "🚀", label: "Bharat Startup Launchpad ↗", href: "https://bharatstartuplaunchpad.com", external: true, desc: "Incubation, grants & funding" },
                        { icon: "📞", label: "Contact Us", href: "contact.html", desc: "Book a consultation" }
                    ]
                }
            ],
            featured: {
                title: "Join the Mission",
                desc: "We are building the future of software development. Zero bloat, 100% execution.",
                stat: "6+ years, 138+ clients",
                ctaLabel: "Meet the Team →",
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
                `<a href="${sub.href}" class="nav-l3-link">${sub.label}</a>`
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
                <a href="index.html" class="logo">TRAI</a>
                <ul class="nav-links" id="nav-links">
                    <li class="has-dropdown">
                        <a href="about.html" class="${['about','careers','partner','incubation','contact'].includes(page)?'active':''}">${navData.whoWeAre.label} ${chevronDown}</a>
                        ${buildDropdown('whoWeAre', navData.whoWeAre)}
                    </li>
                    <li class="has-dropdown">
                        <a href="solutions.html" class="${['ai-automation','mobile-apps','web-development','custom-software','cloud-devops','digital-marketing','enterprise-platforms','hire-dedicated-developers'].includes(page)?'active':''}">${navData.services.label} ${chevronDown}</a>
                        ${buildDropdown('services', navData.services)}
                    </li>
                    <li>
                        <a href="solutions.html" class="${page==='solutions'?'active':''}">Technologies</a>
                    </li>
                    <li class="has-dropdown">
                        <a href="industries.html" class="${['industries','msmes','startups','smb','enterprise'].includes(page)?'active':''}">${navData.whoWeHelp.label} ${chevronDown}</a>
                        ${buildDropdown('whoWeHelp', navData.whoWeHelp)}
                    </li>
                    <li class="has-dropdown">
                        <a href="clients.html" class="${['clients','client-reviews','pricing'].includes(page)?'active':''}">${navData.work.label} ${chevronDown}</a>
                        ${buildDropdown('work', navData.work)}
                    </li>
                </ul>
                <div class="nav-actions">
                    <button class="full-menu-btn hide-on-mobile" id="full-menu-btn" aria-label="Open Full Menu">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/></svg>
                        <span class="full-menu-label">Menu</span>
                    </button>
                    <div class="theme-toggle-wrap" id="theme-toggle-wrap">
                        <span class="theme-tooltip" id="theme-tooltip">Switch to Light Mode</span>
                        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                            <span class="theme-toggle-track">
                                <span class="theme-toggle-thumb">
                                    <svg class="icon-sun" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 17a5 5 0 100-10 5 5 0 000 10zm0-12a1 1 0 001-1V3a1 1 0 00-2 0v1a1 1 0 001 1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1zm8-7a1 1 0 000-2h-1a1 1 0 000 2h1zM5 12a1 1 0 00-1-1H3a1 1 0 000 2h1a1 1 0 001-1zm11.95-6.364a1 1 0 000-1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 0zM7.757 17.657a1 1 0 00-1.414 0l-.707.707a1 1 0 001.414 1.414l.707-.707a1 1 0 000-1.414zm9.9 1.414l-.707-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414-1.414zM7.05 7.05a1 1 0 000-1.414l-.707-.707A1 1 0 004.93 6.343l.707.707A1 1 0 007.05 7.05z"/></svg>
                                    <svg class="icon-moon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"/></svg>
                                </span>
                            </span>
                        </button>
                    </div>
                    <a href="contact.html" class="btn-primary">Get a Quote</a>
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
        applyTheme(savedTheme === 'light');

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
                    <a href="https://wa.me/917905495478?text=Hi%20Trai%20Inc,%20I'm%20looking%20for%20a%20digital%20solution%20for%20my%20business." target="_blank" rel="noopener" class="social-icon social-wa" aria-label="WhatsApp">${socialIcons.whatsapp}</a>
                </div>
            </div>
            <div class="link-group">
                <h4>Services</h4>
                <ul>
                    <li><a href="custom-software.html">Custom Software</a></li>
                    <li><a href="web-development.html">Web Development</a></li>
                    <li><a href="mobile-apps.html">Application Development</a></li>
                    <li><a href="ai-automation.html">AI & Automation</a></li>
                    <li><a href="cloud-devops.html">Cloud & DevOps</a></li>
                    <li><a href="digital-marketing.html">Digital Marketing</a></li>
                    <li><a href="ui-ux-design.html">UI/UX Design</a></li>
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
                <h4 style="margin-top: 24px;">Who We Are</h4>
                <ul>
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="careers.html">Careers</a></li>
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
                    <li><a href="our-development-process.html">How We Work</a></li>
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

        // ── WhatsApp FAB ──
        var whatsappNumber = '917905495478';
        var whatsappMessage = encodeURIComponent("Hi Trai Inc, I'm looking for a digital solution for my business.");
        var whatsappURL = 'https://wa.me/' + whatsappNumber + '?text=' + whatsappMessage;

        var fabLogo = document.createElement('a');
        fabLogo.className = 'fab-logo';
        fabLogo.href = whatsappURL;
        fabLogo.target = '_blank';
        fabLogo.rel = 'noopener noreferrer';
        fabLogo.setAttribute('aria-label', 'Chat with us on WhatsApp');
        fabLogo.innerHTML = '<svg viewBox="0 0 32 32" width="32" height="32" fill="white"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.744 3.048 9.38L1.054 31.2l6.044-1.94a15.9 15.9 0 008.906 2.704C24.826 31.964 32 24.788 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.958 2.042-3.212 2.312-.86.182-1.98.328-5.754-1.236-4.83-2.004-7.938-6.902-8.18-7.222-.232-.32-1.948-2.596-1.948-4.952s1.232-3.508 1.67-3.988c.438-.48.956-.6 1.276-.6.32 0 .636.004.914.016.294.014.688-.112 1.076.82.396.952 1.348 3.288 1.466 3.528.118.24.198.518.04.836-.16.32-.24.518-.478.8-.24.28-.504.626-.72.84-.24.24-.488.498-.21.976.28.48 1.244 2.054 2.672 3.328 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.278-.32 1.196-1.392 1.514-1.872.318-.48.636-.396 1.076-.24.438.16 2.784 1.312 3.262 1.552.48.24.798.356.916.556.118.198.118 1.156-.278 2.272z"/></svg><div class="chat-badge">1</div>';
        document.body.appendChild(fabLogo);

        // ── Newsletter form ──
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
