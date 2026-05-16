/**
 * Generates business size category pages
 * Run: node generate-biz-pages.js
 */
const fs = require('fs');

const pages = [
    {
        file: 'micro-business.html',
        page: 'micro-business',
        title: 'Micro Business & MSMEs',
        emoji: '🏪',
        tagline: 'Local Shops & Small Teams',
        desc: 'We help micro businesses and MSMEs build their digital presence fast — affordable websites, WhatsApp automation, and local SEO that converts foot traffic to sales.',
        color1: '#f6d365', color2: '#fda085',
        features: ['Affordable Websites','WhatsApp Automation','Local SEO','Social Media Setup','GST & Invoicing Tools','Branding & Logo'],
        clientIds: ['retail','media','education'],
        highlight: '₹ Budget-Friendly'
    },
    {
        file: 'startups.html',
        page: 'startups',
        title: 'Startups',
        emoji: '🚀',
        tagline: 'Innovative Product Builders',
        desc: 'From MVP to scale — we are the tech partner startups trust for rapid product development, cloud infrastructure, and AI-powered automation to beat the market.',
        color1: '#96fbc4', color2: '#f9f586',
        features: ['MVP Development','Cloud & DevOps','AI Integration','Product Design','Investor Pitch Decks','Growth Hacking'],
        clientIds: ['retail','media'],
        highlight: '⚡ Move Fast'
    },
    {
        file: 'smb.html',
        page: 'smb',
        title: 'Small & Medium Business',
        emoji: '🏢',
        tagline: 'Regional & National Reach',
        desc: 'SMBs need enterprise-grade technology without enterprise costs. We deliver CRMs, mobile apps, data analytics, and digital marketing that scales with you.',
        color1: '#a1c4fd', color2: '#c2e9fb',
        features: ['Custom CRM','Mobile Apps','Data Analytics','ERP Integration','Digital Marketing','HR Systems'],
        clientIds: ['real-estate','education','healthcare'],
        highlight: '📈 Scale Up'
    },
    {
        file: 'enterprise.html',
        page: 'enterprise',
        title: 'Large Enterprises',
        emoji: '🏗️',
        tagline: 'Global Corporate Solutions',
        desc: 'Enterprise-scale engineering, cloud migrations, AI agent deployment, and cybersecurity hardening for organisations operating at national and global scale.',
        color1: '#fbc7d4', color2: '#9796f0',
        features: ['Cloud Migration','AI Agents & LLMs','Cybersecurity','Enterprise Platforms','Data Engineering','24/7 SLA Support'],
        clientIds: ['transport','enterprise','real-estate'],
        highlight: '🌍 Enterprise Grade'
    },
    {
        file: 'nonprofit.html',
        page: 'nonprofit',
        title: 'Non Profit Organisations',
        emoji: '🤲',
        tagline: 'Funded by Grants & Donors',
        desc: 'We believe in giving back. Our non-profit pricing, volunteer tech support, and grant-optimised digital solutions help mission-driven organisations amplify their impact.',
        color1: '#d299c2', color2: '#fef9d7',
        features: ['Grant-Ready Websites','Donor Management','CRM for NGOs','Social Impact Reporting','Volunteer Portals','Awareness Campaigns'],
        clientIds: ['education','healthcare'],
        highlight: '❤️ Impact-First'
    }
];

const clients = JSON.parse(fs.readFileSync('data/clients.json','utf8'));

const palettes = [
    ['#667eea','#764ba2'],['#f093fb','#f5576c'],['#4facfe','#00f2fe'],
    ['#43e97b','#38f9d7'],['#fa709a','#fee140'],['#a18cd1','#fbc2eb'],
    ['#30cfd0','#667eea'],['#f6d365','#fda085'],['#96fbc4','#f9f586'],
    ['#fbc7d4','#9796f0'],['#d299c2','#fef9d7'],['#ffecd2','#fcb69f'],
];

function initials(name) {
    return name.split(' ').slice(0,2).map(w => w[0]?.toUpperCase() || '').join('');
}

