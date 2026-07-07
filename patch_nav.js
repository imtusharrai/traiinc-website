const fs = require('fs');
let content = fs.readFileSync('js/nav.js', 'utf8');

const replacement = `    const navData = {
    whoWeHelp: {
        label: "Who We Help",
        featured: {
            title: "138+ Businesses Served",
            desc: "Real Estate, Healthcare, FinTech, and more — across 12+ industries in 6 years.",
            stat: "94% client retention",
            ctaLabel: "See Case Studies →",
            ctaHref: "clients.html"
        },
        cols: [
            {
                heading: "By Business Size",
                items: [
                    { icon: icon3d("🏪","#96fbc4","#f9f586"), label: "MSMEs & Local Business", href: "msmes.html", desc: "Websites, WhatsApp, SEO from ₹15K" },
                    { icon: icon3d("🚀","#4facfe","#00f2fe"), label: "Startups", href: "startups.html", desc: "MVPs, cloud, go-to-market" },
                    { icon: icon3d("🏢","#a1c4fd","#c2e9fb"), label: "Small & Medium Business", href: "smb.html", desc: "CRMs, automation, scaling" },
                    { icon: icon3d("🏗️","#fbc7d4","#9796f0"), label: "Enterprise", href: "enterprise.html", desc: "Cloud migration, AI, security" }
                ]
            },
            {
                heading: "By Industry",
                items: [
                    { icon: icon3d("🏠","#f6d365","#fda085"), label: "Real Estate & PropTech", href: "industries.html#real-estate", desc: "CRM, listings, virtual tours" },
                    { icon: icon3d("🏥","#f093fb","#f5576c"), label: "Healthcare", href: "industries.html#healthcare", desc: "Patient portals, compliance" },
                    { icon: icon3d("💰","#4facfe","#00f2fe"), label: "FinTech & Banking", href: "industries.html#fintech", desc: "Payments & compliance" },
                    { icon: icon3d("🛒","#30cfd0","#667eea"), label: "E-Commerce & Retail", href: "industries.html#ecommerce", desc: "Storefronts & fulfillment" },
                    { icon: icon3d("🎓","#fa709a","#fee140"), label: "Education & EdTech", href: "industries.html#education", desc: "LMS, virtual classrooms" },
                    { icon: icon3d("🍽️","#ffecd2","#fcb69f"), label: "Food & Restaurant", href: "industries.html#food", desc: "Ordering & POS" }
                ]
            }
        ]
    },

    services: {
        label: "Services",
        featured: {
            title: "Full-Stack Excellence",
            desc: "End-to-end engineering from MVP to enterprise scale.",
            stat: "10x faster execution",
            ctaLabel: "View All Services →",
            ctaHref: "solutions.html"
        },
        cols: [
            {
                heading: "Engineering",
                items: [
                    { icon: icon3d("💻","#4facfe","#00f2fe"), label: "Custom Software & Web", href: "custom-software.html", desc: "Web apps, SaaS, enterprise tools" },
                    { icon: icon3d("📱","#43e97b","#38f9d7"), label: "Mobile App Development", href: "mobile-apps.html", desc: "iOS, Android, cross-platform" },
                    { icon: icon3d("🤖","#f093fb","#f5576c"), label: "AI & Automation", href: "ai-automation.html", desc: "Chatbots, agents, workflows" },
                    { icon: icon3d("☁️","#667eea","#764ba2"), label: "Cloud & DevOps", href: "cloud-devops.html", desc: "AWS, Cloudflare, CI/CD" }
                ]
            },
            {
                heading: "Growth & Platforms",
                items: [
                    { icon: icon3d("📈","#96fbc4","#f9f586"), label: "Digital Marketing & SEO", href: "digital-marketing.html", desc: "Google Ads, Meta, local SEO" },
                    { icon: icon3d("⚙️","#ffecd2","#fcb69f"), label: "CRM & Enterprise Platforms", href: "enterprise-platforms.html", desc: "Custom CRM, ERP, dashboards" },
                    { icon: icon3d("👥","#a1c4fd","#c2e9fb"), label: "Dedicated Developers", href: "hire-dedicated-developers.html", desc: "Augment your engineering team" }
                ]
            }
        ]
    },

    work: {
        label: "Our Work",
        featured: {
            title: "Proven Results",
            desc: "See how we help businesses scale with data-driven engineering.",
            stat: "₹4.5L+ Revenue Generated",
            ctaLabel: "Book a Free Consultation →",
            ctaHref: "contact.html"
        },
        cols: [
            {
                heading: "Proof",
                items: [
                    { icon: icon3d("📊","#4facfe","#00f2fe"), label: "Case Studies", href: "clients.html", desc: "Real results for real businesses" },
                    { icon: icon3d("⭐","#f6d365","#fda085"), label: "Client Reviews", href: "client-reviews.html", desc: "What our clients say" }
                ]
            },
            {
                heading: "How We Operate",
                items: [
                    { icon: icon3d("💰","#96fbc4","#f9f586"), label: "Pricing & Engagement", href: "pricing.html", desc: "Fixed price, advance-first" },
                    { icon: icon3d("⚡","#30cfd0","#667eea"), label: "Development Process", href: "our-development-process.html", desc: "AI-native workflow" }
                ]
            }
        ]
    },

    company: {
        label: "Company",
        featured: {
            title: "Join the Mission",
            desc: "We are building the future of software development.",
            stat: "Zero bloat, 100% execution",
            ctaLabel: "Meet the Team →",
            ctaHref: "about.html"
        },
        cols: [
            {
                heading: "About",
                items: [
                    { icon: icon3d("🏢","#667eea","#764ba2"), label: "About Us", href: "about.html", desc: "Our story & mission" },
                    { icon: icon3d("💼","#4facfe","#00f2fe"), label: "Careers", href: "careers.html", desc: "Join the team" },
                    { icon: icon3d("🤝","#43e97b","#38f9d7"), label: "Partner With Us", href: "partner.html", desc: "Referral & white-label" },
                    { icon: icon3d("🚀","#fbc7d4","#9796f0"), label: "Incubation Program", href: "incubation.html", desc: "Intern mentorship" }
                ]
            },
            {
                heading: "Programs & Contact",
                items: [
                    { icon: icon3d("🚀","#4facfe","#00f2fe"), label: "Bharat Startup Launchpad ↗", href: "https://bharatstartuplaunchpad.com", desc: "Startup grants & funding support", external: true },
                    { icon: icon3d("📞","#f6d365","#fda085"), label: "Contact Us", href: "contact.html", desc: "Book a consultation" }
                ]
            }
        ]
    }
};

    // ── Build generalized mega-menu ───────────────────────────────────────
    function buildMegaMenu(menuId, data) {
        const panesHTML = data.cols.map((col) => {
            const gridClass = col.items.length >= 4 ? 'tech-pane-grid grid-cols-2' : 'tech-pane-grid grid-cols-1';
            return \`
            <div class="mega-group">
                <h3 class="mega-group-heading">\${col.heading} <sup>\${col.items.length}</sup></h3>
                <div class="\${gridClass}">
                    \${col.items.map(item => {
                        const targetAttr = item.external ? 'target="_blank" rel="noopener"' : '';
                        return \\\`
                        <a href="\${item.href}" class="tech-item-link" \${targetAttr}>
                            <strong><span class="inline-icon">\${item.icon}</span> \${item.label}</strong>
                            <span>\${item.desc}</span>
                        </a>
                        \\\`;
                    }).join('')}
                </div>
            </div>
        \`;
        }).join('');

        const featuredHTML = data.featured ? \`
            <div class="mega-featured" style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 24px;">
                <h3 class="mega-group-heading" style="margin-top:0;">Featured</h3>
                <div class="featured-card">
                    <h4 style="margin: 0 0 8px 0; font-size: 1.1rem; color: var(--text-primary);">\${data.featured.title}</h4>
                    <p style="margin: 0 0 16px 0; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.4;">\${data.featured.desc}</p>
                    <div class="featured-stat" style="font-weight: 600; color: var(--primary-color); margin-bottom: 16px;">\${data.featured.stat}</div>
                    <a href="\${data.featured.ctaHref}" class="tech-featured-cta" style="display:inline-block;">\${data.featured.ctaLabel}</a>
                </div>
            </div>
        \` : '';

        return \`
            <div class="mega-dropdown mega-\${menuId}">
                <div class="mega-inner-generalized" style="display:flex; justify-content: space-between; gap: 40px; padding: 24px;">
                    <div class="tech-panes-container" style="flex: 1; display: flex; gap: 40px; border-right: 1px solid var(--border-color); padding-right: 40px;">
                        \${panesHTML}
                    </div>
                    <div class="mega-featured-container" style="width: 320px; flex-shrink: 0;">
                        \${featuredHTML}
                    </div>
                </div>
            </div>
        \`;
    }`;

content = content.replace(/const navData = \{[\s\S]*?\}\n    }/, replacement);
fs.writeFileSync('js/nav.js', content);
