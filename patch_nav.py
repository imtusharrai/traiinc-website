import re

with open('js/nav.js', 'r') as f:
    content = f.read()

# We need to replace navData's whoWeHelp and services, and add buildThreeLayerMenu

new_whoWeHelp = """whoWeHelp: {
        label: "Who We Help",
        featured: {
            title: "138+ Businesses Served",
            desc: "Real Estate, Healthcare, FinTech, and more — across 12+ industries in 6 years.",
            stat: "94% client retention",
            ctaLabel: "See Case Studies →",
            ctaHref: "clients.html"
        },
        categories: [
            {
                id: "by-size",
                label: "By Business Size",
                icon: "🏢",
                subitems: [
                    { icon: icon3d("🏪","#96fbc4","#f9f586"), label: "MSMEs & Local Business", href: "msmes.html", desc: "Websites, WhatsApp, SEO from ₹15K" },
                    { icon: icon3d("🚀","#4facfe","#00f2fe"), label: "Startups", href: "startups.html", desc: "MVPs, cloud, go-to-market" },
                    { icon: icon3d("🏢","#a1c4fd","#c2e9fb"), label: "Small & Medium Business", href: "smb.html", desc: "CRMs, automation, scaling" },
                    { icon: icon3d("🏗️","#fbc7d4","#9796f0"), label: "Enterprise", href: "enterprise.html", desc: "Cloud migration, AI, security" }
                ]
            },
            {
                id: "by-industry",
                label: "By Industry",
                icon: "📊",
                subitems: [
                    { icon: icon3d("🏠","#f6d365","#fda085"), label: "Real Estate & PropTech", href: "industries.html#realestate", desc: "CRM, listings, virtual tours" },
                    { icon: icon3d("🏥","#f093fb","#f5576c"), label: "Healthcare", href: "industries.html#healthcare", desc: "Patient portals, compliance" },
                    { icon: icon3d("💰","#4facfe","#00f2fe"), label: "FinTech & Banking", href: "industries.html#fintech", desc: "Payments & compliance" },
                    { icon: icon3d("🛒","#30cfd0","#667eea"), label: "E-Commerce & Retail", href: "industries.html#ecommerce", desc: "Storefronts & fulfillment" },
                    { icon: icon3d("🎓","#fa709a","#fee140"), label: "Education & EdTech", href: "industries.html#edtech", desc: "LMS, virtual classrooms" },
                    { icon: icon3d("🚛","#ffecd2","#fcb69f"), label: "Logistics & Supply Chain", href: "industries.html#logistics", desc: "Route optimization, tracking" }
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
        categories: [
            {
                id: "custom-software",
                label: "Custom Software & Web",
                icon: "💻",
                subitems: [
                    { label: "Web Applications", href: "custom-software.html#web-apps", desc: "Next.js, React platforms" },
                    { label: "SaaS Platforms", href: "custom-software.html#saas", desc: "Multi-tenant products" },
                    { label: "Enterprise Tools", href: "custom-software.html#enterprise", desc: "Internal dashboards" }
                ]
            },
            {
                id: "mobile-apps",
                label: "Mobile App Development",
                icon: "📱",
                subitems: [
                    { label: "iOS & Android Native", href: "mobile-apps.html#native", desc: "Swift, Kotlin" },
                    { label: "Cross-Platform (Flutter)", href: "mobile-apps.html#flutter", desc: "One codebase, both platforms" },
                    { label: "App Store Deployment", href: "mobile-apps.html#deployment", desc: "Submission & compliance" }
                ]
            },
            {
                id: "ai-automation",
                label: "AI & Automation",
                icon: "🤖",
                subitems: [
                    { label: "Chatbots & Agents", href: "ai-automation.html#chatbots", desc: "Customer-facing AI" },
                    { label: "Workflow Automation", href: "ai-automation.html#workflows", desc: "n8n, internal processes" },
                    { label: "Voice AI", href: "ai-automation.html#voice", desc: "Call automation" }
                ]
            },
            {
                id: "cloud-devops",
                label: "Cloud & DevOps",
                icon: "☁️",
                subitems: [
                    { label: "Cloud Migration", href: "cloud-devops.html#migration", desc: "AWS, Cloudflare" },
                    { label: "CI/CD Pipelines", href: "cloud-devops.html#cicd", desc: "Automated deployment" }
                ]
            }
        ]
    },"""