pages.forEach(p => {
    // Gather relevant clients
    const relevantCats = clients.categories.filter(c => p.clientIds.includes(c.id));
    
    const logoSections = relevantCats.map(cat => {
        const cards = cat.clients.map((name, i) => {
            const [c1, c2] = palettes[i % palettes.length];
            const init = initials(name);
            return `
                <div class="logo-card">
                    <div class="logo-avatar" style="background:linear-gradient(135deg,${c1},${c2})">${init}</div>
                    <div class="logo-name">${name}</div>
                </div>`;
        }).join('');
        return `
            <div class="cat-section">
                <div class="section-divider">
                    <span class="cat-icon">${cat.icon}</span>
                    <h3>${cat.label}</h3>
                    <div class="section-divider-line"></div>
                    <span class="client-count">${cat.clients.length} clients</span>
                </div>
                <div class="logo-grid">${cards}</div>
            </div>`;
    }).join('');

    const featureCards = p.features.map(f =>
        `<div class="feature-pill">✓ ${f}</div>`
    ).join('');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Trai Inc solutions for ${p.title} — ${p.desc}">
    <title>${p.title} | Trai Inc Services</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=31">
    <style>
        .biz-hero {
            min-height: 55vh;
            display: flex;
            align-items: center;
            padding-top: 110px;
            padding-bottom: 70px;
            background: radial-gradient(ellipse at 65% 40%, rgba(255,26,26,0.16) 0%, transparent 60%),
                        radial-gradient(ellipse at 20% 75%, rgba(232,0,209,0.10) 0%, transparent 55%);
        }
        .biz-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 16px;
            border-radius: 50px;
            background: linear-gradient(135deg, ${p.color1}22, ${p.color2}22);
            border: 1px solid ${p.color1}55;
            font-size: 0.8rem;
            font-weight: 700;
            color: ${p.color1};
            margin-bottom: 20px;
            letter-spacing: 0.5px;
        }
        .biz-hero h1 {
            font-family: var(--font-heading);
            font-size: clamp(2.4rem, 5vw, 3.8rem);
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 16px;
        }
        .biz-hero p {
            font-size: 1.05rem;
            color: var(--text-muted);
            max-width: 540px;
            line-height: 1.75;
            margin-bottom: 32px;
        }
        .biz-emoji {
            font-size: 5rem;
            margin-bottom: 16px;
            display: block;
            filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4));
        }

        /* Features row */
        .feature-pills {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 64px;
        }
        .feature-pill {
            padding: 8px 18px;
            border-radius: 50px;
            font-size: 0.83rem;
            font-weight: 600;
            background: linear-gradient(135deg, ${p.color1}18, ${p.color2}18);
            border: 1px solid ${p.color1}44;
            color: var(--text-main);
        }

        /* Clients heading */
        .clients-heading {
            text-align: center;
            margin-bottom: 52px;
        }
        .clients-heading h2 {
            font-family: var(--font-heading);
            font-size: 2rem;
            font-weight: 800;
            margin-bottom: 12px;
        }
        .clients-heading p { color: var(--text-muted); font-size: 0.95rem; }

        /* Decorative slashes */
        .slash-deco {
            display: inline-flex;
            gap: 4px;
            margin: 0 12px;
            vertical-align: middle;
        }
        .slash-deco span {
            width: 3px;
            height: 22px;
            border-radius: 2px;
            background: linear-gradient(135deg, ${p.color1}, ${p.color2});
            display: inline-block;
        }
        .slash-deco span:nth-child(2) { opacity: 0.6; }
        .slash-deco span:nth-child(3) { opacity: 0.3; }

        /* Section divider */
        .section-divider {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 28px;
        }
        .section-divider h3 {
            font-family: var(--font-heading);
            font-size: 1.2rem;
            font-weight: 700;
            white-space: nowrap;
        }
        .section-divider-line { flex:1; height:1px; background:var(--border-light); }
        .cat-icon { font-size: 1.3rem; }
        .client-count { font-size:0.78rem; color:var(--text-muted); font-weight:600; white-space:nowrap; }
        .cat-section { margin-bottom: 60px; }

        /* Logo grid */
        .logo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
        }
        .logo-card {
            background: var(--bg-card);
            border: 1px solid var(--border-light);
            border-radius: 14px;
            padding: 18px 12px 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 9px;
            text-align: center;
            transition: all 0.25s ease;
        }
        .logo-card:hover {
            border-color: ${p.color1};
            transform: translateY(-4px);
            box-shadow: 0 10px 28px rgba(0,0,0,0.22);
        }
        .logo-avatar {
            width: 50px; height: 50px; border-radius: 12px;
            display: flex; align-items: center; justify-content: center;
            font-family: var(--font-heading); font-size: 1rem; font-weight: 800;
            color: #fff; flex-shrink: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2);
            position: relative;
        }
        .logo-avatar::after {
            content:''; position:absolute; inset:0; border-radius:12px;
            background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 55%);
        }
        .logo-name { font-size: 0.76rem; font-weight: 600; color: var(--text-main); line-height: 1.3; }

        /* CTA */
        .biz-cta {
            background: linear-gradient(135deg, ${p.color1}18, ${p.color2}18);
            border: 1px solid ${p.color1}44;
            border-radius: 24px;
            padding: 56px 40px;
            text-align: center;
            margin-bottom: 80px;
        }
        .biz-cta h2 { font-family:var(--font-heading); font-size:2rem; font-weight:800; margin-bottom:14px; }
        .biz-cta p { color:var(--text-muted); font-size:1rem; margin-bottom:28px; }
        .btn-grad {
            display: inline-flex;
            padding: 14px 32px;
            border-radius: 12px;
            background: linear-gradient(135deg, ${p.color1}, ${p.color2});
            color: #1a1114;
            font-weight: 700;
            font-size: 0.95rem;
            text-decoration: none;
            transition: all 0.25s ease;
            box-shadow: 0 6px 20px ${p.color1}44;
        }
        .btn-grad:hover { transform: translateY(-3px); box-shadow: 0 10px 28px ${p.color1}66; }

        @media (max-width:768px) {
            .logo-grid { grid-template-columns: repeat(auto-fill, minmax(120px,1fr)); }
            .biz-cta { padding: 36px 24px; }
        }
    </style>
