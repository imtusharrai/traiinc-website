document.addEventListener("DOMContentLoaded", async () => {
    // Shared Footer Template
    const footerHTML = `
        <div class="container footer-top">
            <div class="footer-brand">
                <!-- Logo image with pulse glow -->
                <a href="index.html" class="footer-logo-wrap" aria-label="Trai Inc Services home">
                    <span class="footer-logo-pulse"></span>
                    <img src="assets/logos/logo.png" alt="Trai Inc Services" class="footer-logo-img">
                </a>
                <div class="footer-brand-name">Trai Inc Services</div>
                <p class="footer-tagline">🚀 Empowering small businesses<br>with big dreams ✨💡</p>
                <div class="footer-contact">
                    <a href="tel:+917905495478" class="contact-link">📞 +91-7905495478</a><br>
                    <a href="mailto:hello@traiinc.com" class="contact-link">✉️ hello@traiinc.com</a>
                </div>
                <!-- Social Media Icons -->
                <div class="footer-social">
                    <a href="https://www.linkedin.com/company/trai-inc" target="_blank" rel="noopener" class="social-icon" aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    </a>
                    <a href="https://x.com/inctrai" target="_blank" rel="noopener" class="social-icon" aria-label="Twitter / X">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="https://www.instagram.com/traiinc" target="_blank" rel="noopener" class="social-icon" aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                    <a href="https://www.youtube.com/@traiinc" target="_blank" rel="noopener" class="social-icon" aria-label="YouTube">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                    <a href="https://wa.me/917905495478" target="_blank" rel="noopener" class="social-icon social-wa" aria-label="WhatsApp">
                        <svg viewBox="0 0 32 32" fill="currentColor" width="18" height="18"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.744 3.048 9.38L1.054 31.2l6.044-1.94a15.9 15.9 0 008.906 2.704C24.826 31.964 32 24.788 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.958 2.042-3.212 2.312-.86.182-1.98.328-5.754-1.236-4.83-2.004-7.938-6.902-8.18-7.222-.232-.32-1.948-2.596-1.948-4.952s1.232-3.508 1.67-3.988c.438-.48.956-.6 1.276-.6.32 0 .636.004.914.016.294.014.688-.112 1.076.82.396.952 1.348 3.288 1.466 3.528.118.24.198.518.04.836-.16.32-.24.518-.478.8-.24.28-.504.626-.72.84-.24.24-.488.498-.21.976.28.48 1.244 2.054 2.672 3.328 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.278-.32 1.196-1.392 1.514-1.872.318-.48.636-.396 1.076-.24.438.16 2.784 1.312 3.262 1.552.48.24.798.356.916.556.118.198.118 1.156-.278 2.272z"/></svg>
                    </a>
                </div>
            </div>
            <!-- Col 2: Company -->
            <div class="link-group">
                <h4>Company</h4>
                <ul>
                    <li><a href="about.html">🏢 About Us</a></li>
                    <li><a href="solutions.html">⚙️ Solutions</a></li>
                    <li><a href="industries.html">🏭 Industries</a></li>
                    <li><a href="incubation.html">🚀 Incubation</a></li>
                    <li><a href="careers.html">💼 Careers</a></li>
                    <li><a href="partner.html">🤝 Partner</a></li>
                </ul>
            </div>

            <!-- Col 3: Services -->
            <div class="link-group">
                <h4>Services</h4>
                <ul>
                    <li><a href="solutions.html">☁️ Cloud & DevOps</a></li>
                    <li><a href="solutions.html">🤖 AI & Automation</a></li>
                    <li><a href="solutions.html">📱 Mobile Apps</a></li>
                    <li><a href="solutions.html">🎨 UI/UX Design</a></li>
                    <li><a href="solutions.html">📈 Digital Marketing</a></li>
                    <li><a href="solutions.html">🔒 Cybersecurity</a></li>
                </ul>
            </div>

            <!-- Col 4: Location + Hours -->
            <div class="link-group">
                <h4>📍 Location</h4>
                <p>DLF Mypad, Vibhuti Khand,<br>Gomti Nagar, Lucknow,<br>India — 226010</p>
                <h4 style="margin-top:20px;">⏰ Hours</h4>
                <p>Mon–Sat: 9am – 7pm IST<br>Sun: By appointment</p>
            </div>

            <!-- Col 5: Newsletter -->
            <div class="footer-newsletter">
                <h4>📬 Stay in the loop</h4>
                <p>Get monthly insights on cloud, AI trends, and engineering best practices — straight to your inbox.</p>
                <form class="newsletter-form">
                    <input type="email" placeholder="Work Email" required>
                    <button type="submit">Subscribe</button>
                </form>
                <div class="footer-badges">
                    <span class="footer-badge">🔐 SOC 2 Ready</span>
                    <span class="footer-badge">🌍 Global Clients</span>
                    <span class="footer-badge">⚡ 99.9% Uptime</span>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>Copyright © 2025 Trai, Inc. All Rights Reserved &nbsp;·&nbsp; Made with ❤️ in India</p>
            <div class="legal-links">
                <a href="terms.html">Terms of Services</a> | 
                <a href="privacy.html">Privacy Policy</a>
            </div>
        </div>
    `;

    const footerEl = document.getElementById("footer");
    if (footerEl) {
        footerEl.innerHTML = footerHTML;
    }

    // ─── WhatsApp Click-to-Chat Button ───────────────────────────────────────
    const whatsappNumber = "917905495478";
    const whatsappMessage = encodeURIComponent("Hi Trai! I'm interested in learning more about your services. Can we chat?");
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    const fabLogo = document.createElement("a");
    fabLogo.className = "fab-logo";
    fabLogo.href = whatsappURL;
    fabLogo.target = "_blank";
    fabLogo.rel = "noopener noreferrer";
    fabLogo.setAttribute("aria-label", "Chat with us on WhatsApp");
    fabLogo.innerHTML = `
        <svg viewBox="0 0 32 32" width="32" height="32" fill="white">
            <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.13 6.744 3.048 9.38L1.054 31.2l6.044-1.94a15.9 15.9 0 008.906 2.704C24.826 31.964 32 24.788 32 16.004S24.826 0 16.004 0zm9.35 22.616c-.396 1.116-1.958 2.042-3.212 2.312-.86.182-1.98.328-5.754-1.236-4.83-2.004-7.938-6.902-8.18-7.222-.232-.32-1.948-2.596-1.948-4.952s1.232-3.508 1.67-3.988c.438-.48.956-.6 1.276-.6.32 0 .636.004.914.016.294.014.688-.112 1.076.82.396.952 1.348 3.288 1.466 3.528.118.24.198.518.04.836-.16.32-.24.518-.478.8-.24.28-.504.626-.72.84-.24.24-.488.498-.21.976.28.48 1.244 2.054 2.672 3.328 1.836 1.636 3.384 2.144 3.864 2.384.48.24.76.2 1.04-.12.278-.32 1.196-1.392 1.514-1.872.318-.48.636-.396 1.076-.24.438.16 2.784 1.312 3.262 1.552.48.24.798.356.916.556.118.198.118 1.156-.278 2.272z"/>
        </svg>
        <div class="chat-badge">1</div>
    `;
    document.body.appendChild(fabLogo);

    // Tooltip
    const chatTooltip = document.createElement("div");
    chatTooltip.className = "chat-tooltip";
    chatTooltip.innerHTML = `💬 Chat on WhatsApp`;
    document.body.appendChild(chatTooltip);

    // Hover logic
    let tooltipTimeout;
    fabLogo.addEventListener("mouseenter", () => {
        clearTimeout(tooltipTimeout);
        chatTooltip.classList.add("active");
    });
    fabLogo.addEventListener("mouseleave", () => {
        tooltipTimeout = setTimeout(() => chatTooltip.classList.remove("active"), 300);
    });

    // Hide badge on click
    fabLogo.addEventListener("click", () => {
        const badge = fabLogo.querySelector('.chat-badge');
        if (badge) badge.style.display = 'none';
    });

    // Theme Toggle
    const themeBtn = document.createElement("button");
    themeBtn.id = "theme-toggle";
    themeBtn.setAttribute("aria-label", "Toggle Theme");
    themeBtn.style.cssText = "padding: 8px 12px; margin-right: 15px; border-radius: 50%; border: 1px solid var(--border-light); background: transparent; cursor: pointer; color: var(--text-main); font-size: 1.2rem; display: flex; align-items: center; justify-content: center;";
    themeBtn.innerHTML = "🌙";

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeBtn.innerHTML = "☀️";
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeBtn.innerHTML = "☀️";
        } else {
            localStorage.setItem('theme', 'dark');
            themeBtn.innerHTML = "🌙";
        }
    });

    const navContactBtn = document.querySelector(".nav-container > .btn-primary");
    if (navContactBtn) {
        navContactBtn.parentNode.insertBefore(themeBtn, navContactBtn);
    }

    // Sticky Navbar
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Newsletter Intercept
    const newsletterForm = document.querySelector(".newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector("button");
            btn.innerHTML = "Subscribed! ✅";
            btn.style.background = "#28a745";
            setTimeout(() => {
                btn.innerHTML = "Subscribe";
                btn.style.background = "var(--text-main)";
                newsletterForm.reset();
            }, 3000);
        });
    }

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            if (navLinks.style.display === "flex") {
                navLinks.style.display = "none";
            } else {
                navLinks.style.display = "flex";
                navLinks.style.flexDirection = "column";
                navLinks.style.position = "absolute";
                navLinks.style.top = "70px";
                navLinks.style.left = "0";
                navLinks.style.width = "100%";
                navLinks.style.background = "var(--bg-dark)";
                navLinks.style.padding = "20px";
                navLinks.style.borderBottom = "1px solid var(--border-light)";
            }
        });
    }

    // Fetch and Render Dynamic Content
    const pageId = document.body.getAttribute("data-page");
    const dynamicContainer = document.getElementById("dynamic-content");

    try {
        const response = await fetch(`data/${pageId}.json?v=` + new Date().getTime());
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        const renderers = {
            home: renderHome,
            about: renderAbout,
            solutions: renderSolutions,
            industries: renderIndustries,
            incubation: renderIncubation,
            careers: renderCareers,
            partner: renderPartner,
            contact: renderContact
        };

        const renderFn = renderers[pageId];
        if (renderFn) {
            dynamicContainer.innerHTML = renderFn(data);
        }

        initAnimations();

// --- FormSubmit Contact Form Handler ---
    const contactFormEl = document.getElementById('contactForm');
    if (contactFormEl) {
        contactFormEl.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = document.getElementById('contactSubmitBtn');
            const result = document.getElementById('formResult');
            btn.disabled = true;
            btn.textContent = 'Sending...';
            
            try {
                const response = await fetch(contactFormEl.action, {
                    method: 'POST',
                    body: new FormData(contactFormEl),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    result.style.display = 'block';
                    result.style.color = '#28a745';
                    result.innerHTML = '\u2705 Message sent successfully! We\'ll get back within 24 hours.';
                    contactFormEl.reset();
                } else {
                    result.style.display = 'block';
                    result.style.color = '#dc3545';
                    result.textContent = 'Something went wrong. Please try again.';
                }
            } catch (err) {
                result.style.display = 'block';
                result.style.color = '#dc3545';
                result.textContent = 'Network error. Please try again.';
            }
            btn.disabled = false;
            btn.textContent = 'Send Message';
        });
    }

    } catch (error) {
        dynamicContainer.innerHTML = `<div class="container" style="padding: 150px 0; text-align: center;"><h2>Error loading content. Please run this via a local server (e.g. VSCode Live Server).</h2><p style="color:var(--text-muted);margin-top:10px;">${error.message}</p></div>`;
        console.error("Error fetching data:", error);
    }
});

