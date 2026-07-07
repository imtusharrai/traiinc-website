const fs = require('fs');
let content = fs.readFileSync('js/nav.js', 'utf8');

const newNavData = `const navData = {
    whoWeHelp: {
        label: "Who We Help",
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
                    { icon: icon3d("🏠","#f6d365","#fda085"), label: "Real Estate & PropTech", href: "industries.html", desc: "CRM, listings, virtual tours" },
                    { icon: icon3d("🏥","#f093fb","#f5576c"), label: "Healthcare", href: "industries.html", desc: "Patient portals, compliance" },
                    { icon: icon3d("💰","#4facfe","#00f2fe"), label: "FinTech & Banking", href: "industries.html", desc: "Payments & compliance" },
                    { icon: icon3d("🛒","#30cfd0","#667eea"), label: "E-Commerce & Retail", href: "industries.html", desc: "Storefronts & fulfillment" },
                    { icon: icon3d("🎓","#fa709a","#fee140"), label: "Education & EdTech", href: "industries.html", desc: "LMS, virtual classrooms" },
                    { icon: icon3d("🍽️","#ffecd2","#fcb69f"), label: "Food & Restaurant", href: "industries.html", desc: "Ordering & POS" }
                ]
            }
        ],
        cta: { label: "See All Industries →", href: "industries.html" }
    },

    services: {
        label: "Services",
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
        ],
        cta: { label: "View All Services →", href: "solutions.html" }
    },

    work: {
        label: "Our Work",
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
        ],
        cta: { label: "Book a Free Consultation →", href: "https://calendar.app.google/PUsxADQBnpQsTrDbA" }
    },

    company: {
        label: "Company",
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
                heading: "Contact",
                items: [
                    { icon: icon3d("📞","#f6d365","#fda085"), label: "Contact Us", href: "contact.html", desc: "Book a consultation" }
                ]
            }
        ],
        cta: { label: "Meet the Team →", href: "about.html" }
    }
};`;

// Regex replace navData
content = content.replace(/const navData = \{[\s\S]*?\n    \};\n/, newNavData + '\n');

const newBuildMegaMenu = `function buildMegaMenu(menuId, data) {
        const panesHTML = data.cols.map((col) => {
            const gridClass = col.items.length >= 4 ? 'tech-pane-grid grid-cols-2' : 'tech-pane-grid grid-cols-1';
            return \`
            <div class="mega-group">
                <h3 class="mega-group-heading">\${col.heading}</h3>
                <div class="\${gridClass}">
                    \${col.items.map(item => \`
                        <a href="\${item.href}" class="tech-item-link">
                            <strong><span class="inline-icon">\${item.icon}</span> \${item.label}</strong>
                            <span>\${item.desc}</span>
                        </a>
                    \`).join('')}
                </div>
            </div>
        \`;
        }).join('');

        return \`
            <div class="mega-dropdown mega-\${menuId} layout-2-col">
                <div class="mega-inner-generalized" style="display:flex; flex-direction:column; padding-bottom: 20px;">
                    <div class="tech-panes-container two-col-panes" style="width:100%; border-right: none; padding-right: 0;">
                        \${panesHTML}
                    </div>
                    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color); text-align: center; width: 100%;">
                        <a href="\${data.cta.href}" class="tech-featured-cta" style="display:inline-block;">\${data.cta.label}</a>
                    </div>
                </div>
            </div>
        \`;
    }`;

content = content.replace(/function buildMegaMenu\(menuId, data\) \{[\s\S]*?    \}\n/, newBuildMegaMenu + '\n');

const newNavLinks = `                    <li class="has-dropdown">
                        <a href="industries.html" class="\${['industries','msmes','startups','smb','enterprise'].includes(page)?'active':''}">Who We Help \${chevron}</a>
                        \${buildMegaMenu('whoWeHelp', navData.whoWeHelp)}
                    </li>
                    <li class="has-dropdown">
                        <a href="solutions.html" class="\${['ai-automation','mobile-apps','web-development','hire-dedicated-developers'].includes(page)?'active':''}">Services \${chevron}</a>
                        \${buildMegaMenu('services', navData.services)}
                    </li>
                    <li class="has-dropdown">
                        <a href="clients.html" class="\${['clients','client-reviews','pricing','our-development-process'].includes(page)?'active':''}">Work \${chevron}</a>
                        \${buildMegaMenu('work', navData.work)}
                    </li>
                    <li class="has-dropdown">
                        <a href="about.html" class="\${['about','careers','partner','incubation','contact'].includes(page)?'active':''}">Company \${chevron}</a>
                        \${buildMegaMenu('company', navData.company)}
                    </li>`;

content = content.replace(/<li class="has-dropdown">[\s\S]*?<\/li>\n                <\/ul>/, newNavLinks + '\n                </ul>');

const newL1Items = `            const l1Items = [
                { id: 'whoWeHelp', label: 'Who We Help' },
                { id: 'services', label: 'Services' },
                { id: 'work', label: 'Our Work' },
                { id: 'company', label: 'Company' }
            ];`;

content = content.replace(/const l1Items = \[[\s\S]*?\];/, newL1Items);

const newFullMenuData = `                const dataL1 = navData[activeL1];
                if (dataL1 && dataL1.cols) {
                    col2.innerHTML = dataL1.cols.map((col, idx) => 
                        \`<button class="fm-l2-btn \${activeL2 === idx ? 'active' : ''}" data-idx="\${idx}">
                            \${col.heading}
                            <span class="fm-arrow">→</span>
                        </button>\`
                    ).join('');
                } else {
                    col2.innerHTML = '';
                }

                // Column 3
                if (dataL1 && dataL1.cols && dataL1.cols[activeL2]) {
                    const col = dataL1.cols[activeL2];
                    col3.innerHTML = col.items.map(item => 
                        \`<a href="\${item.href}" class="fm-l3-link">
                            <span class="fm-l3-icon">\${item.icon}</span>
                            <div class="fm-l3-text">
                                <span class="fm-l3-label">\${item.label}</span>
                                <span class="fm-l3-desc">\${item.desc}</span>
                            </div>
                        </a>\`
                    ).join('');
                } else {
                    col3.innerHTML = '';
                }`;

content = content.replace(/const dataL1 = navData\[activeL1\];[\s\S]*?col3\.innerHTML = '';\n                \}/, newFullMenuData);

fs.writeFileSync('js/nav.js', content, 'utf8');
