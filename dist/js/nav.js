/**
 * Trai Inc — Mega Dropdown Navigation (nav.js)
 */
(function () {

    // ── 3D Gradient Icon helper ──────────────────────────────────────────────
    function icon3d(emoji, from, to) {
        return `<span class="icon-3d" style="background:linear-gradient(135deg,${from},${to})">${emoji}</span>`;
    }

    // ── Nav Mega-Menu Data ──────────────────────────────────────────────────
    const navData = {
        solutions: {
            label: "Solutions",
            cols: [
                {
                    heading: "Core Engineering",
                    items: [
                        { icon: icon3d("☁️","#667eea","#764ba2"), label: "Cloud & DevOps",        href: "solutions.html", desc: "AWS, Azure, GCP migration" },
                        { icon: icon3d("🤖","#f093fb","#f5576c"), label: "AI & Automation",       href: "solutions.html", desc: "LLMs, agents & workflows" },
                        { icon: icon3d("🏗️","#4facfe","#00f2fe"), label: "Custom Software",       href: "solutions.html", desc: "Full-cycle product engineering" },
                        { icon: icon3d("📱","#43e97b","#38f9d7"), label: "Mobile Apps",           href: "solutions.html", desc: "iOS, Android & Flutter" },
                        { icon: icon3d("🔒","#a18cd1","#fbc2eb"), label: "Cybersecurity",         href: "solutions.html", desc: "SOC2, GDPR, zero-trust" },
                    ]
                },
                {
                    heading: "Data & Intelligence",
                    items: [
                        { icon: icon3d("📊","#fa709a","#fee140"), label: "Data & Analytics",     href: "solutions.html", desc: "Pipelines, dashboards & BI" },
                        { icon: icon3d("🧠","#d299c2","#fef9d7"), label: "AI Agents",            href: "solutions.html", desc: "LangChain & voice agents" },
                        { icon: icon3d("⚙️","#ffecd2","#fcb69f"), label: "Enterprise Platforms",  href: "solutions.html", desc: "CRM, ERP & HRMS" },
                        { icon: icon3d("💻","#30cfd0","#667eea"), label: "Web Development",       href: "solutions.html", desc: "React, Next.js & full-stack" },
                        { icon: icon3d("🕷️","#96fbc4","#f9f586"), label: "Lead Gen & Scraping",  href: "solutions.html", desc: "Automated CRM population" },
                    ]
                },
                {
                    heading: "Creative & Growth",
                    items: [
                        { icon: icon3d("🎨","#f6d365","#fda085"), label: "UI/UX Design",         href: "solutions.html", desc: "Figma, prototypes & branding" },
                        { icon: icon3d("📈","#96fbc4","#f9f586"), label: "Digital Marketing",    href: "solutions.html", desc: "SEO, PPC & social media" },
                        { icon: icon3d("🎬","#fbc7d4","#9796f0"), label: "Motion & Video",       href: "solutions.html", desc: "Animations & explainers" },
                        { icon: icon3d("🎙️","#a1c4fd","#c2e9fb"), label: "AI Voice Agents",      href: "solutions.html", desc: "Inbound/outbound voice AI" },
                        { icon: icon3d("⚡","#fddb92","#d1fdff"), label: "Workflow Automation",  href: "solutions.html", desc: "n8n, Zapier, Make" },
                    ]
                }
            ],
            cta: { label: "Explore all Solutions →", href: "solutions.html" }
        },

        industry: {
            label: "Industry",
            cols: [
                {
                    heading: "Industries We Serve",
                    items: [
                        { icon: icon3d("⚖️","#667eea","#764ba2"), label: "FinTech & Banking",        href: "industries.html", desc: "Secure financial systems" },
                        { icon: icon3d("🏥","#f093fb","#f5576c"), label: "Healthcare",               href: "industries.html", desc: "HIPAA-compliant platforms" },
                        { icon: icon3d("🛍️","#4facfe","#00f2fe"), label: "E-Commerce & Retail",      href: "industries.html", desc: "Headless commerce & AI" },
                        { icon: icon3d("🚛","#43e97b","#38f9d7"), label: "Logistics & Supply Chain", href: "industries.html", desc: "IoT & route optimization" },
                    ]
                },
                {
                    heading: "\u00a0",
                    items: [
                        { icon: icon3d("🎓","#fa709a","#fee140"), label: "EdTech & Learning",        href: "industries.html", desc: "LMS & adaptive learning" },
                        { icon: icon3d("🏠","#a18cd1","#fbc2eb"), label: "Real Estate & PropTech",   href: "industries.html", desc: "Virtual tours & CRM" },
                        { icon: icon3d("📺","#ffecd2","#fcb69f"), label: "Media & Entertainment",    href: "industries.html", desc: "Streaming & fan engagement" },
                        { icon: icon3d("✈️","#30cfd0","#667eea"), label: "Travel & Tourism",         href: "industries.html", desc: "Booking & itinerary AI" },
                    ]
                },
                {
                    heading: "Business by Size",
                    items: [
                        { icon: icon3d("🏪","#f6d365","#fda085"), label: "Micro Business (MSMEs)",    href: "micro-business.html", desc: "Local shops & small teams" },
                        { icon: icon3d("🚀","#96fbc4","#f9f586"), label: "Startups",                 href: "startups.html",       desc: "Innovative product builders" },
                        { icon: icon3d("🏢","#a1c4fd","#c2e9fb"), label: "Small & Medium Business",  href: "smb.html",            desc: "Regional & national reach" },
                        { icon: icon3d("🏗️","#fbc7d4","#9796f0"), label: "Large Enterprises",       href: "enterprise.html",     desc: "Global corp solutions" },
                        { icon: icon3d("🤲","#d299c2","#fef9d7"), label: "Non Profit",              href: "nonprofit.html",      desc: "Funded by grants & donors" },
                    ]
                }
            ],
            cta: { label: "Explore all Industries →", href: "industries.html" }
        },

        company: {
            label: "Company",
            cols: [
                {
                    heading: "Who We Are",
                    items: [
                        { icon: icon3d("🏢","#667eea","#764ba2"), label: "About Trai",      href: "about.html",       desc: "Our story & mission" },
                        { icon: icon3d("🚀","#fa709a","#fee140"), label: "Incubation",      href: "incubation.html",  desc: "Startup support program" },
                        { icon: icon3d("💼","#4facfe","#00f2fe"), label: "Careers",         href: "careers.html",     desc: "Join the team" },
                        { icon: icon3d("🤝","#43e97b","#38f9d7"), label: "Partner With Us", href: "partner.html",     desc: "Reseller & agency programs" },
                    ]
                },
                {
                    heading: "Resources",
                    items: [
                        { icon: icon3d("✍️","#f6d365","#fda085"), label: "Blog",            href: "blog.html",        desc: "Insights & how-to guides" },
                        { icon: icon3d("🏆","#a1c4fd","#c2e9fb"), label: "Our Clients",     href: "clients.html",     desc: "120+ businesses trust us" },
                        { icon: icon3d("📞","#fbc7d4","#9796f0"), label: "Contact Us",      href: "contact.html", desc: "Get in touch today" },
                    ]
                }
            ],
            cta: { label: "Book a Discovery Call →", href: "https://calendar.app.google/PUsxADQBnpQsTrDbA" }
        }
    };

    // ── Build one mega-dropdown panel ───────────────────────────────────────
    function buildDropdown(data) {
        const cols = data.cols.map(col => `
            <div class="mega-col">
                <div class="mega-col-heading">${col.heading}</div>
                ${col.items.map(item => `
                    <a href="${item.href}" class="mega-item">
                        ${item.icon}
                        <div class="mega-item-text">
                            <strong>${item.label}</strong>
                            <span>${item.desc}</span>
                        </div>
                    </a>
                `).join('')}
            </div>
        `).join('');

        return `
            <div class="mega-dropdown">
                <div class="mega-inner">${cols}</div>
                <div class="mega-footer">
                    <a href="${data.cta.href}" class="mega-cta">${data.cta.label}</a>
                </div>
            </div>
        `;
    }

    // ── Chevron SVG ──────────────────────────────────────────────────────────
    const chevron = `<svg class="chevron" viewBox="0 0 10 6" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;

    // ── Inject full nav ──────────────────────────────────────────────────────
    function buildNav() {
        const page = document.body.getAttribute('data-page') || '';

        const navHTML = `
            <div class="nav-container">
                <a href="index.html" class="logo">TRAI</a>
                <ul class="nav-links" id="nav-links">
                    <li><a href="index.html" class="${page==='home'?'active':''}">Home</a></li>
                    <li class="has-dropdown">
                        <a href="solutions.html" class="${page==='solutions'?'active':''}">Solutions ${chevron}</a>
                        ${buildDropdown(navData.solutions)}
                    </li>
                    <li class="has-dropdown">
                        <a href="industries.html" class="${page==='industries'?'active':''}">Industry ${chevron}</a>
                        ${buildDropdown(navData.industry)}
                    </li>
                    <li><a href="incubation.html" class="${page==='incubation'?'active':''}">Incubation</a></li>
                    <li class="has-dropdown">
                        <a href="about.html" class="${['about','careers','partner'].includes(page)?'active':''}">Company ${chevron}</a>
                        ${buildDropdown(navData.company)}
                    </li>
                </ul>
                <div class="nav-actions">
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
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildNav);
    } else {
        buildNav();
    }

})();