/* ===== PAGE RENDERERS ===== */

function renderHome(data) {
    return `
    <header class="hero" style="text-align: center; padding: 180px 24px 100px;">
        <div class="hero-content fade-in" style="display: flex; flex-direction: column; align-items: center; max-width: 1000px; margin: 0 auto;">
            <h2 class="sub-heading" style="color: var(--accent-color); letter-spacing: 2px; text-transform: uppercase; font-weight: 800; margin-bottom: 20px;">${data.hero.subheading}</h2>
            <h1 class="main-heading" style="font-size: 4.5rem; line-height: 1.1; margin-bottom: 30px;">${data.hero.heading_part1} <br> ${data.hero.heading_part2} <span class="highlight-text">${data.hero.highlight}</span> ${data.hero.emoji}</h1>
            <div class="hero-ratings" style="display: flex; gap: 30px; margin-bottom: 40px; justify-content: center;">
                ${data.hero.ratings.map(r => `
                <div class="rating" style="text-align: center;">
                    <span class="stars" style="color: #ffb300; font-size: 1.2rem;">${r.stars}</span>
                    <p style="color: var(--text-muted); font-weight: 500; font-size: 0.95rem;">${r.text}</p>
                </div>`).join('')}
            </div>
            <div class="hero-actions" style="display: flex; gap: 20px; justify-content: center;">
                <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">${data.hero.button_text}</a>
                <a href="solutions.html" class="btn-secondary large">View Solutions</a>
            </div>
        </div>
    </header>
    
    <section class="trust-banner">
        <div class="container">
            <p style="color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 35px; font-weight: 800; text-align: center;">${data.trust.title}</p>
            <div class="logo-ticker">
                ${[...data.trust.logos, ...data.trust.logos].map(logo => `<span class="logo-item">${logo}</span>`).join('')}
            </div>
        </div>
    </section>

    <section class="specialise-section">
        <div class="container">
            <div class="section-header fade-in">
                <h2>${data.specialise.title}</h2>
                <div class="header-line"></div>
            </div>
            <div class="specialise-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px;">
                ${data.specialise.categories.map(c => `
                <div class="spec-card fade-in" style="padding: 40px 30px; position: relative; overflow: hidden; display: flex; flex-direction: column; height: 100%;">
                    <div style="font-size: 2.5rem; margin-bottom: 20px; line-height: 1;">${c.icon}</div>
                    <h3 style="font-size: 1.3rem; margin-bottom: 12px;">${c.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; flex-grow: 1;">${c.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="popular-services">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.popular_services.subtitle}</h4>
                <h2>${data.popular_services.title}</h2>
            </div>
            <div class="services-wrapper fade-in">
                ${data.popular_services.categories.map(cat => `
                <div class="service-category spec-card fade-in" style="padding: 30px; border-radius: 16px; background: var(--bg-card);">
                    <div class="cat-header">
                        <h3 style="border-bottom: none; margin-bottom: 25px; font-size: 1.4rem; color: var(--text-main);">${cat.name}</h3>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${cat.items.map(i => `<span style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 500; background: var(--bg-light); border: 1px solid var(--border-light); color: var(--text-muted); transition: all 0.3s ease; cursor: default;" onmouseover="this.style.color='var(--text-main)'; this.style.borderColor='var(--accent-color)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.color='var(--text-muted)'; this.style.borderColor='var(--border-light)'; this.style.transform='none';">${i}</span>`).join('')}
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="case-studies-section" style="padding: 100px 0; background: var(--bg-darker);">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.case_studies.subtitle}</h4>
                <h2>${data.case_studies.title}</h2>
            </div>
            <div class="grid-3 fade-in" style="margin-top: 50px;">
                ${data.case_studies.studies.map(study => `
                <div class="spec-card" style="padding: 40px; background: var(--bg-card); border-top: 4px solid var(--accent-color);">
                    <p style="color: var(--accent-color); font-weight: 700; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">${study.client}</p>
                    <h3 style="font-size: 1.4rem; margin-bottom: 15px;">${study.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 25px; line-height: 1.6;">${study.impact}</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${study.tags.map(t => `<span style="padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; background: var(--bg-light); border: 1px solid var(--border-light); color: var(--text-muted);">${t}</span>`).join('')}
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="growth-section">
        <div class="container growth-container fade-in">
            <div class="growth-text">
                <h4 class="mini-title">${data.growth.subtitle}</h4>
                <h2>${data.growth.title}</h2>
                <div class="growth-stats">
                    ${data.growth.stats.map(s => `
                    <div class="stat">
                        <h3>${s.title}</h3>
                        <p>${s.desc}</p>
                    </div>`).join('')}
                </div>
            </div>
        </div>
    </section>
    `;
}

function renderAbout(data) {
    return `
    <header class="page-header" style="padding: 150px 24px 50px; text-align: center; max-width: 800px; margin: 0 auto;">
        <h4 class="mini-title fade-in">${data.header.subtitle}</h4>
        <h1 class="main-heading fade-in">${data.header.title}</h1>
        <p class="fade-in" style="color: var(--text-muted); font-size: 1.2rem;">${data.intro.text}</p>
    </header>
    
    <section class="team-section container" style="padding: 100px 24px;">
        <div class="section-header center fade-in">
            <h4 class="mini-title">${data.team.subtitle}</h4>
            <h2>The engineers and leaders behind our platform</h2>
        </div>
        <div class="grid-3 fade-in" style="margin-top: 50px;">
            ${data.team.members.map(m => `
            <div class="spec-card text-center" style="padding: 30px;">
                <div style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 20px; overflow: hidden; border: 3px solid var(--border-light);">
                    <img src="${m.image}" alt="${m.name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <h3 style="margin-bottom: 5px;">${m.name}</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem;">${m.role}</p>
            </div>`).join('')}
        </div>
    </section>
    `;
}

function renderIncubation(data) {
    return `
    <header class="incub-hero fade-in">
        <div class="container" style="max-width: 900px; margin: 0 auto; text-align: center; padding: 180px 24px 80px;">
            <h4 class="mini-title">${data.hero.subtitle}</h4>
            <h1 class="main-heading" style="font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 25px;">${data.hero.title}</h1>
            <p style="color: var(--text-muted); font-size: 1.15rem; line-height: 1.7; max-width: 700px; margin: 0 auto 40px;">${data.hero.description}</p>
            <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">${data.cta.button_text}</a>
            <p style="color: var(--text-muted); margin-top: 20px; font-size: 0.9rem; font-style: italic; opacity: 0.8;">${data.scarcity || ''}</p>
        </div>
    </header>

    <section style="padding: 60px 0; background: var(--bg-card); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);">
        <div class="container">
            <div style="display: flex; justify-content: center; gap: 60px; flex-wrap: wrap; text-align: center;">
                ${data.stats.map(s => `
                <div class="fade-in">
                    <h3 style="font-size: 2.5rem; font-family: var(--font-heading); background: var(--brand-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${s.value}</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 5px;">${s.label}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section style="padding: 100px 0;">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">INCUBATION TRACKS</h4>
                <h2>Choose the track that matches your stage</h2>
            </div>
            <div class="grid-2" style="margin-top: 50px; gap: 40px;">
                ${data.programs.map(p => `
                <div class="spec-card fade-in" style="padding: 50px; border-top: 4px solid var(--accent-color); display: flex; flex-direction: column; height: 100%;">
                    <div style="font-size: 3rem; margin-bottom: 15px;">${p.icon}</div>
                    <h3 style="font-size: 1.6rem; margin-bottom: 10px; font-family: var(--font-heading);">${p.title}</h3>
                    <span style="display: inline-block; padding: 5px 14px; background: var(--bg-light); border-radius: 50px; font-size: 0.8rem; font-weight: 700; color: var(--accent-color); margin-bottom: 20px; width: fit-content;">⏱ ${p.duration}</span>
                    <p style="color: var(--text-muted); font-size: 1rem; line-height: 1.7; margin-bottom: 25px; flex-grow: 1;">${p.desc}</p>
                    <ul style="list-style: none; padding: 0;">
                        ${p.includes.map(i => `<li style="display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; font-size: 0.9rem; color: var(--text-muted);"><span style="color: var(--accent-color); font-weight: 700; flex-shrink: 0;">✔</span> ${i}</li>`).join('')}
                    </ul>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section style="padding: 100px 0; background: var(--bg-darker);">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">WHAT YOU GET</h4>
                <h2>Everything a founder needs to ship and scale</h2>
            </div>
            <div class="grid-3" style="margin-top: 50px;">
                ${data.what_you_get.map(item => `
                <div class="spec-card fade-in" style="padding: 40px; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 20px;">${item.icon}</div>
                    <h3 style="font-size: 1.2rem; font-family: var(--font-heading); margin-bottom: 12px;">${item.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${item.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section style="padding: 100px 0;">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">HOW IT WORKS</h4>
                <h2>From application to launch in 4 steps</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 50px;" class="incub-process-grid">
                ${data.process.map(step => `
                <div class="fade-in" style="text-align: center; padding: 30px;">
                    <div style="font-size: 3rem; font-family: var(--font-heading); font-weight: 800; background: var(--brand-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 15px;">${step.step}</div>
                    <h3 style="font-size: 1.2rem; font-family: var(--font-heading); margin-bottom: 10px;">${step.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">${step.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section style="padding: 100px 0; background: var(--bg-darker);">
        <div class="container" style="max-width: 800px;">
            <div class="section-header center fade-in">
                <h4 class="mini-title">IDEAL CANDIDATE</h4>
                <h2>${data.ideal_founder.title}</h2>
            </div>
            <div class="spec-card fade-in" style="padding: 50px; margin-top: 40px;">
                <ul style="list-style: none; padding: 0;">
                    ${data.ideal_founder.traits.map(t => `
                    <li style="display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; font-size: 1rem; line-height: 1.6;">
                        <span style="color: var(--accent-color); font-size: 1.3rem; flex-shrink: 0;">→</span>
                        <span style="color: var(--text-muted);">${t}</span>
                    </li>`).join('')}
                </ul>
            </div>
        </div>
    </section>

    <section style="padding: 120px 0;">
        <div class="container">
            <div class="spec-card fade-in" style="padding: 80px 60px; text-align: center; border-radius: 30px; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: var(--brand-gradient); filter: blur(150px); opacity: 0.15; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -80px; left: -80px; width: 250px; height: 250px; background: var(--accent-glow); filter: blur(120px); opacity: 0.2; border-radius: 50%;"></div>
                <h2 style="font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 20px; position: relative;">${data.cta.title}</h2>
                <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 40px; font-size: 1.1rem; line-height: 1.7; position: relative;">${data.cta.description}</p>
                <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large" style="position: relative;">${data.cta.button_text}</a>
            </div>
        </div>
    </section>
    `;
}

function renderCareers(data) {
    return `
    <header class="page-header container fade-in" style="padding: 150px 24px 80px; text-align: center; max-width: 900px; margin: 0 auto;">
        <h4 class="mini-title">${data.header.subtitle}</h4>
        <h1 style="font-size: 4rem; margin-bottom: 25px;">${data.header.title}</h1>
        <p style="color: var(--text-muted); font-size: 1.2rem; line-height: 1.6;">${data.header.description}</p>
    </header>

    <section class="container fade-in" style="padding: 60px 24px;">
        <h2 style="text-align: center; font-size: 2.2rem; margin-bottom: 50px;">${data.values.title}</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 30px;">
            ${data.values.items.map(v => `
            <div class="spec-card fade-in" style="padding: 40px 30px;">
                <div style="font-size: 2.5rem; margin-bottom: 15px;">${v.icon}</div>
                <h3 style="font-size: 1.3rem; margin-bottom: 12px;">${v.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${v.desc}</p>
            </div>`).join('')}
        </div>
    </section>

    <section class="container fade-in" style="padding: 80px 24px;">
        <h4 class="mini-title" style="text-align: center;">${data.benefits.title}</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 25px; margin-top: 40px;">
            ${data.benefits.items.map(b => `
            <div class="spec-card fade-in" style="padding: 30px; text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 15px;">${b.icon}</div>
                <h4 style="font-size: 1.1rem; margin-bottom: 10px;">${b.title}</h4>
                <p style="color: var(--text-muted); font-size: 0.9rem;">${b.desc}</p>
            </div>`).join('')}
        </div>
    </section>

    <section class="container fade-in" style="padding: 80px 24px;">
        <h4 class="mini-title" style="text-align: center;">${data.openings.title}</h4>

        ${data.openings.sections.map(section => `
        <div style="margin-top: 50px;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h2 style="font-size: 2.2rem; margin-bottom: 10px;">${section.category}</h2>
                <p style="color: var(--text-muted); font-size: 1.05rem;">${section.subtitle}</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px;">
                ${section.jobs.map(job => `
                <div class="spec-card fade-in" style="padding: 35px 30px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <h3 style="font-size: 1.25rem; margin-bottom: 10px;">${job.title}</h3>
                        <div style="display: flex; gap: 12px; margin-bottom: 15px;">
                            <span style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); padding: 5px 14px; border-radius: 20px; font-size: 0.8rem; color: var(--text-muted);">${job.location}</span>
                            <span style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); padding: 5px 14px; border-radius: 20px; font-size: 0.8rem; color: var(--text-muted);">${job.type}</span>
                        </div>
                        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${job.desc}</p>
                    </div>
                </div>`).join('')}
            </div>

            <div style="text-align: center; margin-top: 35px;">
                <a href="${section.apply_link}" target="_blank" class="btn-primary large">${section.apply_text}</a>
            </div>
        </div>`).join('')}
    </section>
    `;
}
function renderPartner(data) {
    return `
    <header class="page-header container fade-in" style="padding: 150px 24px 80px; text-align: center; max-width: 800px; margin: 0 auto;">
        <h4 class="mini-title">${data.header.subtitle}</h4>
        <h1 class="main-heading">${data.header.title}</h1>
        <p style="color: var(--text-muted);">${data.header.description}</p>
    </header>

    <section class="programs-section container fade-in" style="padding: 50px 24px 100px;">
        <div class="grid-3">
            ${data.programs.map(p => `
            <div class="spec-card">
                <h3 style="color: var(--accent-color);">${p.title}</h3>
                <p style="margin-bottom: 20px;">${p.desc}</p>
                <ul style="color: var(--text-muted); font-size: 0.9rem; margin-left: 20px; list-style: disc;">
                    ${p.benefits.map(b => `<li style="margin-bottom: 5px;">${b}</li>`).join('')}
                </ul>
            </div>`).join('')}
        </div>
    </section>
    `;
}

function renderContact(data) {
    return `
    <section class="contact-section container fade-in" style="padding: 150px 24px 100px; display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: start;">
        
        <!-- Left Column: Premium Form -->
        <div class="contact-form-wrapper" style="background: var(--bg-card); padding: 50px; border-radius: 24px; border: 1px solid var(--border-light); box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
            <h4 class="mini-title">GET IN TOUCH</h4>
            <h2 style="font-size: 2.2rem; margin-bottom: 10px;">${data.header.title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 1.05rem;">${data.header.description}</p>
            
            
            
            <form id="contactForm" class="premium-form" action="https://formsubmit.co/hello@traiinc.com" method="POST" method="POST" style="margin-bottom: 40px;">
                <input type="hidden" name="_subject" value="New Lead from TraiInc.com">
                <input type="hidden" name="_captcha" value="false">
                <input type="hidden" name="_template" value="table">
                <input type="hidden" name="_next" value="https://traiinc.com/contact.html">
                <input type="text" name="_honey" style="display:none;">
                
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label style="display:block;font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Full Name</label>
                        <input type="text" name="name" required placeholder="Your name" style="width:100%;padding:16px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--border-light);border-radius:12px;color:var(--text-main);font-size:1rem;transition:all 0.3s ease;">
                    </div>
                    <div class="form-group">
                        <label style="display:block;font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Work Email</label>
                        <input type="email" name="email" required placeholder="you@company.com" style="width:100%;padding:16px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--border-light);border-radius:12px;color:var(--text-main);font-size:1rem;transition:all 0.3s ease;">
                    </div>
                </div>
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label style="display:block;font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Phone</label>
                        <input type="tel" name="phone" placeholder="+91-XXXXXXXXXX" style="width:100%;padding:16px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--border-light);border-radius:12px;color:var(--text-main);font-size:1rem;transition:all 0.3s ease;">
                    </div>
                    <div class="form-group">
                        <label style="display:block;font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Company</label>
                        <input type="text" name="company" placeholder="Your company" style="width:100%;padding:16px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--border-light);border-radius:12px;color:var(--text-main);font-size:1rem;transition:all 0.3s ease;">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: 30px;">
                    <label style="display:block;font-size:0.85rem;font-weight:600;color:var(--text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:1px;">Project Details</label>
                    <textarea name="message" required rows="4" placeholder="Tell us about your project..." style="width:100%;padding:16px 20px;background:rgba(255,255,255,0.03);border:1px solid var(--border-light);border-radius:12px;color:var(--text-main);font-size:1rem;transition:all 0.3s ease;resize:vertical;"></textarea>
                </div>
                <button type="submit" id="contactSubmitBtn" class="btn-primary large" style="width:100%;justify-content:center;font-size:1.1rem;padding:18px;">Send Message</button>
                <p id="formResult" style="text-align:center;margin-top:15px;font-size:0.95rem;display:none;"></p>
            </form>
<div class="onboarding-timeline" style="margin-top: 40px;">
                <h3 style="font-size: 1.6rem; margin-bottom: 30px; border-bottom: 1px solid var(--border-light); padding-bottom: 15px;">Our Engagement Process</h3>
                
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <div style="background: var(--accent-color); color: white; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">1</div>
                    <div>
                        <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Discovery & Scoping</h4>
                        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">We schedule a call to understand your business objectives, technical constraints, and current architecture.</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); color: var(--text-main); width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">2</div>
                    <div>
                        <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Proposal & Timeline</h4>
                        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">Our engineering team delivers a comprehensive roadmap, system architecture draft, and transparent pricing.</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 20px;">
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); color: var(--text-main); width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">3</div>
                    <div>
                        <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Project Kickoff</h4>
                        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">We allocate your dedicated squad, set up communication channels, and execute the first development sprint.</p>
                    </div>
                </div>
            </div>

        </div>
        
        <!-- Right Column: Info & Calendar -->
        <div class="contact-sidebar" style="display: flex; flex-direction: column; gap: 40px;">
            
            <div class="contact-info-blocks" style="display: grid; gap: 30px;">
                <div class="info-block" style="display: flex; gap: 20px; align-items: flex-start;">
                    <div class="info-icon" style="font-size: 1.8rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; border: 1px solid var(--border-light);">✅</div>
                    <div>
                        <h4 style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Call Us Directly</h4>
                        <a href="tel:${data.contact_info.phone}" style="font-size: 1.4rem; font-weight: 600; color: var(--text-main); text-decoration: none;">${data.contact_info.phone}</a>
                    </div>
                </div>
                
                <div class="info-block" style="display: flex; gap: 20px; align-items: flex-start;">
                    <div class="info-icon" style="font-size: 1.8rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; border: 1px solid var(--border-light);">📞</div>
                    <div>
                        <h4 style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Email Us</h4>
                        <a href="mailto:${data.contact_info.email}" style="font-size: 1.4rem; font-weight: 600; color: var(--text-main); text-decoration: none;">${data.contact_info.email}</a>
                    </div>
                </div>
                
                <div class="info-block" style="display: flex; gap: 20px; align-items: flex-start;">
                    <div class="info-icon" style="font-size: 1.8rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; border: 1px solid var(--border-light);">✉️</div>
                    <div>
                        <h4 style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Headquarters</h4>
                        <p style="font-size: 1.1rem; color: var(--text-main); line-height: 1.5; max-width: 250px;">${data.contact_info.address}</p>
                    </div>
                </div>
            </div>

            <div class="booking-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent); padding: 40px; border-radius: 24px; border: 1px solid var(--border-light); text-align: center; position: relative; overflow: hidden;">
                <!-- Decorative glow -->
                <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: var(--accent-color); filter: blur(80px); opacity: 0.3; border-radius: 50%;"></div>
                
                <div style="font-size: 3rem; margin-bottom: 20px; position: relative; z-index: 1;">📍</div>
                <h3 style="font-size: 1.8rem; margin-bottom: 15px; position: relative; z-index: 1;">${data.booking.title}</h3>
                <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 1.05rem; line-height: 1.6; position: relative; z-index: 1;">${data.booking.description}</p>
                <a href="${data.booking.calendar_url}" target="_blank" class="btn-primary large" style="width: 100%; position: relative; z-index: 1; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">${data.booking.button_text}</a>
            </div>
            
        </div>
    </section>
    
    <!-- CSS for Inputs -->
    <style>
        .premium-form input:focus, .premium-form textarea:focus {
            outline: none;
            border-color: var(--accent-color);
            background: rgba(255,255,255,0.08);
            box-shadow: 0 0 0 4px rgba(255, 62, 108, 0.1);
        }
        @media (max-width: 768px) {
            .contact-section {
                grid-template-columns: 1fr !important;
                padding: 120px 20px 80px !important;
            }
            .premium-form .form-row {
                grid-template-columns: 1fr !important;
            }
        }
    </style>
    `;
}
function renderSolutions(data) {
    return `
    <header class="page-header container fade-in" style="padding: 150px 24px 80px; text-align: center; max-width: 900px; margin: 0 auto;">
        <div>
            <h4 class="mini-title">${data.header.subtitle}</h4>
            <h1 class="main-heading" style="font-size: 4rem; margin-bottom: 20px;">${data.header.title}</h1>
            <p style="color: var(--text-muted); font-size: 1.2rem; max-width: 650px; margin: 0 auto;">${data.header.description}</p>
        </div>
    </header>

    <!-- Enterprise Solutions Section -->
    <section class="container" style="padding: 40px 24px 80px;">
        <div class="section-header center fade-in" style="margin-bottom: 40px;">
            <h4 class="mini-title">ENTERPRISE SOLUTIONS</h4>
            <h2>How we solve your biggest challenges</h2>
        </div>
        <div class="grid-2" style="gap: 30px;">
            ${data.solutions.map(s => `
            <div class="spec-card fade-in" style="padding: 40px; position: relative; overflow: hidden;">
                <div style="font-size: 2.5rem; margin-bottom: 15px;">${s.icon}</div>
                <h3 style="margin-bottom: 12px;">${s.title}</h3>
                <p style="margin-bottom: 20px; font-size: 0.95rem;">${s.desc}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${s.tags.map(t => `<span style="padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; background: var(--bg-light); border: 1px solid var(--border-light); color: var(--text-muted);">${t}</span>`).join('')}
                </div>
            </div>`).join('')}
        </div>
    </section>

    <!-- AI Agents & Automation Section -->
    <section class="container" style="padding: 40px 24px 80px;">
        <div class="section-header center fade-in" style="margin-bottom: 40px;">
            <h4 class="mini-title" style="color: #ff3366;">FUTURE-READY TECH</h4>
            <h2>AI Agents & Automation Workflows</h2>
        </div>
        <div class="grid-2" style="gap: 30px;">
            ${data.ai_agents.map(a => `
            <div class="spec-card fade-in" style="padding: 40px; position: relative; overflow: hidden; border: 1px solid rgba(255, 51, 102, 0.2); box-shadow: 0 10px 30px rgba(255, 51, 102, 0.05);">
                <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: var(--brand-gradient); filter: blur(80px); opacity: 0.15; border-radius: 50%;"></div>
                <div style="font-size: 2.5rem; margin-bottom: 15px;">${a.icon}</div>
                <h3 style="margin-bottom: 12px;">${a.title}</h3>
                <p style="margin-bottom: 20px; font-size: 0.95rem;">${a.desc}</p>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${a.tags.map(t => `<span style="padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; background: rgba(255, 51, 102, 0.1); border: 1px solid rgba(255, 51, 102, 0.2); color: #ff3366;">${t}</span>`).join('')}
                </div>
            </div>`).join('')}
        </div>
    </section>

    <!-- Detailed Service Catalog -->
    <section class="container fade-in" style="padding: 60px 24px 20px;">
        <div class="section-header center" style="margin-bottom: 50px;">
            <h4 class="mini-title">FULL SERVICE CATALOG</h4>
            <h2>36+ services across every domain</h2>
        </div>
    </section>

    ${data.service_groups.map(group => `
    <section class="service-group container fade-in" style="padding: 20px 24px 40px;">
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid var(--border-light);">
            <span style="font-size: 2rem;">${group.icon}</span>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem;">${group.group_title}</h2>
        </div>
        <div class="grid-3" style="gap: 20px;">
            ${group.services.map(s => `
            <div class="spec-card" style="padding: 25px;">
                <h3 style="font-size: 1.1rem; margin-bottom: 8px;">${s.name}</h3>
                <p style="font-size: 0.9rem;">${s.desc}</p>
            </div>`).join('')}
        </div>
    </section>`).join('')}

    
    <!-- Testimonials Section -->
    <section class="testimonials-section fade-in" style="padding: 100px 24px;">
        <div class="container">
            <div class="section-header center fade-in" style="text-align: center; margin-bottom: 60px;">
                <h4 class="mini-title">${data.testimonials.subtitle}</h4>
                <h2 style="font-size: 3rem;">${data.testimonials.title}</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px;">
                ${data.testimonials.items.map(t => `
                <div class="spec-card fade-in" style="padding: 40px 30px; display: flex; flex-direction: column; justify-content: space-between;">
                    <div>
                        <div style="color: #ffb300; font-size: 1.2rem; margin-bottom: 15px;">${'\u2605'.repeat(t.stars)}</div>
                        <p style="color: var(--text-muted); font-size: 1.05rem; line-height: 1.7; font-style: italic; margin-bottom: 25px;">\u201C${t.quote}\u201D</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px; border-top: 1px solid var(--border-light); padding-top: 20px;">
                        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--accent-color); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 1.1rem;">${t.name.charAt(0)}</div>
                        <div>
                            <div style="font-weight: 600; font-size: 1rem;">${t.name}</div>
                            <div style="color: var(--text-muted); font-size: 0.85rem;">${t.role}</div>
                        </div>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- Guarantee Section -->
    <section class="guarantee-section fade-in" style="padding: 80px 24px;">
        <div class="container">
            <div class="section-header center fade-in" style="text-align: center; margin-bottom: 50px;">
                <h2 style="font-size: 2.5rem;">${data.guarantee.title}</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
                ${data.guarantee.items.map(g => `
                <div class="spec-card fade-in" style="padding: 40px 30px; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 20px;">${g.icon}</div>
                    <h3 style="font-size: 1.3rem; margin-bottom: 12px;">${g.title}</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">${g.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="services-cta fade-in" style="padding: 80px 24px; text-align: center;">
        <div class="container" style="background: var(--bg-card); border-radius: 30px; padding: 80px 60px; border: 1px solid var(--bg-light); position: relative; overflow: hidden;">
            <div style="position: absolute; bottom: -60px; left: -60px; width: 250px; height: 250px; background: var(--brand-gradient); filter: blur(120px); opacity: 0.25; border-radius: 50%;"></div>
            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: 15px;">${data.cta.title}</h2>
            <p style="color: var(--text-muted); max-width: 550px; margin: 0 auto 30px;">${data.cta.description}</p>
            <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">${data.cta.button_text}</a>
        </div>
    </section>
    `;
}

function renderIndustries(data) {
    return `
    <header class="page-header container fade-in" style="padding: 150px 24px 80px; text-align: center; max-width: 900px; margin: 0 auto;">
        <h4 class="mini-title">${data.hero.subtitle}</h4>
        <h1 style="font-size: 4rem; margin-bottom: 25px;">${data.hero.title}</h1>
        <p style="color: var(--text-muted); font-size: 1.2rem; line-height: 1.6;">${data.hero.desc}</p>
    </header>

    <section class="container" style="padding: 60px 24px;">
        <div class="grid-2" style="gap: 40px;">
            ${data.industries.map(ind => `
            <div class="spec-card fade-in" style="padding: 50px; position: relative; border: 1px solid var(--border-light); background: var(--bg-card);">
                <div style="font-size: 3rem; margin-bottom: 20px;">${ind.icon}</div>
                <h3 style="font-size: 1.8rem; margin-bottom: 15px;">${ind.name}</h3>
                <p style="margin-bottom: 25px; color: var(--text-muted); font-size: 1rem; line-height: 1.7;">${ind.desc}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    ${ind.features.map(f => `<div style="display: flex; align-items: center; gap: 10px; font-size: 0.85rem; font-weight: 500;"><span style="color: var(--accent-color);">✔</span> ${f}</div>`).join('')}
                </div>
            </div>`).join('')}
        </div>
    </section>

    <section class="services-cta fade-in" style="padding: 100px 24px; text-align: center;">
        <div class="container" style="background: var(--bg-darker); border-radius: 40px; padding: 100px 60px; border: 1px solid var(--bg-light); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: var(--brand-gradient); filter: blur(150px); opacity: 0.2; border-radius: 50%;"></div>
            <h2 style="font-family: var(--font-heading); font-size: 3rem; margin-bottom: 20px;">${data.cta.title}</h2>
            <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 40px; font-size: 1.1rem;">${data.cta.desc}</p>
            <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">${data.cta.button_text}</a>
        </div>
    </section>
    `;
}

/* ===== SCROLL ANIMATIONS ===== */

function initAnimations() {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        
    
});
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