pattern = re.compile(r'whoWeHelp: \{.*?cols: \[.*?\]\n    \},\n\n    services: \{.*?cols: \[.*?\]\n    \},', re.DOTALL)
content = pattern.sub(new_whoWeHelp, content)

new_build_menus = """    function buildThreeLayerMenu(menuId, data) {
        const categoryListHTML = data.categories.map((cat, idx) => `
            <div class="mega-l2-item ${idx === 0 ? 'active' : ''}" data-cat-id="${cat.id}">
                <span class="inline-icon">${cat.icon}</span> <strong>${cat.label}</strong>
                <span class="mega-l2-arrow">›</span>
            </div>
        `).join('');

        const subitemsHTML = data.categories.map((cat, idx) => `
            <div class="mega-l3-panel ${idx === 0 ? 'active' : ''}" data-panel-id="${cat.id}">
                ${cat.subitems.map(sub => `
                    <a href="${sub.href}" class="mega-l3-link">
                        <strong>${sub.icon ? '<span class="inline-icon">'+sub.icon+'</span> ' : ''}${sub.label}</strong>
                        <span>${sub.desc}</span>
                    </a>
                `).join('')}
            </div>
        `).join('');

        const featuredHTML = data.featured ? `
            <div class="mega-featured">
                <h3 class="mega-group-heading">Featured</h3>
                <div class="featured-card">
                    <h4>${data.featured.title}</h4>
                    <p>${data.featured.desc}</p>
                    <div class="featured-stat">${data.featured.stat}</div>
                    <a href="${data.featured.ctaHref}" class="tech-featured-cta mt-4">${data.featured.ctaLabel}</a>
                </div>
            </div>
        ` : '';

        return `
            <div class="mega-dropdown mega-${menuId} mega-three-layer">
                <div class="mega-three-layer-inner" style="display:flex; justify-content: space-between; padding: 30px; gap: 0;">
                    <div class="mega-l2-column">
                        ${categoryListHTML}
                    </div>
                    <div class="mega-l3-column">
                        ${subitemsHTML}
                    </div>
                    <div class="mega-featured-container" style="width: 320px; flex-shrink: 0; margin-left: 20px;">
                        ${featuredHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // ── Build generalized mega-menu ───────────────────────────────────────
    function buildMegaMenu(menuId, data) {
        if (data.categories) {
            return buildThreeLayerMenu(menuId, data);
        }
"""

content = content.replace('    // ── Build generalized mega-menu ───────────────────────────────────────\n    function buildMegaMenu(menuId, data) {', new_build_menus)

new_hover_logic = """
        // ── Theme Toggle Logic ──────────────────────────────────────────────
        // Add 3-layer hover logic
        document.querySelectorAll('.mega-l2-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const catId = item.dataset.catId;
                const dropdown = item.closest('.mega-dropdown');
                dropdown.querySelectorAll('.mega-l2-item').forEach(i => i.classList.remove('active'));
                dropdown.querySelectorAll('.mega-l3-panel').forEach(p => p.classList.remove('active'));
                item.classList.add('active');
                dropdown.querySelector(`.mega-l3-panel[data-panel-id="${catId}"]`).classList.add('active');
            });
        });
"""

content = content.replace('        // ── Theme Toggle Logic ──────────────────────────────────────────────', new_hover_logic)


with open('js/nav.js', 'w') as f:
    f.write(content)

