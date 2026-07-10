document.addEventListener("DOMContentLoaded", async () => {
    // Bot Detection for SEO
    if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
        document.documentElement.classList.add('bot-detected');
    }

    // --- Tech Page Renderer ---
    function renderTechPage(data, pageId) {
        return `
            <!-- HERO -->
            <header class="hero" style="min-height: 50vh;">
                <div class="container hero-content center">
                    <h1 class="hero-title">${data.name} Development</h1>
                    <p class="hero-subtitle">${data.description}</p>
                    <div class="hero-cta" style="justify-content:center;">
                        <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">Book a Discovery Call</a>
                    </div>
                </div>
            </header>
            <!-- WHY TRAI -->
            <section class="container fade-in" style="padding: 80px 24px;">
                <div class="section-header">
                    <h4 class="mini-title">Why Trai Inc for ${data.name}?</h4>
                    <h2>Engineering that drives results.</h2>
                </div>
                <div style="font-size: 1.1rem; line-height: 1.8; color: var(--text-muted); max-width: 800px; margin: 0 auto; text-align: center;">
                    <p>${data.why_us}</p>
                </div>
            </section>
            <!-- USE CASES -->
            <section class="container fade-in" style="padding: 0 24px 80px;">
                <div class="section-header center">
                    <h4 class="mini-title">Common Applications</h4>
                    <h2>Where we apply ${data.name}</h2>
                </div>
                <div class="bento-grid">
                    ${data.use_cases.map((useCase, idx) => `
                        <div class="bento-card ${idx % 3 === 0 ? 'wide' : ''} fade-in">
                            <div class="bento-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">🎯</div>
                            <h3>${useCase}</h3>
                        </div>
                    `).join('')}
                </div>
            </section>
            <!-- BOTTOM CTA -->
            <section class="container fade-in" style="padding: 80px 24px; text-align: center;">
                <div class="hero-card">
                    <h2>Ready to build with ${data.name}?</h2>
                    <p style="color:var(--text-muted);margin:16px 0 32px;">Talk directly to senior engineers — no sales reps, no fluff.</p>
                    <a href="contact.html" class="btn-primary large" style="margin: 0 auto;">Start Your Project</a>
                </div>
            </section>
        `;
    }

    // --- Mobile Service Page Renderer ---
    function renderMobileServicePage(data, pageId) {
        return `
            <!-- HERO -->
            <header class="hero" style="min-height: 50vh;">
                <div class="container hero-content center">
                    <h1 class="hero-title">${data.name}</h1>
                    <p class="hero-subtitle">${data.description}</p>
                    <div class="hero-cta" style="justify-content:center;">
                        <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">Book a Discovery Call</a>
                    </div>
                </div>
            </header>
            <!-- WHY TRAI -->
            <section class="container fade-in" style="padding: 80px 24px;">
                <div class="section-header">
                    <h4 class="mini-title">Why Trai Inc for ${data.name}?</h4>
                    <h2>Engineering that drives results.</h2>
                </div>
                <div style="font-size: 1.1rem; line-height: 1.8; color: var(--text-muted); max-width: 800px; margin: 0 auto; text-align: center;">
                    <p>${data.why_us}</p>
                </div>
            </section>
            <!-- USE CASES -->
            <section class="container fade-in" style="padding: 0 24px 80px;">
                <div class="section-header center">
                    <h4 class="mini-title">Common Applications</h4>
                    <h2>Where we apply ${data.name}</h2>
                </div>
                <div class="bento-grid">
                    ${data.use_cases.map((useCase, idx) => `
                        <div class="bento-card ${idx % 3 === 0 ? 'wide' : ''} fade-in">
                            <div class="bento-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">📱</div>
                            <h3>${useCase}</h3>
                        </div>
                    `).join('')}
                </div>
            </section>
            <!-- BOTTOM CTA -->
            <section class="container fade-in" style="padding: 80px 24px; text-align: center;">
                <div class="hero-card">
                    <h2>Ready to build your ${data.name}?</h2>
                    <p style="color:var(--text-muted);margin:16px 0 32px;">Talk directly to senior engineers — no sales reps, no fluff.</p>
                    <a href="contact.html" class="btn-primary large" style="margin: 0 auto;">Start Your Project</a>
                </div>
            </section>
        `;
    }

    // Fetch and Render Dynamic Content
    const pageId = document.body.getAttribute("data-page") || "";
    const dynamicContainer = document.getElementById("content") || document.getElementById("dynamic-content");

    const servicePages = [
        'ai-agents', 'ai-automation', 'ai-voice-agents', 'cloud-devops',
        'custom-software', 'content-creation', 'cybersecurity', 'data-analytics', 'digital-marketing',
        'enterprise-platforms', 'lead-gen-scraping', 'mobile-apps', 'motion-video',
        'ui-ux-design', 'web-development', 'workflow-automation',
        'flutter-app-development', 'ecommerce-development', 'custom-crm-development', 'wordpress-cms-development',
        'ai-automation-development'
    ];

    // Only pages with a registered renderer should fetch JSON
    const renderers = {
        home: renderHome,
        pricing: renderPricing,
        about: renderAbout,
        'why-trai': renderAbout,
        'our-purpose': renderAbout,
        'hire-dedicated-developers': renderAbout,
        team: renderAbout,
        'client-reviews': renderAbout,
        'our-development-process': renderAbout,
        'engagement-models': renderAbout,
        'project-communication-strategy': renderAbout,
        solutions: renderSolutions,
        industries: renderIndustries,
        incubation: renderIncubation,
        careers: renderCareers,
        partner: renderPartner,
        contact: renderContact,
        clients: renderClients,
        startups: renderAudiencePage,
        smb: renderAudiencePage,
        enterprise: renderAudiencePage,
        msmes: renderMSME,
        'app-store': renderAppStore,
        'choosing-a-development-partner': renderTrustPage,
        privacy: renderLegal,
        terms: renderLegal,
        refund: renderLegal
    };

    servicePages.forEach(slug => {
        renderers[slug] = renderServicePage;
    });

    let renderFn = renderers[pageId];
    if (pageId.startsWith('tech-')) {
        renderFn = renderTechPage;
    }

    if (renderFn && dynamicContainer) {
        try {
            // Only fetch and re-render if the static HTML wasn't generated (i.e. if the loader is still there or it says Loading...)
            if (dynamicContainer.querySelector('.loader') || dynamicContainer.innerHTML.includes('Loading...')) {
                let fetchUrl = '';
                if (pageId.startsWith('tech-')) {
                    fetchUrl = 'data/technologies.json';
                } else {
                    fetchUrl = servicePages.includes(pageId) ? `data/services.json` : `data/${pageId}.json`;
                }

                const response = await fetch(`${fetchUrl}?v=` + new Date().getTime());
                if (!response.ok) throw new Error("Network response was not ok");
                let data = await response.json();
                
                if (pageId.startsWith('tech-')) {
                    const techId = pageId.replace('tech-', '');
                    let foundTech = null;
                    for (const cat of data.categories) {
                        const tech = cat.technologies.find(t => t.id === techId);
                        if (tech) { foundTech = tech; break; }
                    }
                    if (foundTech) {
                        data = foundTech;
                    } else {
                        throw new Error("Technology not found in technologies.json");
                    }
                } else if (pageId.startsWith('mobile-') && pageId !== 'mobile-apps') {
                    const mobileId = pageId.replace('mobile-', '');
                    let foundService = data.services.find(s => s.id === mobileId);
                    if (foundService) {
                        data = foundService;
                    } else {
                        throw new Error("Mobile service not found in mobile-services.json");
                    }
                }

                dynamicContainer.innerHTML = renderFn(data, pageId);
            }

            initAnimations();

            // --- FormSubmit Contact Form Handler ---
            const contactFormEl = document.getElementById('contactForm');
            if (contactFormEl) {
                contactFormEl.addEventListener('submit', async function(e) {
                    const budgetSelect = document.getElementById('contact-budget');
                    if (budgetSelect && budgetSelect.value === 'under-50k') {
                        e.preventDefault();
                        const name = document.getElementById('contact-name').value || '';
                        const msg = document.getElementById('contact-message').value || '';
                        const text = encodeURIComponent(`Hi Trai Inc, my name is ${name}. I'm looking for a digital solution under ₹50K. \n\nDetails: ${msg}`);
                        window.open(`https://wa.me/917905495478?text=${text}`, '_blank');
                        return;
                    }

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
    } else {
        // Static page — just init animations
        initAnimations();
    }
});

/* ===== PAGE RENDERERS ===== */

function renderFaq(faq) {
    if (!faq || !faq.items || !faq.items.length) return '';
    return `
    <!-- ════════ FAQ ════════ -->
    <section class="faq-section fade-in">
        <div class="container faq-container">
            <div class="section-header center">
                <h4 class="mini-title">${faq.subtitle}</h4>
                <h2>${faq.title}</h2>
            </div>
            <div class="faq-accordion">
                ${faq.items.map((item, i) => `
                <div class="faq-item">
                    <button type="button" class="faq-question" aria-expanded="false" aria-controls="faq-answer-${i}">
                        <span>${item.q}</span>
                        <span class="faq-chevron" aria-hidden="true">${chevronDownSvg}</span>
                    </button>
                    <div id="faq-answer-${i}" class="faq-answer" role="region">
                        <p class="faq-answer-text">${item.a}</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>
    `;
}

const chevronDownSvg = `<svg viewBox="0 0 10 6" width="10" height="6"><path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`;

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-question, .pricing-faq-question');
    if (!btn) return;
    const item = btn.closest('.faq-item, .pricing-faq-item');
    const isOpen = item.classList.contains('open');
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', String(!isOpen));
});

document.addEventListener('click', (e) => {
    const tab = e.target.closest('.service-tech-tab');
    if (!tab) return;
    const wrapper = tab.closest('.service-tech-card');
    const index = tab.dataset.tabIndex;
    wrapper.querySelectorAll('.service-tech-tab').forEach(t => t.classList.toggle('active', t.dataset.tabIndex === index));
    wrapper.querySelectorAll('.service-tech-panel').forEach(p => p.classList.toggle('active', p.dataset.panelIndex === index));
});

function renderHome(data) {
    const hero = data.hero;
    const sr = data.solutions_routing;

    return `
    <!-- ════════ HERO ════════ -->
    <section class="msme-hero home-hero">
        <div class="msme-hero-inner">
            <div>
                <div class="msme-badge">${hero.badge}</div>
                <h1>${hero.heading_line1}<br>${hero.heading_line2} <span class="gradient-word">${hero.heading_highlight}</span></h1>
                <p class="msme-hero-sub">${hero.subtitle}</p>
                <div class="hero-cta-row">
                    <a href="${hero.cta_primary.href}" target="_blank" class="btn-primary large">${hero.cta_primary.icon} ${hero.cta_primary.text}</a>
                    <a href="${hero.cta_secondary.href}" class="btn-secondary large">${hero.cta_secondary.icon} ${hero.cta_secondary.text}</a>
                </div>
                <div class="hero-trust">
                    <div class="hero-trust-avatars">
                        ${hero.trust_avatars.map((a, i) => `<span class="trust-avatar trust-avatar-${i + 1}">${a}</span>`).join('')}
                    </div>
                    <span>Trusted by <strong class="trust-count">${hero.trust_line}</strong> ${hero.trust_suffix}</span>
                </div>
            </div>
            <div class="hero-mockup">
                <div class="mockup-main">
                    <div class="mockup-bar"><span></span><span></span><span></span></div>
                    <div class="mockup-metrics">
                        ${hero.mockup_metrics.map(m => `
                        <div class="mockup-metric">
                            <div class="mockup-metric-label">${m.icon} ${m.label}</div>
                            <div class="mockup-metric-value ${m.color}">${m.value}</div>
                        </div>`).join('')}
                    </div>
                    <div class="mockup-chart"></div>
                </div>
                ${hero.float_cards.map((fc, i) => `
                <div class="float-card float-card-${i + 1}">
                    <div class="fc-icon">${fc.icon}</div>
                    <div class="fc-label">${fc.label}</div>
                    <div class="fc-value ${fc.active ? 'fc-value-active' : ''}">${fc.value}</div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ SOLUTIONS ROUTING (moved up — audience self-select right after hero) ════════ -->
    <section id="solutions" class="bento-section home-section-tight">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${sr.subtitle}</h4>
                <h2>${sr.title}</h2>
            </div>
            <div class="home-bento-grid">
                ${sr.cards.map(c => `
                <div class="home-bento-card fade-in">
                    <div class="home-bento-icon">${c.icon}</div>
                    <div class="home-bento-title">${c.title}</div>
                    <div class="home-bento-desc">${c.desc}</div>
                    <a href="${c.link}" class="home-bento-link">${c.link_text}</a>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ OUR WORK (merged case studies + portfolio, text-only, no broken images) ════════ -->
    <section class="content-section fade-in home-section-shaded home-section-bordered-top">
        <div class="container">
            <div class="section-header center">
                <h4 class="mini-title">${data.case_studies.subtitle}</h4>
                <h2>${data.case_studies.title}</h2>
            </div>
            <div class="grid-3 home-grid-spaced">
                ${data.case_studies.studies.map(s => `
                <div class="spec-card fade-in home-accent-card" style="--card-accent: ${s.color};">
                    <p class="home-accent-eyebrow">${s.client}</p>
                    <h3 class="home-card-title">${s.title}</h3>
                    <p class="home-card-body">${s.impact}</p>
                    <div class="home-tag-row">
                        ${s.tags.map(t => `<span class="home-tag">${t}</span>`).join('')}
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ CORE EXPERTISE ════════ -->
    <section class="bento-section fade-in">
        <div class="container">
            <div class="section-header center">
                <h4 class="mini-title">${data.expertise.subtitle}</h4>
                <h2>${data.expertise.title}</h2>
            </div>
            <div class="bento-grid">
                ${data.expertise.cards.map(c => `
                <div class="bento-card ${c.wide ? 'wide' : ''} fade-in home-accent-top" style="--card-accent: ${c.color};">
                    <div class="bento-icon home-accent-icon" style="--card-accent: ${c.color};">${c.icon}</div>
                    <h3 class="bento-title">${c.title}</h3>
                    <p class="bento-desc">${c.desc}</p>
                    <div class="feature-pills home-pills-tight">
                        ${c.tags.map(t => `<div class="feature-pill">${t}</div>`).join('')}
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ ANTI-AGENCY MANIFESTO ════════ -->
    <section class="bento-section fade-in home-section-shaded home-section-bordered-bottom">
        <div class="container">
            <div class="section-header center">
                <h4 class="mini-title">${data.anti_agency.subtitle}</h4>
                <h2>${data.anti_agency.title}</h2>
            </div>
            <div class="grid-3 home-grid-tight">
                ${data.anti_agency.cards.map(c => `
                <div class="spec-card fade-in home-compare-card">
                    <div class="home-compare-icon">${c.icon}</div>
                    <h3 class="home-compare-title">${c.title}</h3>
                    <div class="home-compare-row">
                        <strong class="home-compare-label home-compare-us">✅ Trai Inc</strong>
                        <p class="home-compare-text">${c.us}</p>
                    </div>
                    <div>
                        <strong class="home-compare-label home-compare-them">❌ Traditional Agencies</strong>
                        <p class="home-compare-text home-compare-text-muted">${c.them}</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ DELIVERY PROCESS ════════ -->
    <section class="compare-section fade-in">
        <div class="container">
            <div class="section-header center">
                <h4 class="mini-title">${data.process.subtitle}</h4>
                <h2>${data.process.title}</h2>
            </div>
            <div class="grid-3 home-grid-spaced">
                ${data.process.steps.map(s => `
                <div class="spec-card fade-in home-process-card">
                    <div class="home-process-number" style="--card-accent: ${s.color};">${s.number}</div>
                    <h3 class="home-card-title">${s.title}</h3>
                    <p class="home-card-body home-card-body-muted">${s.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    ${renderFaq(data.faq)}

    <!-- ════════ GRAND CTA ════════ -->
    <section class="grand-cta fade-in">
        <div class="container">
            <div class="grand-cta-inner">
                <h2>${data.cta.title}</h2>
                <p>${data.cta.description}</p>
                <a href="${data.cta.button_href}" target="_blank" class="btn-primary large">${data.cta.button_text}</a>
            </div>
        </div>
    </section>
    `;
}

function renderAbout(data) {
    return `
    <header class="page-header about-header">
        <h4 class="mini-title fade-in">${data.header.subtitle}</h4>
        <h1 class="main-heading fade-in about-header-title">${data.header.title}</h1>
        <p class="fade-in about-header-intro">${data.intro.text}</p>
    </header>

    <!-- Numbers bar -->
    <section class="about-numbers-section">
        <div class="container">
            <div class="about-numbers-row">
                ${data.numbers.stats.map(s => `
                <div class="fade-in">
                    <h3 class="about-numbers-value">${s.value}</h3>
                    <p class="about-numbers-label">${s.label}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- Team section -->
    <section id="team" class="container about-team-section">
        <div class="section-header center fade-in">
            <h4 class="mini-title">${data.team.subtitle}</h4>
            <h2>${data.team.title}</h2>
        </div>
        <div class="grid-3 fade-in about-grid-spaced">
            ${data.team.members.map(m => `
            <div class="spec-card text-center about-team-card">
                <div class="about-team-avatar">
                    <img src="${m.image}" alt="${m.name}" class="about-team-avatar-img">
                </div>
                <h3 class="about-team-name">${m.name}</h3>
                <p class="about-team-role">${m.role}</p>
            </div>`).join('')}
        </div>
    </section>

    <!-- How We Work -->
    <section class="about-section-shaded">
        <div class="container">
            <div class="section-header center fade-in about-model-header">
                <h4 class="mini-title">${data.model.subtitle}</h4>
                <h2 class="about-model-title">${data.model.title}</h2>
                <p class="about-model-desc">${data.model.description}</p>
            </div>
            <div class="about-model-grid">
                ${data.model.advantages.map(a => `
                <div class="spec-card fade-in about-advantage-card">
                    <div class="about-advantage-icon">${a.icon}</div>
                    <h3 class="about-advantage-title">${a.title}</h3>
                    <p class="about-advantage-desc">${a.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- Expertise -->
    <section class="about-section-plain">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.expertise.subtitle}</h4>
                <h2>${data.expertise.title}</h2>
            </div>
            <div class="about-expertise-grid">
                ${data.expertise.areas.map(a => `
                <div class="spec-card fade-in about-expertise-card">
                    <div class="about-expertise-icon">${a.icon}</div>
                    <div>
                        <h3 class="about-expertise-title">${a.title}</h3>
                        <p class="about-expertise-desc">${a.desc}</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- Timeline -->
    <section class="about-section-shaded">
        <div class="container about-timeline-container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.timeline.subtitle}</h4>
                <h2>${data.timeline.title}</h2>
            </div>
            <div class="about-timeline-track">
                ${data.timeline.milestones.map(m => `
                <div class="fade-in about-timeline-item">
                    <div class="about-timeline-dot"></div>
                    <span class="about-timeline-year">${m.year}</span>
                    <h3 class="about-timeline-title">${m.title}</h3>
                    <p class="about-timeline-desc">${m.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- Incubation -->
    <section class="about-section-narrow">
        <div class="container about-incubation-container">
            <div class="fade-in">
                <h4 class="mini-title">${data.incubation.subtitle}</h4>
                <h2 class="about-incubation-title">${data.incubation.title}</h2>
                <p class="about-incubation-text">${data.incubation.text}</p>
            </div>
        </div>
    </section>

    ${renderFaq(data.faq)}

    <!-- CTA -->
    <section class="about-section-plain">
        <div class="container">
            <div class="spec-card fade-in about-cta-card">
                <div class="about-cta-glow"></div>
                <h2 class="about-cta-title">${data.cta.title}</h2>
                <p class="about-cta-desc">${data.cta.description}</p>
                <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large about-cta-btn">${data.cta.button_text}</a>
            </div>
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
            <div class="spec-card fade-in" style="padding: 80px 60px; text-align: center; border-radius: 30px; position: relative; overflow: hidden; margin-bottom: 40px;">
                <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: var(--brand-gradient); filter: blur(150px); opacity: 0.15; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -80px; left: -80px; width: 250px; height: 250px; background: var(--accent-glow); filter: blur(120px); opacity: 0.2; border-radius: 50%;"></div>
                <h2 style="font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 20px; position: relative;">${data.cta.title}</h2>
                <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 40px; font-size: 1.1rem; line-height: 1.7; position: relative;">${data.cta.description}</p>
                <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large" style="position: relative;">${data.cta.button_text}</a>
            </div>
            
            ${data.external_cta ? `
            <div class="spec-card fade-in" style="padding: 60px 40px; text-align: center; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2);">
                <h3 style="font-family: var(--font-heading); font-size: 2rem; margin-bottom: 15px;">${data.external_cta.title}</h3>
                <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 30px; font-size: 1rem; line-height: 1.6;">${data.external_cta.description}</p>
                <a href="${data.external_cta.button_href}" target="_blank" rel="noopener" class="btn-secondary">${data.external_cta.button_text}</a>
            </div>
            ` : ''}
        </div>
    </section>
    `;
}

function renderCareers(data) {
    return `
    <header class="page-header container fade-in careers-header">
        <h4 class="mini-title">${data.header.subtitle}</h4>
        <h1 class="careers-header-title">${data.header.title}</h1>
        <p class="careers-header-desc">${data.header.description}</p>
    </header>

    <section class="container fade-in careers-section">
        <h2 class="careers-section-title">${data.values.title}</h2>
        <div class="careers-values-grid">
            ${data.values.items.map(v => `
            <div class="spec-card fade-in careers-value-card">
                <div class="careers-value-icon">${v.icon}</div>
                <h3 class="careers-value-title">${v.title}</h3>
                <p class="careers-value-desc">${v.desc}</p>
            </div>`).join('')}
        </div>
    </section>

    <section class="container fade-in careers-section-loose">
        <h4 class="mini-title careers-centered">${data.benefits.title}</h4>
        <div class="careers-benefits-grid">
            ${data.benefits.items.map(b => `
            <div class="spec-card fade-in careers-benefit-card">
                <div class="careers-benefit-icon">${b.icon}</div>
                <h4 class="careers-benefit-title">${b.title}</h4>
                <p class="careers-benefit-desc">${b.desc}</p>
            </div>`).join('')}
        </div>
    </section>

    <section class="container fade-in careers-section-loose">
        <h4 class="mini-title careers-centered">${data.openings.title}</h4>

        ${data.openings.sections.map(section => `
        <div class="careers-opening-block">
            <div class="careers-opening-header">
                <h2 class="careers-opening-category">${section.category}</h2>
                <p class="careers-opening-subtitle">${section.subtitle}</p>
            </div>

            <div class="careers-jobs-grid">
                ${section.jobs.map(job => `
                <div class="spec-card fade-in careers-job-card">
                    <div>
                        <h3 class="careers-job-title">${job.title}</h3>
                        <div class="careers-job-tags">
                            <span class="careers-job-tag">${job.location}</span>
                            <span class="careers-job-tag">${job.type}</span>
                        </div>
                        <p class="careers-job-desc">${job.desc}</p>
                    </div>
                </div>`).join('')}
            </div>

            <div class="careers-apply-row">
                <a href="${section.apply_link}" target="_blank" class="btn-primary large">${section.apply_text}</a>
            </div>
        </div>`).join('')}
    </section>
    `;
}
function renderPartner(data) {
    return `
    <!-- Hero -->
    <header class="page-header partner-header">
        <h4 class="mini-title fade-in">${data.header.subtitle}</h4>
        <h1 class="main-heading fade-in partner-header-title">${data.header.title}</h1>
        <p class="fade-in partner-header-desc">${data.header.description}</p>
    </header>

    <!-- Why Partner -->
    <section class="partner-why-section">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.why.subtitle}</h4>
                <h2>${data.why.title}</h2>
            </div>
            <div class="grid-3 fade-in partner-grid-spaced">
                ${data.why.points.map(p => `
                <div class="spec-card partner-point-card">
                    <div class="partner-point-icon">${p.icon}</div>
                    <h3 class="partner-point-title">${p.title}</h3>
                    <p class="partner-point-desc">${p.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- Partnership Models -->
    <section class="container partner-section-wide">
        <div class="section-header center fade-in">
            <h4 class="mini-title">${data.programs.subtitle}</h4>
            <h2>${data.programs.title}</h2>
        </div>
        <div class="grid-3 fade-in partner-grid-spaced">
            ${data.programs.tiers.map(t => `
            <div class="spec-card partner-tier-card" style="--card-accent: ${t.color};">
                <div class="partner-tier-icon">${t.icon}</div>
                <h3 class="partner-tier-title">${t.title}</h3>
                <p class="partner-tier-ideal">IDEAL FOR: ${t.ideal_for}</p>
                <p class="partner-tier-desc">${t.desc}</p>
                <ul class="partner-tier-benefits">
                    ${t.benefits.map(b => `
                    <li class="partner-tier-benefit">
                        <span class="partner-tier-check">✓</span>
                        <span class="partner-tier-benefit-text">${b}</span>
                    </li>`).join('')}
                </ul>
            </div>`).join('')}
        </div>
    </section>

    <!-- Ideal Partners -->
    <section class="partner-ideal-section">
        <div class="container fade-in partner-ideal-card">
            <div class="section-header center">
                <h4 class="mini-title">${data.ideal_partners.subtitle}</h4>
                <h2>${data.ideal_partners.title}</h2>
            </div>
            <ul class="partner-ideal-list">
                ${data.ideal_partners.list.map(item => `
                <li class="partner-ideal-item">
                    <span class="partner-ideal-icon">🎯</span>
                    <span class="partner-ideal-text">${item}</span>
                </li>`).join('')}
            </ul>
        </div>
    </section>

    <!-- How It Works -->
    <section class="container partner-section-wide">
        <div class="section-header center fade-in">
            <h4 class="mini-title">${data.process.subtitle}</h4>
            <h2>${data.process.title}</h2>
        </div>
        <div class="grid-3 fade-in partner-grid-spaced">
            ${data.process.steps.map(s => `
            <div class="spec-card partner-step-card">
                <div class="partner-step-number-bg" style="--card-accent: ${s.color};">${s.number}</div>
                <h3 class="partner-step-title">
                    <span class="partner-step-badge" style="--card-accent: ${s.color};">${s.number}</span>
                    ${s.title}
                </h3>
                <p class="partner-step-desc">${s.desc}</p>
            </div>`).join('')}
        </div>
    </section>

    <!-- CTA -->
    <section class="partner-cta-section">
        <div class="container fade-in partner-cta-inner">
            <h2 class="partner-cta-title">${data.cta.title}</h2>
            <p class="partner-cta-desc">${data.cta.description}</p>
            <div class="partner-cta-buttons">
                <a href="${data.cta.button_href}" target="_blank" class="btn-primary">${data.cta.button_text}</a>
                <a href="${data.cta.whatsapp_href}" target="_blank" class="whatsapp-btn">${data.cta.whatsapp_text}</a>
            </div>
        </div>
    </section>
    `;
}

function renderContact(data) {
    return `
    <!-- ═══ HERO ═══ -->
    <section class="cf-hero-wrapper contact-hero-wrapper">
        <div class="cf-bg-text-container" aria-hidden="true" role="presentation">
            <div class="cf-bg-text outline">CONTACT</div>
            <div class="cf-bg-text filled">CONTACT</div>
            <div class="cf-bg-text outline">CONTACT</div>
        </div>

        <div class="cf-grid-layer" aria-hidden="true" role="presentation">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
                        <circle cx="60" cy="60" r="2" fill="rgba(79, 172, 254, 0.4)" />
                        <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(79, 172, 254, 0.05)" stroke-width="1" stroke-dasharray="4 4"/>
                        <path d="M 0 120 L 120 0" fill="none" stroke="rgba(79, 172, 254, 0.05)" stroke-width="1" stroke-dasharray="4 4"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        <div class="cf-floating-cards-layer" aria-hidden="true" role="presentation">
            <div class="cf-glass-card anim-slow contact-glass-card-1">📧</div>
            <div class="cf-glass-card anim-medium contact-glass-card-2">📞</div>
            <div class="cf-glass-card anim-fast contact-glass-card-3">📍</div>
            <div class="cf-glass-card anim-slow contact-glass-card-4">💬</div>
        </div>

        <div class="cf-hero-content fade-in">
            <div class="biz-badge contact-hero-badge">${data.hero.badge}</div>
            <h1 class="contact-hero-title">${data.hero.title}</h1>
            <p class="contact-hero-desc">${data.hero.description}</p>
        </div>
    </section>

    <!-- ═══ CONTACT SPLIT SECTION ═══ -->
    <section class="container fade-in contact-split-section">
        <div class="contact-split">

            <!-- Left Column — Contact Info -->
            <div class="contact-info-card">
                <h3>${data.info.title}</h3>

                ${data.info.items.map(item => `
                    <div class="contact-detail">
                        <div class="contact-detail-icon">${item.icon}</div>
                        <div class="contact-detail-text">
                            <h4>${item.label}</h4>
                            <p>${item.value}</p>
                        </div>
                    </div>
                `).join('')}

                <a href="${data.info.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="whatsapp-btn">
                    ${data.info.whatsapp_text}
                </a>
            </div>

            <!-- Right Column — Booking & WhatsApp -->
            <div class="contact-form-card contact-form-card-flex">
                <div class="contact-book-block">
                    <h3 class="contact-book-title">Book a Consultation</h3>
                    <p class="contact-book-desc">Schedule a 30-minute scoping call directly on our calendar. No sales pitch, just a technical discussion.</p>
                    <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" rel="noopener noreferrer" class="btn-primary large contact-book-btn">
                        📅 Book on Google Calendar
                    </a>
                </div>

                <div class="contact-divider">
                    <span class="contact-divider-label">OR</span>
                    <hr class="contact-divider-line">
                </div>

                <div class="contact-chat-block">
                    <h3 class="contact-chat-title">Chat Immediately</h3>
                    <p class="contact-chat-desc">Prefer texting? Reach out directly to our founders on WhatsApp for a quick response.</p>
                    <a href="https://wa.me/917905495478?text=Hi%20Trai%20Inc,%20I'm%20looking%20for%20a%20digital%20solution%20for%20my%20business." target="_blank" rel="noopener noreferrer" class="whatsapp-btn contact-chat-btn">
                        💬 Start WhatsApp Chat
                    </a>
                </div>
            </div>

        </div>
    </section>

    <!-- ═══ DETAILED FORM SECTION ═══ -->
    <section class="container fade-in contact-form-section">
        <div class="contact-form-wrapper">
            <div class="contact-form-header">
                <h3 class="contact-form-title">${data.form.title}</h3>
                <p class="contact-form-note">${data.form.note}</p>
            </div>
            <form id="contactForm" action="https://formsubmit.co/hello@traiinc.com" method="POST" class="contact-form">
                <!-- Hide captcha -->
                <input type="hidden" name="_captcha" value="false">
                <input type="hidden" name="_next" value="https://traiinc.com/contact.html?success=true">

                <div class="contact-form-row">
                    ${data.form.fields.slice(0, 2).map(f => `
                        <div class="contact-field">
                            <label for="${f.id}" class="contact-field-label">${f.label} ${f.required ? '<span class="contact-required">*</span>' : ''}</label>
                            <input type="${f.type}" id="${f.id}" name="${f.name}" placeholder="${f.placeholder}" ${f.required ? 'required' : ''} class="contact-field-input">
                        </div>
                    `).join('')}
                </div>
                <div class="contact-form-row">
                    ${data.form.fields.slice(2, 4).map(f => `
                        <div class="contact-field">
                            <label for="${f.id}" class="contact-field-label">${f.label} ${f.required ? '<span class="contact-required">*</span>' : ''}</label>
                            <input type="${f.type}" id="${f.id}" name="${f.name}" placeholder="${f.placeholder}" ${f.required ? 'required' : ''} class="contact-field-input">
                        </div>
                    `).join('')}
                </div>

                <div class="contact-field">
                    <label for="${data.form.budget.id}" class="contact-field-label">${data.form.budget.label} <span class="contact-required">*</span></label>
                    <select id="${data.form.budget.id}" name="${data.form.budget.name}" required class="contact-field-input contact-field-select">
                        ${data.form.budget.options.map(opt => `
                            <option value="${opt.value}" ${opt.disabled ? 'disabled' : ''} ${opt.selected ? 'selected' : ''}>${opt.label}</option>
                        `).join('')}
                    </select>
                </div>

                <div class="contact-field">
                    <label for="${data.form.message.id}" class="contact-field-label">${data.form.message.label} <span class="contact-required">*</span></label>
                    <textarea id="${data.form.message.id}" name="${data.form.message.name}" placeholder="${data.form.message.placeholder}" required class="contact-field-input contact-field-textarea"></textarea>
                </div>

                <button type="submit" class="btn-primary large contact-submit-btn">${data.form.button}</button>
            </form>
        </div>
    </section>

    <!-- ═══ MAP SECTION ═══ -->
    <section class="contact-map-section">
        <div class="container contact-map-container">
            <div class="contact-map-frame-wrap">
                <iframe
                    data-mock-src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.1873668357084!2d81.00383977498238!3d26.865787576675164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be3476bea2077%3A0x38da389b84f7126b!2sTrai%20Inc!5e0!3m2!1sen!2sin!4v1783671039319!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    class="contact-map-iframe"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="strict-origin-when-cross-origin">
                </iframe>
            </div>
        </div>
    </section>

    <!-- ═══ GRAND CTA ═══ -->
    <section class="grand-cta fade-in">
        <div class="container">
            <div class="grand-cta-inner">
                <h2>${data.grand_cta.title}</h2>
                <p>${data.grand_cta.description}</p>
                <a href="${data.grand_cta.url}" target="_blank" class="btn-primary contact-grand-cta-btn">${data.grand_cta.button_text}</a>
            </div>
        </div>
    </section>
    `;
}
function renderSolutions(data) {
    return `
    <header class="page-header container fade-in solutions-header">
        <div>
            <h4 class="mini-title">${data.header.subtitle}</h4>
            <h1 class="main-heading solutions-header-title">${data.header.title}</h1>
            <p class="solutions-header-desc">${data.header.description}</p>
        </div>
    </header>

    <!-- Enterprise Solutions Section -->
    <section class="container solutions-section">
        <div class="section-header center fade-in solutions-section-header">
            <h4 class="mini-title">ENTERPRISE SOLUTIONS</h4>
            <h2>How we solve your biggest challenges</h2>
        </div>
        <div class="grid-2 solutions-grid-gap">
            ${data.solutions.map(s => `
            <div class="spec-card fade-in solutions-card">
                <div class="solutions-card-icon">${s.icon}</div>
                <h3 class="solutions-card-title">${s.title}</h3>
                <p class="solutions-card-desc">${s.desc}</p>
                <div class="solutions-tag-row">
                    ${s.tags.map(t => `<span class="solutions-tag">${t}</span>`).join('')}
                </div>
            </div>`).join('')}
        </div>
    </section>

    <!-- AI Agents & Automation Section -->
    <section class="container solutions-section">
        <div class="section-header center fade-in solutions-section-header">
            <h4 class="mini-title solutions-accent-title">FUTURE-READY TECH</h4>
            <h2>AI Agents & Automation Workflows</h2>
        </div>
        <div class="grid-2 solutions-grid-gap">
            ${data.ai_agents.map(a => `
            <div class="spec-card fade-in solutions-accent-card">
                <div class="solutions-accent-glow"></div>
                <div class="solutions-card-icon">${a.icon}</div>
                <h3 class="solutions-card-title">${a.title}</h3>
                <p class="solutions-card-desc">${a.desc}</p>
                <div class="solutions-tag-row">
                    ${a.tags.map(t => `<span class="solutions-accent-tag">${t}</span>`).join('')}
                </div>
            </div>`).join('')}
        </div>
    </section>

    <!-- Detailed Service Catalog -->
    <section class="container fade-in solutions-catalog-header">
        <div class="section-header center solutions-catalog-header-inner">
            <h4 class="mini-title">FULL SERVICE CATALOG</h4>
            <h2>36+ services across every domain</h2>
        </div>
    </section>

    ${data.service_groups.map(group => `
    <section class="service-group container fade-in solutions-group-section">
        <div class="solutions-group-header">
            <span class="solutions-group-icon">${group.icon}</span>
            <h2 class="solutions-group-title">${group.group_title}</h2>
        </div>
        <div class="grid-3 solutions-group-grid">
            ${group.services.map(s => `
            <div class="spec-card solutions-service-card">
                <h3 class="solutions-service-name">${s.name}</h3>
                <p class="solutions-service-desc">${s.desc}</p>
            </div>`).join('')}
        </div>
    </section>`).join('')}

    <section class="services-cta fade-in solutions-cta-section">
        <div class="container solutions-cta-inner">
            <div class="solutions-cta-glow"></div>
            <h2 class="solutions-cta-title">${data.cta.title}</h2>
            <p class="solutions-cta-desc">${data.cta.description}</p>
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
            <div id="${ind.id}" class="spec-card fade-in" style="padding: 50px; position: relative; border: 1px solid var(--border-light); background: var(--bg-card); scroll-margin-top: 100px;">
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

function renderClients(data) {
    return `
    <header class="page-header clients-header">
        <h4 class="mini-title fade-in">OUR CLIENTS</h4>
        <h1 class="main-heading fade-in clients-header-title">Trusted by 138+ Businesses</h1>
        <p class="fade-in clients-header-desc">From local MSMEs to enterprise operations, we've delivered scalable solutions across 12+ industries.</p>
    </header>

    <section class="clients-stats-section">
        <div class="container">
            <div class="clients-stats-row">
                ${data.stats.map(s => `
                <div class="fade-in">
                    <h3 class="clients-stats-value">${s.value}</h3>
                    <p class="clients-stats-label">${s.label}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="clients-categories-section">
        <div class="container">
            ${data.categories.map(c => `
            <div class="fade-in clients-category">
                <div class="clients-category-header">
                    <div class="clients-category-icon" style="--icon-bg: linear-gradient(135deg, ${c.color}, ${c.color2});">${c.icon}</div>
                    <h2 class="clients-category-label">${c.label}</h2>
                </div>
                <div class="clients-logo-row">
                    ${c.logoClients ? c.logoClients.map(lc => `
                        <div class="clients-logo-chip clients-logo-chip-named">${lc.name}</div>
                    `).join('') : ''}
                    ${c.clients ? c.clients.map(client => `
                        <div class="clients-logo-chip">${client}</div>
                    `).join('') : ''}
                </div>
            </div>`).join('')}
        </div>
    </section>
    `;
}

function renderAudiencePage(data) {
    const { hero, feature_pills, services, industries, cta } = data;
    
    // Set custom properties for accent colors on the document root
    if (hero.accent_colors) {
        document.documentElement.style.setProperty('--cf-accent-1', hero.accent_colors.primary);
        document.documentElement.style.setProperty('--cf-accent-2', hero.accent_colors.secondary);
    }

    let complianceHtml = '';
    if (data.compliance && data.compliance.items && data.compliance.items.length > 0) {
        complianceHtml = `
        <section class="container fade-in content-section">
            <div class="section-header">
                <h4 class="mini-title">${data.compliance.subtitle}</h4>
                <h2>${data.compliance.title}</h2>
            </div>
            <div class="bento-grid">
                ${data.compliance.items.map(item => `
                    <div class="bento-card fade-in">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        `;
    }

    let enterpriseCtaHtml = '';
    if (data.enterprise_cta) {
        const ec = data.enterprise_cta;
        enterpriseCtaHtml = `
        <section class="container fade-in content-section">
            <div class="biz-cta">
                <div class="biz-cta-glow"></div>
                <h2>${ec.title}</h2>
                <p>${ec.description}</p>
                <div class="hero-cta-row">
                    <a href="mailto:${ec.email}?subject=${encodeURIComponent(ec.subject)}" class="btn-primary large">✉️ ${ec.email}</a>
                </div>
                ${ec.process ? `
                <div class="enterprise-process-grid">
                    ${ec.process.map((step, i) => `
                        <div class="enterprise-process-step">
                            <div class="enterprise-process-step-label">Step ${i + 1}</div>
                            <div class="enterprise-process-step-text">${step}</div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </section>
        `;
    }

    let industriesHtml = '';
    if (industries && industries.length > 0) {
        industriesHtml = `
        <section class="container fade-in content-section">
            <div class="section-header">
                <h4 class="mini-title">INDUSTRIES</h4>
                <h2>Where we excel</h2>
            </div>
            <div class="bento-grid">
                ${industries.map(ind => `
                    <div class="bento-card fade-in">
                        <div class="bento-icon">${ind.icon}</div>
                        <h3>${ind.title}</h3>
                        <p>${ind.desc}</p>
                        <div class="audience-industry-features">
                            ${ind.features ? ind.features.map(f => `<div>✓ ${f}</div>`).join('') : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        `;
    }

    let proofHtml = '';
    if (data.proof && data.proof.studies && data.proof.studies.length > 0) {
        proofHtml = `
        <section class="content-section fade-in home-section-shaded home-section-bordered-top">
            <div class="container">
                <div class="section-header center">
                    <h4 class="mini-title">${data.proof.subtitle}</h4>
                    <h2>${data.proof.title}</h2>
                </div>
                <div class="grid-3 home-grid-spaced">
                    ${data.proof.studies.map(s => `
                    <div class="spec-card fade-in home-accent-card" style="--card-accent: ${s.color};">
                        <p class="home-accent-eyebrow">${s.client}</p>
                        <h3 class="home-card-title">${s.title}</h3>
                        <p class="home-card-body">${s.impact}</p>
                        <div class="home-tag-row">
                            ${s.tags.map(t => `<span class="home-tag">${t}</span>`).join('')}
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>
        `;
    }

    return `
        <!-- HERO -->
        <section class="msme-hero">
            <div class="msme-hero-inner">
                <div>
                    <div class="msme-badge">${hero.page_label}</div>
                    <h1>${hero.title}</h1>
                    <p class="msme-hero-sub">${hero.subtitle}</p>
                    <div class="hero-cta-row">
                        <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">📅 Book a Free Consultation</a>
                    </div>
                    <div class="hero-trust">
                        <div class="hero-trust-avatars">
                            ${hero.trust.avatars.map((av, i) => `<span class="trust-avatar trust-avatar-${i+1}">${av}</span>`).join('')}
                        </div>
                        <span>Trusted by <strong class="trust-count">${hero.trust.count}</strong></span>
                    </div>
                </div>
                <div class="hero-mockup">
                    <div class="mockup-main">
                        <div class="mockup-bar"><span></span><span></span><span></span></div>
                        <div class="mockup-metrics">
                            ${hero.mockup.metrics.map(m => `
                                <div class="mockup-metric">
                                    <div class="mockup-metric-label">${m.label}</div>
                                    <div class="mockup-metric-value ${m.color || ''}">${m.value}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mockup-chart"></div>
                    </div>
                    ${hero.mockup.cards.map((c, i) => `
                        <div class="float-card float-card-${i+1}">
                            <div class="fc-icon">${c.icon}</div>
                            <div class="fc-label">${c.label}</div>
                            <div class="fc-value ${c.active ? 'fc-value-active' : ''}">${c.value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- FEATURE PILLS -->
        <section class="container fade-in section-pills">
            <div class="feature-pills">
                ${feature_pills.map(pill => `<div class="feature-pill">${pill}</div>`).join('')}
            </div>
        </section>

        <!-- PROOF -->
        ${proofHtml}

        <!-- SERVICES -->
        <section class="container fade-in content-section">
            <div class="section-header">
                <h4 class="mini-title">${services.subtitle}</h4>
                <h2>${services.title}</h2>
            </div>
            <div class="bento-grid">
                ${services.items.map((item, index) => `
                    <div class="bento-card ${index === 0 || index === 3 ? 'wide' : ''} fade-in">
                        <div class="bento-icon">${item.icon}</div>
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- INDUSTRIES -->
        ${industriesHtml}

        <!-- COMPLIANCE -->
        ${complianceHtml}

        <!-- ENTERPRISE CTA -->
        ${enterpriseCtaHtml}

        <!-- CTA -->
        <section class="container fade-in biz-cta-section">
            <div class="biz-cta">
                <div class="biz-cta-glow"></div>
                <h2>${cta.title}</h2>
                <p>${cta.description}</p>
                <div class="hero-cta-row">
                    <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">${cta.button_text}</a>
                    <a href="contact.html" class="btn-secondary large">✉️ Send a Message</a>
                </div>
            </div>
        </section>
    `;
}

function renderMSME(data) {
    return `
        <!-- HERO -->
        <section class="msme-hero">
            <div class="msme-hero-inner">
                <div class="fade-in">
                    <div class="msme-badge">${data.hero.badge}</div>
                    <h1>${data.hero.title}</h1>
                    <p class="msme-hero-sub">${data.hero.subtitle}</p>
                    <div class="hero-cta-row">
                        <a href="${data.hero.cta.primary.url}" ${data.hero.cta.primary.url.startsWith('http') ? 'target="_blank"' : ''} class="btn-primary large">${data.hero.cta.primary.text}</a>
                        <a href="${data.hero.cta.secondary.url}" ${data.hero.cta.secondary.url.startsWith('http') ? 'target="_blank"' : ''} class="btn-secondary large">${data.hero.cta.secondary.text}</a>
                    </div>
                    <div class="hero-trust">
                        <div class="hero-trust-avatars">
                            ${data.hero.trust.avatars.map((av, i) => `<span class="trust-avatar trust-avatar-${i+1}">${av}</span>`).join('')}
                        </div>
                        <span>Trusted by <strong class="trust-count">${data.hero.trust.count}</strong> across India</span>
                    </div>
                </div>

                <!-- Floating Dashboard Mockup -->
                <div class="hero-mockup fade-in">
                    <div class="mockup-main">
                        <div class="mockup-bar"><span></span><span></span><span></span></div>
                        <div class="mockup-metrics">
                            ${data.hero.mockup.metrics.map(m => `
                                <div class="mockup-metric">
                                    <div class="mockup-metric-label">${m.label}</div>
                                    <div class="mockup-metric-value ${m.color || ''}">${m.value}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="mockup-chart"></div>
                    </div>
                    ${data.hero.mockup.cards.map((c, i) => `
                        <div class="float-card float-card-${i+1}">
                            <div class="fc-icon">${c.icon}</div>
                            <div class="fc-label">${c.label}</div>
                            <div class="fc-value ${c.active ? 'fc-value-active' : ''}">${c.value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- FEATURE PILLS -->
        <section class="container fade-in msme-section-tight-top">
            <h2 class="msme-section-heading">What We Offer for MSMEs</h2>
            <div class="feature-pills">
                ${data.feature_pills.map(pill => `<div class="feature-pill">${pill}</div>`).join('')}
            </div>
        </section>

        <!-- BENTO SERVICE GRID -->
        <section class="container fade-in msme-section-loose-top">
            <div class="section-header">
                <h4 class="mini-title">${data.services.subtitle}</h4>
                <h2>${data.services.title}</h2>
            </div>
            <div class="bento-grid">
                ${data.services.items.map((item, idx) => `
                    <div class="bento-card ${idx === 0 || idx === 3 ? 'wide' : ''} fade-in">
                        <div class="bento-icon msme-icon-dynamic" style="--icon-bg: ${item.icon_gradient};">${item.icon}</div>
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <!-- OLD WAY vs TRAI WAY -->
        <section class="compare-section fade-in">
            <div class="container">
                <div class="section-header center">
                    <h4 class="mini-title">${data.comparison.subtitle}</h4>
                    <h2>${data.comparison.title}</h2>
                </div>
                <div class="compare-grid">
                    <div class="compare-col compare-old">
                        <h3>${data.comparison.old_way.title}</h3>
                        ${data.comparison.old_way.items.map(i => `<div class="compare-item"><span class="ci-icon">❌</span> ${i}</div>`).join('')}
                    </div>
                    <div class="compare-vs"><span>VS</span></div>
                    <div class="compare-col compare-new">
                        <h3>${data.comparison.new_way.title}</h3>
                        ${data.comparison.new_way.items.map(i => `<div class="compare-item"><span class="ci-icon">✅</span> ${i}</div>`).join('')}
                    </div>
                </div>
            </div>
        </section>

        <!-- CLIENTS -->
        <section class="container fade-in msme-section-wide">
            <div class="clients-heading">
                <h2>
                    <span class="slash-deco"><span></span><span></span><span></span></span>
                    ${data.clients.title}
                    <span class="slash-deco"><span></span><span></span><span></span></span>
                </h2>
                <p>${data.clients.subtitle}</p>
            </div>

            ${data.clients.categories.map(cat => `
                <div class="cat-section fade-in">
                    <div class="section-divider">
                        <span class="cat-icon">${cat.icon}</span>
                        <h3>${cat.title}</h3>
                        <div class="section-divider-line"></div>
                        <span class="client-count">${cat.count}</span>
                    </div>
                    <div class="logo-grid">
                        ${cat.logos.map(l => `
                            <div class="logo-card">
                                <div class="logo-avatar msme-icon-dynamic" style="--icon-bg: ${l.gradient};">${l.initials}</div>
                                <div class="logo-name">${l.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}

            <div class="msme-spacer-bottom"></div>
        </section>

        <!-- MSME BUNDLES -->
        <section class="bento-section fade-in msme-section-card-bg msme-section-bordered-bottom">
            <div class="container">
                <div class="section-header center">
                    <h4 class="mini-title">${data.bundles.subtitle}</h4>
                    <h2>${data.bundles.title}</h2>
                </div>
                <div class="grid-3 msme-grid-loose">
                    ${data.bundles.tiers.map(tier => `
                    <div class="pricing-tier fade-in ${tier.popular ? 'popular' : ''}">
                        ${tier.popular ? '<div class="pricing-tier-badge">MOST POPULAR</div>' : ''}
                        <h3 class="pricing-tier-name">${tier.name}</h3>
                        <div class="pricing-tier-price">${tier.price}</div>
                        <p class="pricing-tier-desc">${tier.desc}</p>
                        <ul class="pricing-tier-features">
                            ${tier.features.map(f => `
                            <li class="pricing-tier-feature">
                                <span class="pricing-tier-feature-check">✔</span>
                                <span>${f}</span>
                            </li>
                            `).join('')}
                        </ul>
                        <a href="https://wa.me/917905495478?text=Hi%20Trai%20Inc,%20I'm%20interested%20in%20the%20${encodeURIComponent(tier.name)}%20bundle." target="_blank" class="btn-primary pricing-tier-cta">Get Started</a>
                    </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- INLINE COST ESTIMATOR -->
        <section id="estimator" class="estimator-section fade-in">
            <div class="container">
                <div class="estimator-card">
                    <div class="estimator-left">
                        <h4 class="mini-title">${data.estimator.subtitle}</h4>
                        <h2>${data.estimator.title}</h2>
                        <p>${data.estimator.desc}</p>
                        <div class="msme-estimator-bullets">
                            ${data.estimator.bullets.map(b => `
                                <div class="msme-estimator-bullet">
                                    <span class="msme-estimator-check">✔</span> ${b}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <form id="estimatorForm" class="estimator-form" action="https://formsubmit.co/hello@traiinc.com" method="POST">
                            <input type="hidden" name="_subject" value="New MSME Cost Estimate from TraiInc.com">
                            <input type="hidden" name="_captcha" value="false">
                            <input type="hidden" name="_template" value="table">
                            <input type="hidden" name="_next" value="https://traiinc.com/msmes.html#estimator">
                            <input type="text" name="_honey" class="msme-honeypot">

                            <label>What do you need built?</label>
                            <select id="calcType" name="service_type" required>
                                ${data.estimator.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                            </select>

                            <label>Do you need user logins?</label>
                            <select id="calcLogin" name="needs_login" required>
                                <option value="no">No</option>
                                <option value="yes">Yes (+₹20K)</option>
                            </select>

                            <label>Your Name</label>
                            <input type="text" name="name" required placeholder="Your name">

                            <label>WhatsApp Number</label>
                            <input type="tel" name="phone" required placeholder="+91 XXXXX XXXXX">

                            <button type="button" class="btn-primary large msme-btn-block" onclick="calculateEstimate()">Calculate Estimate</button>
                        </form>

                        <div id="estimateResult" class="estimator-result">
                            <h3 id="estimatePrice">₹0</h3>
                            <p>Estimated starting cost. We'll WhatsApp you a detailed quote!</p>
                            <button type="submit" form="estimatorForm" class="btn-primary msme-btn-spaced">📩 Send Me the Quote</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- CASE STUDIES -->
        <section class="msme-section-shaded-wide">
            <div class="container fade-in">
                <div class="section-header center">
                    <h4 class="mini-title">${data.success_stories.subtitle}</h4>
                    <h2>${data.success_stories.title}</h2>
                </div>
                <div class="cases-grid">
                    ${data.success_stories.items.map(cs => `
                        <div class="case-card-v2 fade-in">
                            <div class="case-client">${cs.client}</div>
                            <h3>${cs.title}</h3>
                            <p><strong>Problem:</strong> ${cs.problem}</p>
                            <p><strong>Solution:</strong> ${cs.solution}</p>
                            <div>${cs.tags.map(t => `<span class="case-tag">${t}</span>`).join('')}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <!-- GRAND CTA -->
        <section class="grand-cta fade-in">
            <div class="container">
                <div class="grand-cta-inner">
                    <h2>${data.grand_cta.title}</h2>
                    <p>${data.grand_cta.description}</p>
                    <a href="${data.grand_cta.url}" target="_blank" class="btn-primary large">${data.grand_cta.button_text}</a>
                </div>
            </div>
        </section>
    `;
}

function renderServicePage(data, slug) {
    const service = data[slug];
    if (!service) return `<div class="container" style="padding: 100px 0; text-align: center;"><h2>Service Not Found</h2></div>`;

    const firstTech = Array.isArray(service.tech_stack)
        ? service.tech_stack[0]
        : (service.tech_stack && service.tech_stack.categories ? service.tech_stack.categories[0].tools[0] : '');

    const primaryHref = (service.cta && service.cta.primary_href) || 'contact.html';
    const primaryLabel = (service.cta && service.cta.button_text) || 'Discuss Your Project';

    let statsHtml = '';
    if (service.stats && service.stats.length > 0) {
        statsHtml = `
        <section class="service-stats-section">
            <div class="container service-stats-row">
                ${service.stats.map(s => `
                <div class="fade-in">
                    <h3 class="service-stats-value">${s.value}</h3>
                    <p class="service-stats-label">${s.label}</p>
                </div>`).join('')}
            </div>
        </section>
        `;
    }

    let techStackHtml = '';
    if (Array.isArray(service.tech_stack)) {
        techStackHtml = `
            <div class="service-tech-tags">
                ${service.tech_stack.map(tech => `<span class="blog-tag service-tech-tag">${tech}</span>`).join('')}
            </div>
        `;
    } else if (service.tech_stack && service.tech_stack.categories) {
        techStackHtml = `
            <div class="service-tech-tabs" role="tablist">
                ${service.tech_stack.categories.map((cat, i) => `
                    <button type="button" class="service-tech-tab ${i === 0 ? 'active' : ''}" role="tab" data-tab-index="${i}">${cat.name}</button>
                `).join('')}
            </div>
            <div class="service-tech-panels">
                ${service.tech_stack.categories.map((cat, i) => `
                    <div class="service-tech-panel ${i === 0 ? 'active' : ''}" data-panel-index="${i}">
                        ${cat.tools.map(tool => `<span class="blog-tag service-tech-tag">${tool}</span>`).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    let benefitsHtml = '';
    if (service.benefits && service.benefits.items && service.benefits.items.length > 0) {
        benefitsHtml = `
        <section class="bento-section fade-in content-section">
            <div class="section-header center service-section-header">
                <h4 class="mini-title service-mini-title">${service.benefits.subtitle}</h4>
                <h2 class="service-section-h2">${service.benefits.title}</h2>
            </div>
            <div class="bento-grid">
                ${service.benefits.items.map(b => `
                    <div class="bento-card">
                        <h3 class="bento-title">${b.title}</h3>
                        <p class="bento-desc">${b.desc}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        `;
    }

    let whyUsHtml = '';
    if (service.why_us && service.why_us.items && service.why_us.items.length > 0) {
        whyUsHtml = `
        <section class="bento-section fade-in content-section home-section-shaded home-section-bordered-top home-section-bordered-bottom">
            <div class="section-header center service-section-header">
                <h4 class="mini-title service-mini-title">${service.why_us.subtitle}</h4>
                <h2 class="service-section-h2">${service.why_us.title}</h2>
            </div>
            <div class="bento-grid">
                ${service.why_us.items.map(w => `
                    <div class="bento-card">
                        <h3 class="bento-title">${w.title}</h3>
                        <p class="bento-desc">${w.desc}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        `;
    }

    let industriesHtml = '';
    if (service.industries && service.industries.items && service.industries.items.length > 0) {
        industriesHtml = `
        <section class="bento-section fade-in content-section">
            <div class="section-header center service-section-header">
                <h4 class="mini-title service-mini-title">${service.industries.subtitle}</h4>
                <h2 class="service-section-h2">${service.industries.title}</h2>
            </div>
            <div class="bento-grid">
                ${service.industries.items.map(ind => `
                    <div class="bento-card">
                        <h3 class="bento-title">${ind.title}</h3>
                        <p class="bento-desc">${ind.desc}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        `;
    }

    let appPricingHtml = '';
    if (service.app_pricing && service.app_pricing.tiers && service.app_pricing.tiers.length > 0) {
        appPricingHtml = `
        <section class="bento-section fade-in content-section home-section-shaded home-section-bordered-top home-section-bordered-bottom">
            <div class="section-header center service-section-header">
                <h2 class="service-section-h2">${service.app_pricing.title}</h2>
            </div>
            <div class="grid-3 home-grid-spaced">
                ${service.app_pricing.tiers.map(t => `
                    <div class="pricing-tier">
                        <h3 class="pricing-tier-name">${t.name}</h3>
                        <div class="pricing-tier-price">${t.price}</div>
                        <p class="service-pricing-timeline">${t.timeline}</p>
                        <p class="pricing-tier-desc">${t.includes}</p>
                        <p class="service-pricing-best-for"><strong>Best for:</strong> ${t.best_for}</p>
                    </div>
                `).join('')}
            </div>
        </section>
        `;
    }

    let faqHtml = '';
    if (service.faq && service.faq.length > 0) {
        faqHtml = renderFaq({ subtitle: 'QUESTIONS & ANSWERS', title: 'Frequently Asked Questions', items: service.faq });
    }

    return `
    <!-- ════════ HERO ════════ -->
    <section class="msme-hero">
        <div class="msme-hero-inner">
            <div>
                <div class="msme-badge">${service.badge}</div>
                <h1>${service.title}</h1>
                <p class="msme-hero-sub">${service.subtitle}</p>
                <div class="hero-cta-row">
                    <a href="${primaryHref}" ${primaryHref.startsWith('http') ? 'target="_blank"' : ''} class="btn-primary large">📅 ${primaryLabel}</a>
                    ${service.cta && service.cta.secondary_href ? `<a href="${service.cta.secondary_href}" target="_blank" class="btn-secondary large">${service.cta.secondary_text || 'Contact Us'}</a>` : ''}
                </div>
            </div>
            <div class="hero-mockup">
                <div class="mockup-main">
                    <div class="mockup-bar"><span></span><span></span><span></span></div>
                    <div class="mockup-metrics">
                        <div class="mockup-metric">
                            <div class="mockup-metric-label">⚡ Deployment Speed</div>
                            <div class="mockup-metric-value green">2x Faster</div>
                        </div>
                        <div class="mockup-metric">
                            <div class="mockup-metric-label">🛡️ Reliability</div>
                            <div class="mockup-metric-value">99.9%</div>
                        </div>
                    </div>
                </div>
                <div class="float-card float-card-1">
                    <div class="fc-icon">${service.icon}</div>
                    <div class="fc-label">Tech Stack</div>
                    <div class="fc-value fc-value-active">${firstTech}</div>
                </div>
            </div>
        </div>
    </section>

    <!-- STATS -->
    ${statsHtml}

    <!-- CORE SOLUTIONS -->
    <section class="bento-section fade-in content-section">
        <div class="section-header center service-section-header">
            <h4 class="mini-title service-mini-title">CAPABILITIES</h4>
            <h2 class="service-section-h2">Core Features</h2>
        </div>
        <div class="bento-grid">
            ${service.features.map(f => `
                <div class="bento-card service-feature-card" ${f.id ? `id="${f.id}"` : ''} style="--card-accent: ${f.color};">
                    <div class="bento-icon service-feature-icon" style="--card-accent: ${f.color};">${f.icon}</div>
                    <h3 class="bento-title">${f.title}</h3>
                    <p class="bento-desc">${f.desc}</p>
                </div>
            `).join('')}
        </div>
    </section>

    <!-- PROOF -->
    ${service.proof && service.proof.studies && service.proof.studies.length > 0 ? `
    <section class="content-section fade-in home-section-shaded home-section-bordered-top">
        <div class="container">
            <div class="section-header center">
                <h4 class="mini-title">${service.proof.subtitle}</h4>
                <h2>${service.proof.title}</h2>
            </div>
            <div class="grid-3 home-grid-spaced">
                ${service.proof.studies.map(s => `
                <div class="spec-card fade-in home-accent-card" style="--card-accent: ${s.color};">
                    <p class="home-accent-eyebrow">${s.client}</p>
                    <h3 class="home-card-title">${s.title}</h3>
                    <p class="home-card-body">${s.impact}</p>
                    <div class="home-tag-row">
                        ${s.tags.map(t => `<span class="home-tag">${t}</span>`).join('')}
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- TECH STACK & USE CASES -->
    <section class="container fade-in service-tech-section">
        <div class="service-tech-grid">
            <div class="service-tech-card">
                <h3 class="service-tech-card-title">Tech Stack</h3>
                ${techStackHtml}
            </div>
            <div class="service-tech-card">
                <h3 class="service-tech-card-title">Use Cases</h3>
                <ul class="service-use-cases-list">
                    ${service.use_cases.map(uc => `<li class="service-use-case-item"><span class="service-use-case-check">✓</span>${uc}</li>`).join('')}
                </ul>
            </div>
        </div>
    </section>

    <!-- BENEFITS -->
    ${benefitsHtml}

    <!-- WHY US -->
    ${whyUsHtml}

    <!-- INDUSTRIES -->
    ${industriesHtml}

    <!-- APP PRICING -->
    ${appPricingHtml}

    <!-- DELIVERY PROCESS -->
    <section class="compare-section fade-in content-section">
        <div class="container">
            <div class="section-header center service-section-header">
                <h4 class="mini-title service-mini-title">THE METHODOLOGY</h4>
                <h2 class="service-section-h2">How We Deliver Quality</h2>
            </div>
            <div class="process-grid">
                ${service.process.map(p => `
                    <div class="process-card">
                        <div class="process-number">${p.number}</div>
                        <h3>${p.title}</h3>
                        <p>${p.desc}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- FAQ -->
    ${faqHtml}

    <!-- GRAND CTA -->
    <section class="grand-cta fade-in">
        <div class="container">
            <div class="grand-cta-inner">
                <h2>${service.cta.title}</h2>
                <p>${service.cta.description}</p>
                <a href="${primaryHref}" ${primaryHref.startsWith('http') ? 'target="_blank"' : ''} class="btn-primary service-grand-cta-btn">${primaryLabel}</a>
                ${service.cta.secondary_href ? `<a href="${service.cta.secondary_href}" target="_blank" class="btn-secondary service-grand-cta-btn">${service.cta.secondary_text || 'Contact Us'}</a>` : (service.cta.pricing_url ? `<a href="${service.cta.pricing_url}" class="btn-secondary service-grand-cta-btn">💰 See Pricing</a>` : '')}
            </div>
        </div>
    </section>
    `;
}

function renderAppStore(data) {
    const ts = data.trust_signals || {};
    return `
    <header class="page-header appstore-header">
        <h4 class="mini-title fade-in">${data.header.subtitle}</h4>
        <h1 class="main-heading fade-in appstore-header-title">${data.header.title}</h1>
        <p class="fade-in appstore-callout">${data.positioning_callout}</p>
    </header>

    <!-- Trust Signals -->
    <section class="container fade-in appstore-trust-section">
        <div class="appstore-trust-grid">
            <div class="spec-card appstore-trust-card">
                <div class="appstore-trust-row">
                    <span class="appstore-trust-icon">📱</span>
                    <p class="appstore-trust-text">${ts.publishing || ''}</p>
                </div>
            </div>
            <div class="spec-card appstore-trust-card">
                <div class="appstore-trust-row">
                    <span class="appstore-trust-icon">📦</span>
                    <p class="appstore-trust-text">${ts.source_code || ''}</p>
                </div>
            </div>
            <div class="spec-card appstore-trust-card">
                <div class="appstore-trust-row">
                    <span class="appstore-trust-icon">💳</span>
                    <p class="appstore-trust-text">${ts.payments || ''}</p>
                </div>
            </div>
            <div class="spec-card appstore-trust-card">
                <div class="appstore-trust-row">
                    <span class="appstore-trust-icon">🔧</span>
                    <p class="appstore-trust-text">${ts.maintenance || ''}</p>
                </div>
            </div>
        </div>
        <p class="appstore-trust-footnote">Read our full <a href="choosing-a-development-partner.html" class="appstore-trust-link">due-diligence checklist</a> for more detail on each commitment.</p>
    </section>

    <section class="container appstore-apps-section">
        <div class="appstore-apps-list">
            ${data.apps.map(app => `
            <div class="spec-card fade-in appstore-app-card">
                <div class="appstore-app-header">
                    <div class="appstore-app-info">
                        <h2 class="appstore-app-name">${app.name}</h2>
                        <p class="appstore-app-desc">${app.description}</p>
                    </div>
                </div>

                <h3 class="appstore-tiers-title">Pricing & Delivery Options</h3>
                <div class="appstore-tiers-grid">
                    ${app.tiers.map(tier => `
                    <div class="appstore-tier-card">
                        <h4 class="appstore-tier-name">${tier.name}</h4>
                        <div class="appstore-tier-price">${tier.price}</div>
                        <ul class="appstore-tier-features">
                            ${tier.features.map(f => `<li class="appstore-tier-feature"><span class="appstore-tier-check">✓</span> ${f}</li>`).join('')}
                        </ul>
                    </div>`).join('')}
                </div>
                <div class="appstore-app-cta">
                     <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary">Discuss Requirements</a>
                </div>
            </div>
            `).join('')}
        </div>
    </section>
    `;
}

function renderLegal(data) {
    return `
    <header class="page-header legal-header">
        <h4 class="mini-title fade-in">${data.subtitle}</h4>
        <h1 class="main-heading fade-in legal-title">${data.title}</h1>
        <p class="fade-in legal-effective">Last updated: ${data.effective_date}</p>
    </header>

    <section class="container fade-in legal-body">
        ${data.intro ? `<p class="legal-intro">${data.intro}</p>` : ''}
        ${data.sections.map(s => `
            <div class="legal-section">
                <h2 class="legal-section-title">${s.heading}</h2>
                ${s.body.map(p => `<p class="legal-para">${p}</p>`).join('')}
                ${s.list ? `<ul class="legal-list">${s.list.map(li => `<li>${li}</li>`).join('')}</ul>` : ''}
            </div>
        `).join('')}
        <div class="legal-contact">
            <p>${data.contact}</p>
        </div>
    </section>
    `;
}

function renderTrustPage(data) {
    return `
    <header class="page-header trust-header">
        <h4 class="mini-title fade-in">${data.header.subtitle}</h4>
        <h1 class="main-heading fade-in trust-header-title">${data.header.title}</h1>
        <p class="fade-in trust-header-intro">${data.intro}</p>
    </header>

    <section class="container trust-checklist-section">
        <div class="trust-checklist-list">
            ${data.checklist.map((item, i) => `
            <div class="spec-card fade-in trust-checklist-card">
                <div class="trust-checklist-header">
                    <span class="trust-checklist-icon">${item.icon}</span>
                    <h2 class="trust-checklist-principle">${item.principle}</h2>
                </div>
                <div class="trust-checklist-what">
                    <h3 class="trust-checklist-label">What to check</h3>
                    <p class="trust-checklist-what-text">${item.what_to_check}</p>
                </div>
                <div class="trust-checklist-answer">
                    <h3 class="trust-checklist-label trust-checklist-label-accent">How Trai Inc. does it</h3>
                    <p class="trust-checklist-answer-text">${item.trai_answer}</p>
                </div>
            </div>
            `).join('')}
        </div>
    </section>

    <section class="container fade-in trust-closing-section">
        <div class="spec-card trust-closing-card">
            <h2 class="trust-closing-title">${data.closing.title}</h2>
            <p class="trust-closing-text">${data.closing.text}</p>
            <div class="trust-closing-buttons">
                <a href="${data.closing.cta_link}" target="_blank" class="btn-primary">${data.closing.cta_text}</a>
                <a href="app-store.html" class="btn-primary trust-closing-btn-outline">View App Pricing</a>
                <a href="solutions.html" class="btn-primary trust-closing-btn-outline">View Custom Solutions</a>
            </div>
        </div>
    </section>
    `;
}

function renderPricing(data) {
    return `
    <section class="cf-hero-wrapper pricing-hero-wrapper">
        <div class="cf-bg-text-container" aria-hidden="true">
            <div class="cf-bg-text outline">PRICING</div>
            <div class="cf-bg-text filled">PRICING</div>
            <div class="cf-bg-text outline">PRICING</div>
        </div>
        <div class="cf-grid-layer" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
                        <circle cx="60" cy="60" r="2" fill="rgba(79, 172, 254, 0.4)" />
                        <path d="M 120 0 L 0 0 0 120" fill="none" stroke="rgba(79, 172, 254, 0.05)" stroke-width="1" stroke-dasharray="4 4"/>
                        <path d="M 0 120 L 120 0" fill="none" stroke="rgba(79, 172, 254, 0.05)" stroke-width="1" stroke-dasharray="4 4"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
        <div class="cf-hero-content fade-in">
            <div class="biz-badge pricing-hero-badge">${data.hero.badge}</div>
            <h1 class="pricing-hero-title">${data.hero.title}</h1>
            <p class="pricing-hero-desc">${data.hero.description}</p>
        </div>
    </section>

    <section class="container fade-in pricing-section">
        <div class="section-header pricing-section-header">
            <h2 class="pricing-section-title">${data.pricing_tiers.title}</h2>
            <p class="pricing-section-desc">${data.pricing_tiers.description}</p>
        </div>

        <div class="pricing-grid">
            ${data.pricing_tiers.tiers.map(tier => `
                <div ${tier.id ? `id="${tier.id}"` : ''} class="pricing-card ${tier.highlight ? 'pricing-card-highlight' : ''}">
                    ${tier.highlight ? '<div class="pricing-card-badge">Most Popular</div>' : ''}
                    <h3 class="pricing-card-name">${tier.name}</h3>
                    <div class="pricing-card-price">${tier.price}</div>
                    <p class="pricing-card-desc">${tier.description}</p>
                    <ul class="pricing-card-features">
                        ${tier.features.map(f => `
                            <li class="pricing-card-feature">
                                <span class="pricing-card-feature-check">✓</span>
                                <span class="pricing-card-feature-text">${f}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="section-header pricing-section-header">
            <h2 class="pricing-section-title">${data.engagement_models.title}</h2>
        </div>

        <div class="models-grid">
            ${data.engagement_models.models.map(model => `
                <div class="model-card">
                    <div class="model-card-icon">${model.icon}</div>
                    <h3 class="model-card-title">${model.title}</h3>
                    <p class="model-card-desc">${model.description}</p>
                    <div class="model-card-footer">
                        <strong class="model-card-footer-label">Best for:</strong> <span class="model-card-footer-text">${model.best_for}</span>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="section-header pricing-section-header">
            <h2 class="pricing-section-title">${data.faq.title}</h2>
        </div>

        <div class="faq-grid pricing-faq-grid">
            ${data.faq.questions.map((q, i) => `
                <div class="pricing-faq-item">
                    <button type="button" class="pricing-faq-question" aria-expanded="false" aria-controls="pricing-faq-answer-${i}">
                        <span class="pricing-faq-q">${q.q}</span>
                        <span class="faq-chevron" aria-hidden="true">${chevronDownSvg}</span>
                    </button>
                    <div id="pricing-faq-answer-${i}" class="pricing-faq-answer">
                        <p class="pricing-faq-a">${q.a}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    </section>

    <!-- GRAND CTA -->
    <section class="grand-cta fade-in pricing-grand-cta">
        <div class="container">
            <div class="grand-cta-box">
                <div class="grand-cta-bg"></div>
                <div class="grand-cta-content">
                    <h2>${data.cta.title}</h2>
                    <p>${data.cta.description}</p>
                    <a href="${data.cta.url}" target="_blank" rel="noopener noreferrer" class="btn-primary large">
                        ${data.cta.button_text}
                    </a>
                </div>
            </div>
        </div>
    </section>
    `;
}