</head>
<body data-page="${p.page}">
    <nav id="navbar"></nav>

    <section class="biz-hero">
        <div class="container">
            <span class="biz-emoji">${p.emoji}</span>
            <div class="biz-badge">${p.highlight}</div>
            <h1>${p.title}</h1>
            <p>${p.desc}</p>
            <a href="https://calendar.app.google/G5gpfjVBntAPFQMj6" target="_blank" class="btn-grad">📅 Get a Free Consultation</a>
        </div>
    </section>

    <div class="container">
        <!-- What We Offer -->
        <div style="margin-bottom:64px;">
            <h2 style="font-family:var(--font-heading);font-size:1.5rem;font-weight:700;margin-bottom:20px;">What We Offer for ${p.title}</h2>
            <div class="feature-pills">${featureCards}</div>
        </div>

        <!-- Our Valuable Clients -->
        <div class="clients-heading">
            <h2>
                <span class="slash-deco"><span></span><span></span><span></span></span>
                Our Valuable Clients
                <span class="slash-deco"><span></span><span></span><span></span></span>
            </h2>
            <p>Businesses that trusted us across related sectors</p>
        </div>

        ${logoSections}

        <div style="text-align:center;margin-bottom:48px;">
            <a href="clients.html" style="color:var(--text-muted);font-size:0.9rem;font-weight:600;text-decoration:none;border-bottom:1px solid var(--border-light);padding-bottom:2px;">View All 120+ Clients →</a>
        </div>

        <!-- CTA -->
        <div class="biz-cta">
            <h2>Ready to Grow Your ${p.emoji} Business?</h2>
            <p>Join ${p.tagline} — let's build your digital future together.</p>
            <a href="https://calendar.app.google/G5gpfjVBntAPFQMj6" target="_blank" class="btn-grad">📅 Book a Free Discovery Call</a>
        </div>
    </div>

    <footer id="footer"></footer>
    <script src="script.js?v=31"></script>
    <script src="nav.js?v=3"></script>
</body>
</html>`;

    fs.writeFileSync(p.file, html, 'utf8');
    console.log(`✅ Created ${p.file}`);
});

console.log('\n🎉 All 5 business-size pages generated!');
