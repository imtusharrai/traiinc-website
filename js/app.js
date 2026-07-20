document.addEventListener("DOMContentLoaded", async () => {
    // Bot Detection for SEO
    if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
        document.documentElement.classList.add('bot-detected');
    }

    // --- Tech Page Renderer ---
    function renderTechPage(data, pageId) {
        return `
            <!-- HERO -->
            <header class="hero hero-half">
                <div class="container hero-content center">
                    <h1 class="hero-title">${data.name} Development</h1>
                    <p class="hero-subtitle">${data.description}</p>
                    <div class="hero-cta justify-center">
                        <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">Book a Discovery Call</a>
                    </div>
                </div>
            </header>
            <!-- WHY TRAI -->
            <section class="container fade-in section-pad">
                <div class="section-header">
                    <h4 class="mini-title">Why Trai Inc for ${data.name}?</h4>
                    <h2>Engineering that drives results.</h2>
                </div>
                <div class="tech-why-text">
                    <p>${data.why_us}</p>
                </div>
            </section>
            <!-- USE CASES -->
            <section class="container fade-in section-pad-bottom">
                <div class="section-header center">
                    <h4 class="mini-title">Common Applications</h4>
                    <h2>Where we apply ${data.name}</h2>
                </div>
                <div class="bento-grid">
                    ${data.use_cases.map((useCase, idx) => `
                        <div class="bento-card ${idx % 3 === 0 ? 'wide' : ''} fade-in">
                            <div class="bento-icon brand-gradient-bg">🎯</div>
                            <h3 class="bento-title">${useCase}</h3>
                        </div>
                    `).join('')}
                </div>
            </section>
            <!-- BOTTOM CTA -->
            <section class="container fade-in section-pad text-center">
                <div class="hero-card">
                    <h2>Ready to build with ${data.name}?</h2>
                    <p class="tech-cta-desc">Talk directly to senior engineers — no sales reps, no fluff.</p>
                    <a href="contact.html" class="btn-primary large mx-auto">Start Your Project</a>
                </div>
            </section>
        `;
    }

    // --- Mobile Service Page Renderer ---
    function renderMobileServicePage(data, pageId) {
        return `
            <!-- HERO -->
            <header class="hero hero-half">
                <div class="container hero-content center">
                    <h1 class="hero-title">${data.name}</h1>
                    <p class="hero-subtitle">${data.description}</p>
                    <div class="hero-cta justify-center">
                        <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">Book a Discovery Call</a>
                    </div>
                </div>
            </header>
            <!-- WHY TRAI -->
            <section class="container fade-in section-pad">
                <div class="section-header">
                    <h4 class="mini-title">Why Trai Inc for ${data.name}?</h4>
                    <h2>Engineering that drives results.</h2>
                </div>
                <div class="tech-why-text">
                    <p>${data.why_us}</p>
                </div>
            </section>
            <!-- USE CASES -->
            <section class="container fade-in section-pad-bottom">
                <div class="section-header center">
                    <h4 class="mini-title">Common Applications</h4>
                    <h2>Where we apply ${data.name}</h2>
                </div>
                <div class="bento-grid">
                    ${data.use_cases.map((useCase, idx) => `
                        <div class="bento-card ${idx % 3 === 0 ? 'wide' : ''} fade-in">
                            <div class="bento-icon brand-gradient-bg">📱</div>
                            <h3 class="bento-title">${useCase}</h3>
                        </div>
                    `).join('')}
                </div>
            </section>
            <!-- BOTTOM CTA -->
            <section class="container fade-in section-pad text-center">
                <div class="hero-card">
                    <h2>Ready to build your ${data.name}?</h2>
                    <p class="tech-cta-desc">Talk directly to senior engineers — no sales reps, no fluff.</p>
                    <a href="contact.html" class="btn-primary large mx-auto">Start Your Project</a>
                </div>
            </section>
        `;
    }
    // --- Case Study Page Renderer ---
    function renderCaseStudy(data, pageId) {
        // Build tab headers
        const tabs = [
            { id: 'introduction', label: 'Introduction' },
            { id: 'challenge', label: 'The Challenge' },
            { id: 'solution', label: 'The Solution' },
            { id: 'results', label: 'The Results' },
            { id: 'learn-more', label: 'Learn More' }
        ];

        let tabsHtml = `<div class="case-study-tabs" role="tablist">`;
        tabs.forEach((t, i) => {
            tabsHtml += `<button class="case-study-tab ${i === 0 ? 'active' : ''}" role="tab" aria-selected="${i === 0}" aria-controls="tab-${t.id}" data-target="tab-${t.id}">${t.label}</button>`;
        });
        tabsHtml += `</div>`;

        // Build tab panels
        let panelsHtml = `<div class="case-study-panels">`;
        
        // Introduction
        panelsHtml += `
            <div id="tab-introduction" class="case-study-panel active" role="tabpanel">
                <div class="panel-content">
                    <p class="lead-text">${data.tabs.introduction.text}</p>
                </div>
            </div>`;
            
        // Challenge
        panelsHtml += `
            <div id="tab-challenge" class="case-study-panel" role="tabpanel" hidden>
                <div class="panel-content">
                    <p>${data.tabs.challenge.text}</p>
                </div>
            </div>`;

        // Solution
        panelsHtml += `
            <div id="tab-solution" class="case-study-panel" role="tabpanel" hidden>
                <div class="panel-content">
                    <p>${data.tabs.solution.text}</p>
                </div>
            </div>`;

        // Results
        panelsHtml += `
            <div id="tab-results" class="case-study-panel" role="tabpanel" hidden>
                <div class="panel-content">
                    <p>${data.tabs.results.text}</p>
                </div>
            </div>`;

        // Learn More
        panelsHtml += `
            <div id="tab-learn-more" class="case-study-panel" role="tabpanel" hidden>
                <div class="panel-content learn-more-cards">
                    ${data.learnMore.map(item => `
                        <a href="${item.link}" class="learn-more-card">
                            <span class="learn-more-card__title">${item.name}</span>
                            <span class="learn-more-card__arrow">→</span>
                        </a>
                    `).join('')}
                </div>
            </div>`;

        panelsHtml += `</div>`;

        return `
            <!-- CASE STUDY HERO -->
            <header class="hero case-study-hero section-pad-lg">
                <div class="container hero-content center">
                    <span class="mini-title mb-4 inline-block">CASE STUDIES</span>
                    <h1 class="hero-title text-6xl mb-4">Engineering that solves real business problems.</h1>
                    <p class="hero-subtitle">A closer look at what we've built.</p>
                </div>
            </header>

            <section class="case-study-body fade-in">
                <div class="container max-w-1000">
                    
                    <div class="case-study-cover mb-10">
                        <img src="${data.hero.image}" alt="${data.hero.title} showcase" class="w-full rounded-3xl shadow-image" />
                    </div>

                    <div class="case-study-header mb-12 text-left">
                        <span class="mini-title mb-3 inline-block">${data.hero.tag}</span>
                        <h2 class="text-4xl leading-tight">${data.hero.title}</h2>
                    </div>

                    <div class="case-study-tabs-container">
                        ${tabsHtml}
                        ${panelsHtml}
                    </div>

                </div>
            </section>

            <!-- CLOSING CTA -->
            <section class="content-section center section-pad-lg border-t-light">
                <div class="container">
                    <h2 class="mb-8">Have a project in mind?</h2>
                    <a href="contact.html" class="btn btn-primary">Book a Free Consultation &rarr;</a>
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
        'bhu-master': renderCaseStudy,
        workezy: renderCaseStudy,
        home: renderHome,
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
        blog: renderBlog,
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
                const caseStudyPages = ['bhu-master', 'workezy', 'dashak-pharma', 'om-group'];
                
                if (pageId.startsWith('tech-')) {
                    fetchUrl = 'data/technologies.json';
                } else if (caseStudyPages.includes(pageId)) {
                    fetchUrl = 'data/case-studies.json';
                } else {
                    fetchUrl = servicePages.includes(pageId) ? `data/services.json` : `data/${pageId}.json`;
                }

                const response = await fetch(`${fetchUrl}?v=` + new Date().getTime());
                if (!response.ok) throw new Error("Network response was not ok");
                let data = await response.json();
                
                if (caseStudyPages.includes(pageId)) {
                    data = data[pageId];
                }
                
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

            // Initialize 3D TRAI Bot on home page
            if (pageId === 'home' && window.TraiBot) {
                setTimeout(() => {
                    window.TraiBot.init('#traibot-container');
                }, 100);
            }

            // --- Case Study Tab Logic ---
            const caseStudyTabs = document.querySelectorAll('.case-study-tab');
            if (caseStudyTabs.length > 0) {
                caseStudyTabs.forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        // Deactivate all tabs and panels
                        document.querySelectorAll('.case-study-tab').forEach(t => {
                            t.classList.remove('active');
                            t.setAttribute('aria-selected', 'false');
                        });
                        document.querySelectorAll('.case-study-panel').forEach(p => {
                            p.hidden = true;
                            p.classList.remove('active');
                        });
                        
                        // Activate clicked tab
                        const targetId = tab.getAttribute('data-target');
                        tab.classList.add('active');
                        tab.setAttribute('aria-selected', 'true');
                        
                        // Activate target panel
                        const panel = document.getElementById(targetId);
                        if (panel) {
                            panel.hidden = false;
                            // small delay for css transition if needed
                            setTimeout(() => { panel.classList.add('active'); }, 10);
                        }
                    });
                });
            }

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
                            body: new FormData(contactFormEl)
                        });
                        if (response.ok) {
                            result.style.display = 'block';
                            result.style.color = 'var(--neon-green)';
                            result.innerHTML = '\u2705 Message sent! We\'ll get back within 24 hours. Check your inbox for a confirmation.';
                            contactFormEl.reset();
                        } else {
                            const data = await response.json().catch(() => ({}));
                            result.style.display = 'block';
                            result.style.color = 'var(--accent-color)';
                            result.textContent = data.error || 'Something went wrong. Please try again.';
                        }
                    } catch (err) {
                        result.style.display = 'block';
                        result.style.color = 'var(--accent-color)';
                        result.textContent = 'Network error. Please try again.';
                    }
                    btn.disabled = false;
                    btn.textContent = 'Send Message';
                });
            }

        } catch (error) {
            dynamicContainer.innerHTML = `<div class="container section-pad text-center">
                    <h2>Error loading content. Please run this via a local server (e.g. VSCode Live Server).</h2>
                    <p class="text-muted mt-3">${error.message}</p>
                </div>`;
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

const audienceIcons = {
    device: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>`,
    chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="12" width="3" height="8"/><rect x="11" y="7" width="3" height="13"/><rect x="16" y="15" width="3" height="5"/></svg>`,
    pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>`,
    spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>`,
    cloud: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 18a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.6 1.7A4 4 0 0 0 6.5 18h10.5z"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    "chart-up": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 17 9 11 13 15 21 6"/><polyline points="15 6 21 6 21 12"/></svg>`,
    building: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18"/><line x1="8" y1="8" x2="8" y2="8.01"/><line x1="12" y1="8" x2="12" y2="8.01"/><line x1="16" y1="8" x2="16" y2="8.01"/><line x1="8" y1="12" x2="8" y2="12.01"/><line x1="12" y1="12" x2="12" y2="12.01"/><line x1="16" y1="12" x2="16" y2="12.01"/><line x1="9" y1="21" x2="9" y2="16"/><line x1="15" y1="21" x2="15" y2="16"/></svg>`,
    database: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>`,
    users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 6L2 7"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
    map: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>`,
    bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="8.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/><circle cx="6.5" cy="12.5" r="1.5" fill="currentColor" stroke="none"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.8 1.7-1.7 0-.4-.2-.8-.4-1.1-.3-.3-.4-.7-.4-1.1 0-.9.8-1.7 1.7-1.7H17c2.8 0 5-2.2 5-5 0-5.5-4.5-9.5-10-9.5z"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`
};

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

document.addEventListener('click', (e) => {
    const tab = e.target.closest('.audience-tab-btn');
    if (!tab) return;
    const wrapper = tab.closest('.audience-finder');
    const id = tab.dataset.audienceTab;
    wrapper.querySelectorAll('.audience-tab-btn').forEach(t => {
        const active = t.dataset.audienceTab === id;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
    });
    wrapper.querySelectorAll('.audience-panel').forEach(p => p.classList.toggle('active', p.dataset.audiencePanel === id));
});

function renderHome(data) {
    const hero = data.hero;
    const un = data.un_agency;
    const cap = data.capabilities;
    const sb = data.services_banner;
    const proof = data.proof;
    const conv = data.conversion;
    const af = data.audience_finder;

    return `
    <!-- ════════ HERO — AI AGENTS SHOWCASE ════════ -->
    <section class="hero-cosmos" id="hero-cosmos">
        <div id="traibot-container"></div>

        <!-- Content Layer -->
        <div class="hero-cosmos-content">
            <p class="hero-cosmos-eyebrow">Trai Inc · AI-Native Engineering</p>
            <h1 class="hero-cosmos-title">
                <span class="hero-cosmos-line hero-cosmos-line--1">Run your</span>
                <span class="hero-cosmos-line hero-cosmos-line--2">entire business</span>
                <span class="hero-cosmos-line hero-cosmos-line--3">with <em class="hero-cosmos-ai">AI Agents</em></span>
            </h1>
            <p class="hero-cosmos-subtitle">Hand off engineering, sales, marketing, and ops to our AI-powered engineering team. Fixed-price guarantees. Senior engineers. Direct access.</p>
            <a href="${hero.cta_primary.href}" target="_blank" class="btn-primary large hero-cosmos-cta">${hero.cta_primary.text}</a>
            <div class="hero-cosmos-trust">
                <div class="hero-trust-avatars">
                    ${hero.trust_avatars.map((a, i) => `<span class="trust-avatar trust-avatar-${i + 1}">${a}</span>`).join('')}
                </div>
                <span>Trusted by <strong class="trust-count">${hero.trust_line}</strong>${hero.trust_suffix ? ` ${hero.trust_suffix}` : ''}</span>
            </div>
        </div>

    </section>


    <!-- ════════ AUDIENCE FINDER (VERIZON STYLE TABS) ════════ -->
    ${af ? `
    <section id="audience-finder" class="audience-finder fade-in home-section-shaded">
        <div class="container">
            <div class="section-header text-center">
                <span class="mini-title">${af.subtitle}</span>
                <h2 class="text-5xl mt-3">${af.title}</h2>
            </div>
            <div class="audience-tabs-bar" role="tablist">
                ${af.tabs.map((t, i) => `
                <button type="button" class="audience-tab-btn${i === 0 ? ' active' : ''}" role="tab" aria-selected="${i === 0}" data-audience-tab="${t.id}">${t.label}</button>`).join('')}
            </div>
            ${af.tabs.map((t, i) => `
            <div class="audience-panel ${i === 0 ? 'active' : ''}" id="panel-${t.id}" data-audience-panel="${t.id}">
                <div class="audience-panel-left">
                    <div class="audience-panel-intro">
                        <span class="audience-panel-intro-badge">${t.badge}</span>
                        <h3 class="audience-panel-title">${t.panel_title}</h3>
                        <p class="audience-panel-subtitle">${t.panel_subtitle}</p>
                    </div>
                    <div class="audience-solution-grid">
                        ${t.cards.map(c => `
                        <div class="audience-solution-card">
                            <span class="audience-solution-icon">${audienceIcons[c.icon_key] || ''}</span>
                            ${c.tag ? `<span class="audience-solution-tag">${c.tag}</span>` : ''}
                            <h4 class="audience-solution-title">${c.title}</h4>
                            <p class="audience-solution-desc">${c.desc}</p>
                        </div>`).join('')}
                    </div>
                    <div style="margin-top: 40px;">
                        <a href="${t.cta_href}" class="audience-panel-cta">${t.cta_text} →</a>
                    </div>
                </div>
                ${t.image ? `
                <div class="audience-panel-right">
                    <div class="audience-panel-media">
                        <img src="${t.image}" alt="${t.image_alt || ''}" loading="lazy" onerror="this.parentElement.style.display='none'" />
                        ${t.image_caption ? `<span class="audience-panel-media-caption">${t.image_caption}</span>` : ''}
                    </div>
                </div>` : ''}

            </div>`).join('')}
        </div>
    </section>
    ` : ''}

    <!-- ════════ THE UN-AGENCY MANIFESTO (T-MOBILE STYLE) ════════ -->
    <section class="titan-manifesto fade-in home-section-shaded home-section-bordered-bottom">
        <div class="container">
            <div class="section-header max-w-800">
                <h4 class="mini-title">${un.subtitle}</h4>
                <h2 class="massive-title text-left">${un.title}</h2>
            </div>
            <div class="tmo-grid">
                ${un.cards ? un.cards.map(card => `
                <div class="tmo-card fade-in">
                    ${card.img ? `<div class="tmo-card-media"><img src="${card.img}" alt="${card.title}" class="tmo-card-img" /></div>` : ''}
                    <div class="tmo-card-body">
                        <h3 class="tmo-card-title">${card.title}</h3>
                        <p class="tmo-card-desc">${card.desc}</p>
                    </div>
                </div>`).join('') : ''}
            </div>
        </div>
    </section>

    <!-- ════════ CAPABILITIES (VERIZON STYLE — BANNER + GRID) ════════ -->
    <section id="capabilities" class="cap-section fade-in">
        <div class="container">
            <div class="section-header text-center">
                <span class="mini-title">${cap.subtitle}</span>
                <h2 class="text-5xl mt-3">${cap.title}</h2>
            </div>
            <div class="cap-grid">
                ${cap.cards.map(c => `
                <a href="${c.href}" class="cap-cell fade-in">
                    ${c.icon_key ? `<div class="cap-cell-header"><span class="cap-cell-icon">${audienceIcons[c.icon_key] || ''}</span><span class="cap-cell-arrow">›</span></div>` : ''}
                    <div class="cap-cell-content">
                        <h3 class="cap-cell-title">${c.title}</h3>
                        ${c.desc ? `<p class="cap-cell-desc">${c.desc}</p>` : ''}
                    </div>
                </a>`).join('')}
            </div>
            <div class="svc-banner-wrap mt-15">
                <img src="${sb.image}" alt="${sb.card_title}" class="svc-banner-img" loading="lazy" />
                <div class="svc-banner-card">
                    <h3 class="svc-banner-card-title">${sb.card_title}</h3>
                    <p class="svc-banner-card-desc">${sb.card_desc}</p>
                    <a href="${sb.card_href}" target="_blank" class="svc-banner-card-cta">${sb.card_cta}</a>
                </div>
            </div>
        </div>
    </section>

    <!-- ════════ THE PROOF (VERIZON STYLE METRICS) ════════ -->
    <section class="content-section fade-in home-section-shaded home-section-bordered-top">
        <div class="container">
            <div class="section-header center mb-10">
                <h4 class="mini-title">${proof.subtitle}</h4>
                <h2>${proof.title}</h2>
            </div>
            
            <!-- Directory Card -->
            <div class="directory-card fade-in">
                <div class="featured-case-study-card__content">
                    <h3 class="featured-case-study-card__title mb-4">${proof.directoryCard.title}</h3>
                    <p class="featured-case-study-card__desc text-lg mb-6 leading-tight">${proof.directoryCard.description}</p>
                    
                    <div class="client-pills-row">
                        ${proof.directoryCard.clientPills.map(p => `
                        <a href="${p.link}" class="client-pill" data-accent="${p.accentColor}">${p.name}</a>
                        `).join('')}
                    </div>

                    <a href="${proof.directoryCard.ctaLink}" class="featured-case-study-card__cta mt-4 inline-block">${proof.directoryCard.ctaText}</a>
                </div>
            </div>

            <!-- Stat Highlights Row -->
            <div class="stat-highlights-row fade-in">
                ${proof.highlights.map(h => `
                <div class="stat-highlight" data-accent="${h.accentColor}">
                    <div class="stat-highlight__label">${h.label}</div>
                    <a href="${h.link}" class="stat-highlight__client">${h.client}</a>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ CONVERSION BLOCK (SPLIT COLUMN) ════════ -->
    <section class="compare-section fade-in">
        <div class="container conversion-split">
            <div class="conversion-left">
                <h4 class="mini-title">${conv.subtitle}</h4>
                <h2>${conv.title}</h2>
                <p>${conv.description}</p>
                <a href="${conv.button_href}" target="_blank" class="btn-primary large">${conv.button_text}</a>
            </div>
            <div class="conversion-right">
                <div class="stepper">
                    ${conv.steps.map(s => `
                    <div class="stepper-step">
                        <h3 class="stepper-title">${s.title}</h3>
                        <p class="stepper-desc">${s.desc}</p>
                    </div>`).join('')}
                </div>
            </div>
        </div>
    </section>

    ${renderFaq(data.faq)}
    `;
}

function renderAbout(data) {
    return `
    <!-- ════════ HERO — SPLIT (IDENTITY) ════════ -->
    <section class="about-hero">
        <div class="about-hero-split">
            <div class="about-hero-left">
                <p class="about-hero-eyebrow">${data.header.eyebrow}</p>
                <h1 class="about-hero-title">${data.header.title.replace(/\n/g, '<br>')}</h1>
                <p class="about-hero-desc">${data.header.description}</p>
                <a href="#team" class="btn-primary large about-hero-cta">Meet the Team</a>
            </div>
            <div class="about-hero-right">
                <img src="/img/about_hero_team.png" alt="Trai Inc engineering team collaborating in office" class="about-hero-img" loading="eager" fetchpriority="high">
            </div>
        </div>
    </section>

    <!-- ════════ STATS BAR ════════ -->
    <section class="about-stats">
        <div class="container">
            <div class="about-stats-row">
                ${data.numbers.stats.map(s => `
                <div class="about-stat fade-in">
                    <span class="about-stat-value">${s.value}</span>
                    <span class="about-stat-label">${s.label}</span>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ MISSION / VISION / VALUES ════════ -->
    <section class="about-purpose">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.purpose.subtitle}</h4>
                <h2>Mission, Vision & Values</h2>
            </div>
            <div class="about-purpose-cards fade-in">
                <div class="about-purpose-card about-purpose-mission">
                    <span class="about-purpose-icon">${data.purpose.mission.icon}</span>
                    <h3 class="about-purpose-label">${data.purpose.mission.label}</h3>
                    <p class="about-purpose-text">${data.purpose.mission.text}</p>
                </div>
                <div class="about-purpose-card about-purpose-vision">
                    <span class="about-purpose-icon">${data.purpose.vision.icon}</span>
                    <h3 class="about-purpose-label">${data.purpose.vision.label}</h3>
                    <p class="about-purpose-text">${data.purpose.vision.text}</p>
                </div>
            </div>
            <div class="about-values-grid">
                ${data.purpose.values.map(v => `
                <div class="about-value-card fade-in">
                    <div class="about-value-icon">${v.icon}</div>
                    <h4 class="about-value-title">${v.title}</h4>
                    <p class="about-value-desc">${v.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ TEAM ════════ -->
    <section id="team" class="about-team">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.team.subtitle}</h4>
                <h2>${data.team.title}</h2>
            </div>
            <div class="about-team-grid">
                ${data.team.members.map(m => `
                <div class="about-team-card fade-in">
                    <div class="about-team-avatar">
                        <img src="${m.image}" alt="${m.name}" class="about-team-avatar-img" loading="lazy">
                    </div>
                    <h3 class="about-team-name">${m.name}</h3>
                    <p class="about-team-role">${m.role}</p>
                    ${m.tagline ? `<p class="about-team-tagline">${m.tagline}</p>` : ''}
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ HOW WE WORK — BENTO ════════ -->
    <section class="about-work">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.model.subtitle}</h4>
                <h2>${data.model.title}</h2>
                <p class="about-work-desc">${data.model.description}</p>
            </div>
            <div class="about-work-grid">
                ${data.model.advantages.map(a => `
                <div class="about-work-card fade-in">
                    <div class="about-work-icon">${a.icon}</div>
                    <h3 class="about-work-card-title">${a.title}</h3>
                    <p class="about-work-card-desc">${a.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ TIMELINE — MILESTONE CARDS ════════ -->
    <section class="about-timeline">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.timeline.subtitle}</h4>
                <h2>${data.timeline.title}</h2>
            </div>
            <div class="about-timeline-track">
                ${data.timeline.milestones.map(m => `
                <div class="about-milestone fade-in">
                    <div class="about-milestone-dot"></div>
                    <div class="about-milestone-card">
                        <span class="about-milestone-year">${m.year}</span>
                        <h3 class="about-milestone-title">${m.title}</h3>
                        <p class="about-milestone-desc">${m.desc}</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    ${renderFaq(data.faq)}

    <!-- ════════ CTA ════════ -->
    <section class="about-cta-section">
        <div class="container">
            <div class="about-cta-card fade-in">
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
        <div class="container max-w-900 mx-auto text-center section-pad-xl">
            <h4 class="mini-title">${data.hero.subtitle}</h4>
            <h1 class="main-heading">${data.hero.title}</h1>
            <p class="incub-hero-desc">${data.hero.description}</p>
            <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">${data.cta.button_text}</a>
            <p class="incub-scarcity">${data.scarcity || ''}</p>
        </div>
    </header>

    <section class="section-card-band">
        <div class="container">
            <div class="flex-center-wrap gap-15">
                ${data.stats.map(s => `
                <div class="fade-in">
                    <h3 class="incub-stat-value">${s.value}</h3>
                    <p class="incub-stat-label">${s.label}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="section-pad-lg">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">INCUBATION TRACKS</h4>
                <h2>Choose the track that matches your stage</h2>
            </div>
            <div class="grid-2 mt-12 gap-10">
                ${data.programs.map(p => `
                <div class="spec-card fade-in spec-card-tall">
                    <div class="incub-program-icon">${p.icon}</div>
                    <h3 class="incub-program-title">${p.title}</h3>
                    <span class="incub-program-duration">⏱ ${p.duration}</span>
                    <p class="incub-program-desc">${p.desc}</p>
                    <ul class="list-none p-0">
                        ${p.includes.map(i => `<li class="incub-check-item"><span class="incub-check-icon">✔</span> ${i}</li>`).join('')}
                    </ul>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="section-pad-lg bg-darker">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">WHAT YOU GET</h4>
                <h2>Everything a founder needs to ship and scale</h2>
            </div>
            <div class="grid-3 mt-12">
                ${data.what_you_get.map(item => `
                <div class="spec-card fade-in p-10 text-center">
                    <div class="incub-feature-icon">${item.icon}</div>
                    <h3 class="incub-feature-title">${item.title}</h3>
                    <p class="incub-feature-desc">${item.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="section-pad-lg">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">HOW IT WORKS</h4>
                <h2>From application to launch in 4 steps</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 30px; margin-top: 50px;" class="incub-process-grid">
                ${data.process.map(step => `
                <div class="fade-in" style="text-align: center; padding: 30px;">
                    <div class="incub-process-step">${step.step}</div>
                    <h3 class="incub-process-title">${step.title}</h3>
                    <p class="incub-process-desc">${step.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="section-pad-lg bg-darker">
        <div class="container max-w-800">
            <div class="section-header center fade-in">
                <h4 class="mini-title">IDEAL CANDIDATE</h4>
                <h2>${data.ideal_founder.title}</h2>
            </div>
            <div class="spec-card fade-in" style="padding: 50px; margin-top: 40px;">
                <ul class="list-none p-0">
                    ${data.ideal_founder.traits.map(t => `
                    <li class="incub-trait-item">
                        <span class="incub-trait-arrow">→</span>
                        <span class="incub-trait-text">${t}</span>
                    </li>`).join('')}
                </ul>
            </div>
        </div>
    </section>

    <section class="section-pad">
        <div class="container">
            <div class="spec-card fade-in" style="padding: 80px 60px; text-align: center; border-radius: 30px; position: relative; overflow: hidden; margin-bottom: 40px;">
                <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: var(--brand-gradient); filter: blur(150px); opacity: 0.15; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -80px; left: -80px; width: 250px; height: 250px; background: var(--accent-glow); filter: blur(120px); opacity: 0.2; border-radius: 50%;"></div>
                <h2 class="incub-cta-title">${data.cta.title}</h2>
                <p class="incub-cta-desc">${data.cta.description}</p>
                <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large" style="position: relative;">${data.cta.button_text}</a>
            </div>
            
            ${data.external_cta ? `
            <div class="spec-card fade-in" style="padding: 60px 40px; text-align: center; border-radius: 20px; border: 1px solid var(--border-light); background: var(--bg-card);">
                <h3 class="incub-ext-title">${data.external_cta.title}</h3>
                <p class="incub-ext-desc">${data.external_cta.description}</p>
                <a href="${data.external_cta.button_href}" target="_blank" rel="noopener" class="btn-secondary">${data.external_cta.button_text}</a>
            </div>
            ` : ''}
        </div>
    </section>
    `;
}

function renderCareers(data) {
    return `
    <section class="msme-hero service-hero-clean fade-in">
        <div class="msme-hero-inner">
            <div>
                <div class="msme-badge">${data.header.subtitle}</div>
                <h1>${data.header.title}</h1>
                <p class="msme-hero-sub">${data.header.description}</p>
                <div class="hero-cta-row">
                    <a href="#openings" class="btn-primary large">View Open Positions</a>
                </div>
                <div class="hero-trust">
                    <div class="hero-trust-avatars">
                        <span class="trust-avatar trust-avatar-1">T</span>
                        <span class="trust-avatar trust-avatar-2">R</span>
                        <span class="trust-avatar trust-avatar-3">A</span>
                        <span class="trust-avatar trust-avatar-4">I</span>
                    </div>
                    <span class="hero-trust-text">Join <strong>12+ freelancers</strong> in our network</span>
                </div>
            </div>
            <div class="hero-mockup service-hero-mockup">
                <div class="service-hero-screenshot-wrap">
                    <img src="${data.hero_image || 'assets/ui-mockups/hero_code_editor.png'}" alt="${data.hero_image_alt || 'Careers at Trai Inc'}" class="service-hero-screenshot" />
                </div>
                ${data.hero_cards ? data.hero_cards.map((c, i) => `
                <div class="float-card float-card-${i+1}">
                    <div class="fc-icon">${c.icon}</div>
                    <div class="fc-label">${c.label}</div>
                    <div class="fc-value ${c.active ? 'fc-value-active' : ''}">${c.value}</div>
                </div>`).join('') : ''}
            </div>
        </div>
    </section>

    ${data.stats ? `
    <section class="service-stats-section fade-in">
        <div class="container service-stats-row">
            ${data.stats.map(s => `<div>
                <h3 class="service-stats-value">${s.value}</h3>
                <p class="service-stats-label">${s.label}</p>
            </div>`).join('')}
        </div>
    </section>` : ''}

    <section class="container fade-in" style="padding: 80px 24px;">
        <div class="section-header center">
            <h4 class="mini-title">${data.values.subtitle}</h4>
            <h2>${data.values.title}</h2>
        </div>
        <div class="bento-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px;">
            ${data.values.items.map(v => `
            <div class="bento-card fade-in">
                <div class="bento-icon">${v.icon}</div>
                <h3 class="bento-title">${v.title}</h3>
                <p class="bento-desc">${v.desc}</p>
            </div>`).join('')}
        </div>
    </section>

    <section class="container fade-in" style="padding: 40px 24px 80px;">
        <div class="section-header center">
            <h4 class="mini-title">${data.benefits.subtitle}</h4>
            <h2>${data.benefits.title}</h2>
        </div>
        <div class="bento-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
            ${data.benefits.items.map(b => `
            <div class="bento-card fade-in">
                <div class="bento-icon">${b.icon}</div>
                <h3 class="bento-title">${b.title}</h3>
                <p class="bento-desc">${b.desc}</p>
            </div>`).join('')}
        </div>
    </section>

    <section id="openings" class="container fade-in" style="padding: 40px 24px 80px; scroll-margin-top: 80px;">
        <div class="section-header center">
            <h4 class="mini-title">${data.openings.title}</h4>
        </div>

        ${data.openings.sections.map(section => `
        <div class="careers-opening-block">
            <div class="careers-opening-header">
                <h2 class="careers-opening-category">${section.category}</h2>
                <p class="careers-opening-subtitle">${section.subtitle}</p>
            </div>

            <div class="careers-jobs-grid">
                ${section.jobs.map(job => `
                <div class="bento-card fade-in careers-job-card">
                    <div>
                        <h3 class="careers-job-title">${job.title}</h3>
                        <div class="careers-job-tags">
                            <span class="careers-job-tag">${job.location}</span>
                            <span class="careers-job-tag">${job.type}</span>
                        </div>
                        <p class="careers-job-desc">${job.desc}</p>
                    </div>
                    <div style="margin-top: 24px;">
                        <a href="${job.button_href || 'mailto:careers@traiinc.com?subject=Job Application'}" class="btn-secondary" style="width: 100%; text-align: center;">${job.button_text || 'Apply Now'}</a>
                    </div>
                </div>`).join('')}
            </div>

            <div class="careers-apply-row">
                <a href="${section.apply_link}" target="_blank" class="btn-primary large">${section.apply_text}</a>
            </div>
        </div>`).join('')}
    </section>

    ${renderFaq(data.faq)}

    <section class="services-cta fade-in" style="padding: 80px 24px; text-align: center;">
        <div class="container" style="background: var(--bg-darker); border-radius: 40px; padding: 80px 60px; border: 1px solid var(--bg-light); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: var(--brand-gradient); filter: blur(150px); opacity: 0.2; border-radius: 50%;"></div>
            <h2 style="font-family: var(--font-heading); font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 800; margin-bottom: 16px;">Ready to build with us?</h2>
            <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 32px;">Join a network of elite freelancers shipping production code for India's fastest-growing companies.</p>
            <a href="mailto:hello@traiinc.com" class="btn-primary large">Send Your Portfolio →</a>
        </div>
    </section>
    `;
}
function renderPartner(data) {
    return `
    <!-- ════════ HERO — SPLIT ════════ -->
    <section class="ptr-hero">
        <div class="ptr-hero-split">
            <div class="ptr-hero-left">
                <p class="ptr-hero-eyebrow">${data.header.eyebrow}</p>
                <h1 class="ptr-hero-title">${data.header.title.replace(/\n/g, '<br>')}</h1>
                <p class="ptr-hero-desc">${data.header.description}</p>
                <a href="${data.header.cta_href}" class="btn-primary large ptr-hero-cta">${data.header.cta_text}</a>
            </div>
            <div class="ptr-hero-right">
                <div class="ptr-hero-visual">
                    <div class="ptr-hero-blob ptr-hero-blob-1"></div>
                    <div class="ptr-hero-blob ptr-hero-blob-2"></div>
                    <div class="ptr-hero-ring"></div>
                    <div class="ptr-hero-stat-float ptr-hero-float-1">
                        <span class="ptr-float-value">10–15%</span>
                        <span class="ptr-float-label">Commission</span>
                    </div>
                    <div class="ptr-hero-stat-float ptr-hero-float-2">
                        <span class="ptr-float-value">138+</span>
                        <span class="ptr-float-label">Projects Delivered</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ════════ TRUST BAR ════════ -->
    <section class="ptr-trust-bar">
        <div class="container">
            <div class="ptr-trust-row">
                ${data.trust.stats.map(s => `
                <div class="ptr-trust-stat fade-in">
                    <span class="ptr-trust-value">${s.value}</span>
                    <span class="ptr-trust-label">${s.label}</span>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ VALUE PROPS ════════ -->
    <section class="ptr-value">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.value.subtitle}</h4>
                <h2>${data.value.title}</h2>
                <p class="ptr-value-desc">${data.value.description}</p>
            </div>
            <div class="ptr-value-grid">
                ${data.value.points.map(p => `
                <div class="ptr-value-card fade-in">
                    <div class="ptr-value-icon">${p.icon}</div>
                    <h3 class="ptr-value-card-title">${p.title}</h3>
                    <p class="ptr-value-card-desc">${p.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ PARTNERSHIP MODELS ════════ -->
    <section id="models" class="ptr-models">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.models.subtitle}</h4>
                <h2>${data.models.title}</h2>
            </div>
            <div class="ptr-models-grid">
                ${data.models.tiers.map((t, i) => `
                <div class="ptr-model-card fade-in${i === 0 ? ' ptr-model-featured' : ''}">
                    ${t.badge ? `<span class="ptr-model-badge">${t.badge}</span>` : ''}
                    <div class="ptr-model-icon">${t.icon}</div>
                    <h3 class="ptr-model-title">${t.title}</h3>
                    <p class="ptr-model-ideal">${t.ideal_for}</p>
                    <p class="ptr-model-desc">${t.desc}</p>
                    <ul class="ptr-model-benefits">
                        ${t.benefits.map(b => `
                        <li class="ptr-model-benefit">
                            <span class="ptr-model-check"><svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5L5 9l4.5-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
                            <span>${b}</span>
                        </li>`).join('')}
                    </ul>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ TRUST SIGNALS ════════ -->
    <section class="ptr-proof">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.proof.subtitle}</h4>
                <h2>${data.proof.title}</h2>
            </div>
            <div class="ptr-proof-grid">
                ${data.proof.items.map(p => `
                <div class="ptr-proof-item fade-in">
                    <span class="ptr-proof-metric">${p.metric}</span>
                    <p class="ptr-proof-text">${p.text}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ IDEAL PARTNERS ════════ -->
    <section class="ptr-ideal">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.ideal.subtitle}</h4>
                <h2>${data.ideal.title}</h2>
            </div>
            <div class="ptr-ideal-grid">
                ${data.ideal.list.map(item => `
                <div class="ptr-ideal-item fade-in">
                    <span class="ptr-ideal-icon">${item.icon}</span>
                    <span class="ptr-ideal-text">${item.text}</span>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ PROCESS ════════ -->
    <section class="ptr-process">
        <div class="container">
            <div class="section-header center fade-in">
                <h4 class="mini-title">${data.process.subtitle}</h4>
                <h2>${data.process.title}</h2>
            </div>
            <div class="ptr-process-track">
                ${data.process.steps.map(s => `
                <div class="ptr-process-step fade-in">
                    <div class="ptr-process-dot"></div>
                    <div class="ptr-process-card">
                        <span class="ptr-process-number">${s.number}</span>
                        <h3 class="ptr-process-title">${s.title}</h3>
                        <p class="ptr-process-desc">${s.desc}</p>
                    </div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    ${renderFaq(data.faq)}

    <!-- ════════ CTA ════════ -->
    <section class="ptr-cta-section">
        <div class="container">
            <div class="ptr-cta-card fade-in">
                <div class="ptr-cta-glow"></div>
                <h2 class="ptr-cta-title">${data.cta.title}</h2>
                <p class="ptr-cta-desc">${data.cta.description}</p>
                <div class="ptr-cta-buttons">
                    <a href="${data.cta.button_href}" target="_blank" class="btn-primary large">${data.cta.button_text}</a>
                    <a href="${data.cta.whatsapp_href}" target="_blank" class="whatsapp-btn">${data.cta.whatsapp_text}</a>
                </div>
            </div>
        </div>
    </section>
    `;
}

function renderContact(data) {
    return `
    <!-- ═══ HERO ═══ -->
    <section class="cf-hero-wrapper contact-hero-wrapper">
        <div class="contact-hero-mesh" aria-hidden="true"></div>

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
                        <div class="contact-detail-icon">${audienceIcons[item.icon_key] || ''}</div>
                        <div class="contact-detail-text">
                            <h4>${item.label}</h4>
                            <p>${item.value}</p>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Right Column — Quick Actions -->
            <div class="contact-form-card contact-form-card-flex">
                <div class="contact-action-block">
                    <div class="contact-action-icon">${audienceIcons.whatsapp}</div>
                    <h3 class="contact-action-title">Chat on WhatsApp</h3>
                    <p class="contact-action-desc">Message our founders directly — typical response in under 30 minutes during business hours.</p>
                    <a href="${data.info.whatsapp_url}" target="_blank" rel="noopener noreferrer" class="whatsapp-btn contact-action-btn">
                        <span class="whatsapp-btn-icon">${audienceIcons.whatsapp}</span>
                        Start Chat
                    </a>
                </div>

                <div class="contact-action-separator"></div>

                <div class="contact-action-block">
                    <div class="contact-action-icon">${audienceIcons.calendar}</div>
                    <h3 class="contact-action-title">Book a Free 30-Min Call</h3>
                    <p class="contact-action-desc">Prefer a structured conversation? Schedule a scoping call. No sales pitch — just honest technical discussion.</p>
                    <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" rel="noopener noreferrer" class="btn-primary large contact-action-btn">
                        Book on Google Calendar
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
            <form id="contactForm" action="/api/contact" method="POST" class="contact-form">

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

    <!-- ═══ LOCATION SECTION ═══ -->
    <section class="contact-location-section">
        <div class="container contact-location-container">
            <div class="contact-location-card">
                <div class="contact-location-left">
                    <div class="contact-location-pin">${audienceIcons.pin}</div>
                    <div class="contact-location-info">
                        <h3 class="contact-location-title">Visit Our Studio</h3>
                        <p class="contact-location-addr">Tower B-2, DLF MyPad,<br>Opposite Hyatt Regency, Vibhuti Khand,<br>Gomti Nagar, Lucknow, UP 226010</p>
                        <div class="contact-location-meta">
                            <span class="contact-location-badge"><span class="contact-badge-icon">${audienceIcons.clock}</span> Mon–Sat, 10am–7pm IST</span>
                            <span class="contact-location-badge"><span class="contact-badge-icon">${audienceIcons.map}</span> In-person meetings available</span>
                        </div>
                    </div>
                </div>
                <div class="contact-location-right">
                    <a href="https://www.google.com/maps?q=Trai+Inc+Lucknow" target="_blank" rel="noopener noreferrer" class="contact-map-placeholder" style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; min-height: 320px; background: var(--bg-dark); border-radius: 0 var(--radius-lg) var(--radius-lg) 0; text-decoration: none; border-left: 1px solid var(--border-light); position: relative; overflow: hidden;">
                        <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, var(--border-strong) 1px, transparent 1px) 0 0 / 20px 20px; opacity: 0.2; pointer-events: none;"></div>
                        <div style="color: var(--accent-color); margin-bottom: 12px; z-index: 1;">${audienceIcons.pin}</div>
                        <h4 style="color: var(--text-main); font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 6px; z-index: 1;">View on Google Maps</h4>
                        <span style="color: var(--text-muted); font-size: 0.9rem; z-index: 1;">Get directions to our studio</span>
                    </a>
                </div>
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
    <section class="cf-hero-wrapper solutions-hero-wrapper">
        <div class="solutions-hero-mesh" aria-hidden="true"></div>
        <div class="cf-hero-content fade-in">
            <h4 class="mini-title">${data.header.subtitle}</h4>
            <h1 class="solutions-header-title">${data.header.title}</h1>
            <p class="solutions-header-desc">${data.header.description}</p>
        </div>
    </section>

    ${data.categories.map((cat, ci) => `
    <section class="${ci % 2 !== 0 ? 'cap-section-alt' : 'cap-section'} fade-in" id="${cat.id}" style="${ci % 2 !== 0 ? 'padding: 80px 0; background: var(--bg-card); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light);' : 'padding: 80px 0;'}">
        <div class="container">
            <div class="section-header">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <div class="cap-cell-icon">${audienceIcons[cat.icon_key] || ''}</div>
                    <h2 class="text-4xl" style="margin: 0; font-family: var(--font-heading); font-weight: 700;">${cat.title}</h2>
                </div>
                <p style="color: var(--text-muted); font-size: 1.1rem; max-width: 650px;">${cat.desc}</p>
                ${cat.tech_stack && cat.tech_stack.length > 0 ? `
                <div class="solutions-tech-row">
                    ${cat.tech_stack.map(t => `<div class="solutions-tech-pill">${getTechLogo(t)}<span>${t}</span></div>`).join('')}
                </div>` : ''}
            </div>
            <div class="bento-grid" style="margin-top: 40px;">
                ${cat.services.map(s => `
                <a href="${s.href}" class="bento-card fade-in" style="text-decoration: none; display: flex; flex-direction: column;">
                    <div style="flex-grow: 1;">
                        <h3 class="bento-title">${s.name}</h3>
                        <p class="bento-desc">${s.desc}</p>
                    </div>
                    <div style="margin-top: 20px; font-weight: 600; color: var(--accent-color); font-size: 0.9rem;">Explore →</div>
                </a>`).join('')}
            </div>
            <div class="solutions-cat-cta-row">
                <a href="${cat.href}" class="btn-secondary solutions-cat-link">Explore ${cat.title} →</a>
            </div>
        </div>
    </section>`).join('')}

    ${data.guarantee ? `
    <section class="solutions-guarantee fade-in">
        <div class="container">
            <h2 class="solutions-guarantee-title">${data.guarantee.title}</h2>
            <div class="solutions-guarantee-grid">
                ${data.guarantee.items.map(g => `
                <div class="solutions-guarantee-card">
                    <div class="solutions-guarantee-icon">${audienceIcons[g.icon_key] || ''}</div>
                    <h3>${g.title}</h3>
                    <p>${g.desc}</p>
                </div>`).join('')}
            </div>
        </div>
    </section>` : ''}

    <section class="solutions-cta fade-in">
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
    const statsHtml = data.stats ? `
    <section class="service-stats-section fade-in">
        <div class="container service-stats-row">
            ${data.stats.map(s => `<div>
                <h3 class="service-stats-value">${s.value}</h3>
                <p class="service-stats-label">${s.label}</p>
            </div>`).join('')}
        </div>
    </section>` : '';

    const benefitsHtml = data.benefits ? `
    <section class="container fade-in" style="padding: 80px 24px;">
        <div class="section-header center">
            <h4 class="mini-title">WHY TRAI INC</h4>
            <h2>Our Industry Advantage</h2>
        </div>
        <div class="bento-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
            ${data.benefits.map(b => `
            <div class="bento-card fade-in">
                <div class="bento-icon">${b.icon}</div>
                <h3 class="bento-title">${b.title}</h3>
                <p class="bento-desc">${b.description}</p>
            </div>`).join('')}
        </div>
    </section>` : '';

    return `
    <header class="page-header container fade-in" style="padding: 110px 24px 56px; text-align: center; max-width: 900px; margin: 0 auto;">
        <h4 class="mini-title">${data.hero.mini_title}</h4>
        <h1 class="ind-hero-title">${data.hero.title}</h1>
        <p class="ind-hero-desc">${data.hero.description}</p>
    </header>

    ${statsHtml}

    <section class="container" style="padding: 60px 24px;">
        <div class="section-header center fade-in">
            <h4 class="mini-title">VERTICALS</h4>
            <h2>Sectors We Specialize In</h2>
        </div>
        <div class="grid-2" style="gap: 32px;">
            ${data.industries.map(ind => `
            <div id="${ind.id}" class="spec-card fade-in" style="padding: 44px; position: relative; border: 1px solid var(--border-light); background: var(--bg-card); scroll-margin-top: 100px;">
                <div class="ind-card-icon">${ind.icon}</div>
                <h3 class="ind-card-title">${ind.name}</h3>
                <p class="ind-card-desc">${ind.desc}</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px;">
                    ${ind.features.map(f => `<div class="ind-feature-item"><span class="ind-feature-check">✔</span> ${f}</div>`).join('')}
                </div>
            </div>`).join('')}
        </div>
    </section>

    ${benefitsHtml}

    ${renderFaq(data.faq)}

    <section class="services-cta fade-in" style="padding: 100px 24px; text-align: center;">
        <div class="container" style="background: var(--bg-darker); border-radius: 40px; padding: 100px 60px; border: 1px solid var(--bg-light); position: relative; overflow: hidden;">
            <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: var(--brand-gradient); filter: blur(150px); opacity: 0.2; border-radius: 50%;"></div>
            <h2 class="ind-cta-title">${data.cta.title}</h2>
            <p class="ind-cta-desc">${data.cta.description}</p>
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
            <div class="clients-stats-banner fade-in">
                ${data.stats.map(s => `
                <div class="clients-stats-banner-col">
                    <div class="clients-stats-value">${s.value}</div>
                    <div class="clients-stats-label">${s.label}</div>
                </div>`).join('')}
            </div>
        </div>
    </section>

    <!-- ════════ DEEP DIVE CASE STUDIES ════════ -->
    <section class="case-studies-index">
        ${data.case_studies.map((cs, i) => {
            const isReversed = i % 2 !== 0;
            return `
            <div class="content-section fade-in ${isReversed ? 'home-section-shaded' : ''}">
                <div class="container">
                    <div class="case-study-alternating-row ${isReversed ? 'reversed' : ''}">
                        <div class="conversion-left" style="${isReversed ? 'order: 2;' : ''}">
                            <div class="case-study-logo-container">
                                <img src="${cs.image}" alt="${cs.client} logo" />
                            </div>
                        </div>
                        <div class="conversion-right" style="${isReversed ? 'order: 1;' : ''}">
                            <div class="mini-title mb-3 letter-spacing-wide font-bold uppercase">${cs.tag}</div>
                            <h2 class="text-4xl mb-6">${cs.client}</h2>
                            <p class="text-lg text-muted mb-8 leading-tight">${cs.description}</p>
                            <a href="${cs.link}" class="btn-primary">Read full case study &rarr;</a>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('')}
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
                        <form id="estimatorForm" class="estimator-form" action="/api/contact" method="POST">

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

const deviconMap = {
    'flutter': 'flutter/flutter-original.svg',
    'react native': 'react/react-original.svg',
    'react': 'react/react-original.svg',
    'next.js': 'nextjs/nextjs-original.svg',
    'node.js': 'nodejs/nodejs-original.svg',
    'typescript': 'typescript/typescript-original.svg',
    'javascript': 'javascript/javascript-original.svg',
    'python': 'python/python-original.svg',
    'dart': 'dart/dart-original.svg',
    'swift': 'swift/swift-original.svg',
    'swiftui': 'swift/swift-original.svg',
    'kotlin': 'kotlin/kotlin-original.svg',
    'java': 'java/java-original.svg',
    'go': 'go/go-original.svg',
    'rust': 'rust/rust-original.svg',
    'xcode': 'xcode/xcode-original.svg',
    'jetpack compose': 'android/android-original.svg',
    'android studio': 'androidstudio/androidstudio-original.svg',
    'firebase': 'firebase/firebase-plain.svg',
    'postgresql': 'postgresql/postgresql-original.svg',
    'mongodb': 'mongodb/mongodb-original.svg',
    'mysql': 'mysql/mysql-original.svg',
    'redis': 'redis/redis-original.svg',
    'aws': 'amazonwebservices/amazonwebservices-original-wordmark.svg',
    'google cloud': 'googlecloud/googlecloud-original.svg',
    'azure': 'azure/azure-original.svg',
    'docker': 'docker/docker-original.svg',
    'kubernetes': 'kubernetes/kubernetes-plain.svg',
    'terraform': 'terraform/terraform-original.svg',
    'github actions': 'github/github-original.svg',
    'git': 'git/git-original.svg',
    'jenkins': 'jenkins/jenkins-original.svg',
    'fastapi': 'fastapi/fastapi-original.svg',
    'django': 'django/django-plain.svg',
    'graphql': 'graphql/graphql-plain.svg',
    'pytorch': 'pytorch/pytorch-original.svg',
    'tensorflow': 'tensorflow/tensorflow-original.svg',
    'figma': 'figma/figma-original.svg',
    'wordpress': 'wordpress/wordpress-plain.svg',
    'woocommerce': 'woocommerce/woocommerce-original.svg',
    'electron': 'electron/electron-original.svg',
    'dotnet': 'dotnetcore/dotnetcore-original.svg',
    '.net': 'dotnetcore/dotnetcore-original.svg',
    'android': 'android/android-original.svg',
    'apple': 'apple/apple-original.svg',
    'linux': 'linux/linux-original.svg',
    'nginx': 'nginx/nginx-original.svg',
    'prometheus': 'prometheus/prometheus-original.svg',
    'grafana': 'grafana/grafana-original.svg',
    'salesforce': 'salesforce/salesforce-original.svg',
    'aftereffects': 'aftereffects/aftereffects-original.svg',
    'illustrator': 'illustrator/illustrator-plain.svg',
    'photoshop': 'photoshop/photoshop-plain.svg',
    'blender': 'blender/blender-original.svg'
};

const simpleIconMap = {
    'langchain': 'langchain',
    'openai': 'openai',
    'snowflake': 'snowflake',
    'apache spark': 'apachespark',
    'power bi': 'powerbi',
    'google ads': 'googleads',
    'meta ads': 'meta',
    'hubspot': 'hubspot',
    'mailchimp': 'mailchimp',
    'semrush': 'semrush',
    'canva': 'canva',
    'twilio': 'twilio',
    'whatsapp api': 'whatsapp',
    'whatsapp': 'whatsapp',
    'lottie': 'lottiefiles',
    'stripe': 'stripe',
    'razorpay': 'razorpay',
    'google analytics': 'googleanalytics',
    'tableau': 'tableau',
    'datadog': 'datadog',
    'elastic': 'elastic',
    'vercel': 'vercel',
    'cloudflare': 'cloudflare',
    'supabase': 'supabase',
    'notion': 'notion',
    'slack': 'slack',
    'jira': 'jira',
    'linear': 'linear',
    'airflow': 'apacheairflow',
    'apache airflow': 'apacheairflow',
    'apache kafka': 'apachekafka',
    'n8n': 'n8n',
    'zapier': 'zapier',
    'oracle netsuite': 'oracle',
    'microsoft dynamics 365': 'dynamics365',
    'zoho crm': 'zoho',
    'sap': 'sap',
    'odoo': 'odoo',
    'shopify': 'shopify',
    'make': 'make',
    'strapi': 'strapi',
    'sanity': 'sanity',
    'tailwind css': 'tailwindcss'
};

function getTechLogo(tool) {
    const key = tool.toLowerCase();
    const devPath = deviconMap[key];
    if (devPath) return `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${devPath}" alt="${tool}" class="tech-logo" />`;
    const siSlug = simpleIconMap[key];
    if (siSlug) return `<img src="https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${siSlug}.svg" alt="${tool}" class="tech-logo tech-logo-si" />`;
    return '';
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
        const normalizedFaq = service.faq.map(item => ({
            q: item.q || item.question,
            a: item.a || item.answer
        }));
        faqHtml = renderFaq({ subtitle: 'QUESTIONS & ANSWERS', title: 'Frequently Asked Questions', items: normalizedFaq });
    }

    return `
    <!-- ════════ HERO (MSME-STYLE CLEAN SPLIT) ════════ -->
    <section class="msme-hero service-hero-clean">
        <div class="msme-hero-inner">
            <div>
                <div class="msme-badge">${service.badge}</div>
                <h1>${service.title}</h1>
                <p class="msme-hero-sub">${service.subtitle}</p>
                <div class="hero-cta-row">
                    <a href="${primaryHref}" ${primaryHref.startsWith('http') ? 'target="_blank"' : ''} class="btn-primary large">📅 ${primaryLabel}</a>
                    ${service.cta && service.cta.pricing_url ? `<a href="${service.cta.pricing_url}" class="btn-secondary large">💰 See Pricing</a>` : ''}
                </div>
                <div class="hero-trust">
                    <div class="hero-trust-avatars">
                        <span class="trust-avatar trust-avatar-1">T</span>
                        <span class="trust-avatar trust-avatar-2">R</span>
                        <span class="trust-avatar trust-avatar-3">A</span>
                        <span class="trust-avatar trust-avatar-4">I</span>
                    </div>
                    <span class="hero-trust-text">Trusted by <strong>138+ businesses</strong></span>
                </div>
            </div>
            <div class="hero-mockup service-hero-mockup">
                <div class="service-hero-screenshot-wrap">
                    <img src="${service.hero_image || 'assets/ui-mockups/hero_code_editor.png'}" alt="${service.hero_image_alt || 'Service demonstration'}" class="service-hero-screenshot" />
                </div>
                ${service.hero_cards ? service.hero_cards.map((c, i) => `
                <div class="float-card float-card-${i+1}">
                    <div class="fc-icon">${c.icon}</div>
                    <div class="fc-label">${c.label}</div>
                    <div class="fc-value ${c.active ? 'fc-value-active' : ''}">${c.value}</div>
                </div>
                `).join('') : `
                <div class="float-card float-card-1">
                    <div class="fc-icon">🚀</div>
                    <div class="fc-label">Projects Delivered</div>
                    <div class="fc-value fc-value-active">138+</div>
                </div>
                <div class="float-card float-card-2">
                    <div class="fc-icon">⚡</div>
                    <div class="fc-label">Avg. Delivery</div>
                    <div class="fc-value">6 Weeks</div>
                </div>
                `}
            </div>
        </div>
    </section>

    <!-- STATS -->
    ${statsHtml}

    <!-- CORE SOLUTIONS / SUB-SERVICES -->
    <section class="content-section fade-in">
        <div class="container">
            <div class="section-header center service-section-header">
                <h4 class="mini-title service-mini-title">CAPABILITIES</h4>
                <h2 class="service-section-h2">Core Features & Solutions</h2>
            </div>
            
            <div class="service-rich-features">
                ${service.features.map((f, i) => `
                <div class="service-rich-feature-row ${i % 2 !== 0 ? 'reverse' : ''}" ${f.id ? `id="${f.id}"` : ''}>
                    ${f.image ? `
                    <div class="service-rich-feature-image-col">
                        <div class="service-rich-feature-image-wrapper fade-in">
                            <img src="${f.image}" alt="${f.title}" loading="lazy" class="service-rich-feature-img" />
                            <div class="service-rich-feature-glow" style="background: ${f.color};"></div>
                        </div>
                    </div>` : ''}
                    <div class="service-rich-feature-text-col fade-in">
                        <div class="service-rich-feature-icon" style="color: ${f.color}; background: color-mix(in srgb, ${f.color} 15%, transparent);">${f.icon}</div>
                        <h3 class="service-rich-feature-title">${f.title}</h3>
                        <p class="service-rich-feature-desc">${f.desc}</p>
                        ${f.insight ? `
                        <div class="service-rich-feature-insight">
                            <h4 class="service-rich-insight-label">💡 Strategic Insight</h4>
                            <p class="service-rich-insight-text">${f.insight}</p>
                        </div>
                        ` : ''}
                        ${f.tech_stack && f.tech_stack.length > 0 ? `
                        <div class="solutions-tech-row" style="margin-top: 16px;">
                            ${f.tech_stack.map(t => `<div class="solutions-tech-pill">${getTechLogo(t)}<span>${t}</span></div>`).join('')}
                        </div>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- REMOVED: Free Resources, Proof, Tech Stack & Use Cases -->

    <!-- BENEFITS -->
    ${benefitsHtml}

    <!-- WHY US -->
    ${whyUsHtml}

    <!-- INDUSTRIES -->
    ${industriesHtml}

    <!-- APP PRICING -->
    ${appPricingHtml}

    <!-- DELIVERY PROCESS (STEPPER) -->
    <section class="compare-section fade-in content-section">
        <div class="container">
            <div class="section-header center service-section-header">
                <h4 class="mini-title service-mini-title">THE METHODOLOGY</h4>
                <h2 class="service-section-h2">How We Deliver Quality</h2>
            </div>
            <div class="stepper">
                ${service.process.map(p => `
                    <div class="stepper-step">
                        <h3 class="stepper-title">${p.number}. ${p.title}</h3>
                        <p class="stepper-desc">${p.desc}</p>
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
                    <div class="appstore-app-preview" style="width: 100%; height: 280px; background: linear-gradient(135deg, var(--bg-darker), rgba(255,26,26,0.1)); border-radius: 16px; margin-bottom: 32px; display: flex; align-items: center; justify-content: center; font-size: 4rem; border: 1px solid var(--border-light);">📱 App Preview</div>
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

function renderBlog(data) {
    const postsHtml = data.posts.map(post => `
        <a href="${post.url}" class="blog-card fade-in" style="text-decoration:none;color:inherit;">
            <div class="blog-card-thumb" style="background:color-mix(in srgb, ${post.tag_color} 12%, transparent)">${post.emoji}</div>
            <div class="blog-card-body">
                <span class="blog-tag" style="background:color-mix(in srgb, ${post.tag_color} 15%, transparent);color:${post.tag_color};">${post.tag}</span>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <div class="blog-card-footer">
                    <span class="blog-card-date">${post.date} · ${post.author} · ${post.read_time}</span>
                    <span class="read-more" style="margin:0;">→</span>
                </div>
            </div>
        </a>
    `).join('');

    return `
    <section class="blog-hero fade-in">
        <div class="container">
            <p class="mini-title">${data.hero.mini_title}</p>
            <h1>${data.hero.title}</h1>
            <p class="blog-hero-desc">${data.hero.description}</p>
        </div>
    </section>

    <div class="container">
        <div class="blog-filters fade-in">
            ${data.filters.map((f, i) => `<button class="blog-filter${i === 0 ? ' active' : ''}">${f}</button>`).join('')}
        </div>

        <a href="${data.featured.url}" class="blog-featured fade-in" style="text-decoration:none;color:inherit;">
            <div class="blog-featured-img" style="background:color-mix(in srgb, ${data.featured.tag_color} 12%, transparent)">${data.featured.emoji}</div>
            <div class="blog-featured-body">
                <span class="blog-tag" style="background:color-mix(in srgb, ${data.featured.tag_color} 15%, transparent);color:${data.featured.tag_color};">${data.featured.tag}</span>
                <h2>${data.featured.title}</h2>
                <p>${data.featured.description}</p>
                <div class="blog-meta">
                    <span>${data.featured.author}</span>
                    <span class="blog-meta-dot"></span>
                    <span>${data.featured.date}</span>
                    <span class="blog-meta-dot"></span>
                    <span>${data.featured.read_time}</span>
                </div>
                <span class="read-more">Read Article →</span>
            </div>
        </a>

        <div class="blog-grid">
            ${postsHtml}
        </div>

        <div class="blog-newsletter fade-in">
            <h2>${data.newsletter.title}</h2>
            <p>${data.newsletter.description}</p>
            <div class="nl-form">
                <input type="email" placeholder="${data.newsletter.placeholder}">
                <button>${data.newsletter.button_text}</button>
            </div>
        </div>
    </div>
    `;
}
