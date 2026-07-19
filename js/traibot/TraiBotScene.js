/**
 * TRAI Bot — Cosmos Hero v5
 * 4K Quality SaaS Agent Cards (Relay.app style)
 * Ultra-crisp SVGs, exact text, WhatsApp Sales Agent added.
 */
(function () {
    'use strict';

    let containerEl, canvas, ctx;
    let particles = [];
    let animationId, focusTimer;
    let mouseX = -1, mouseY = -1;
    let time = 0, W = 0, H = 0, dpr = 1;
    let isLight = false;
    let focusIdx = 0;

    const blobs = [
        { x: 0.25, y: 0.35, vx: 0.0004, vy: 0.00025, r: 0.55 },
        { x: 0.72, y: 0.55, vx: -0.00035, vy: 0.0004, r: 0.48 },
        { x: 0.55, y: 0.25, vx: 0.00015, vy: -0.00025, r: 0.42 },
        { x: 0.15, y: 0.72, vx: 0.0003, vy: -0.0002, r: 0.38 },
        { x: 0.80, y: 0.30, vx: -0.0002, vy: 0.0003, r: 0.35 },
    ];
    const blobC = {
        dark:  [[255,80,0,.18],[200,0,220,.14],[30,60,180,.12],[255,160,0,.15],[120,0,255,.10]],
        light: [[255,120,50,.08],[180,80,220,.07],[80,120,240,.06],[255,180,60,.07],[140,80,255,.06]]
    };

    /* ── High-Fidelity SVGs ── */
    const svgs = {
        blueFlower: `<svg viewBox="0 0 100 100" class="agent-svg"><g fill="#4338ca" opacity="0.85">${Array.from({length:16}).map((_,i)=>`<path d="M50 50 C 60 30, 70 20, 50 5 C 30 20, 40 30, 50 50" transform="rotate(${i*22.5} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="8" fill="#1e3a8a"/></svg>`,
        greenFlower: `<svg viewBox="0 0 100 100" class="agent-svg"><g fill="#16a34a" opacity="0.8">${Array.from({length:10}).map((_,i)=>`<path d="M50 50 C 70 40, 80 15, 50 5 C 20 15, 30 40, 50 50" transform="rotate(${i*36} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="10" fill="#14532d"/></svg>`,
        goldSpiral: `<svg viewBox="0 0 100 100" class="agent-svg"><g fill="#d97706" opacity="0.9">${Array.from({length:12}).map((_,i)=>`<circle cx="50" cy="22" r="6" transform="rotate(${i*30} 50 50)"/><circle cx="50" cy="35" r="4" transform="rotate(${i*30+15} 50 50)" fill="#b45309"/>`).join('')}</g></svg>`,
        blueWire: `<svg viewBox="0 0 100 100" class="agent-svg"><g stroke="#2563eb" stroke-width="1.5" fill="none">${Array.from({length:16}).map((_,i)=>`<ellipse cx="50" cy="50" rx="35" ry="12" transform="rotate(${i*11.25} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="6" fill="#1d4ed8"/></svg>`,
        redFlower: `<svg viewBox="0 0 100 100" class="agent-svg"><g fill="#dc2626" opacity="0.85">${Array.from({length:12}).map((_,i)=>`<circle cx="50" cy="24" r="14" transform="rotate(${i*30} 50 50)"/><circle cx="50" cy="38" r="8" transform="rotate(${i*30+15} 50 50)" fill="#991b1b"/>`).join('')}</g></svg>`,
        salesFlower: `<svg viewBox="0 0 100 100" class="agent-svg"><g fill="#10b981" opacity="0.8">${Array.from({length:8}).map((_,i)=>`<path d="M50 50 L 65 20 L 50 5 L 35 20 Z" transform="rotate(${i*45} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="12" fill="#047857"/></svg>`
    };

    /* ── Addon Brand Icons ── */
    const icons = {
        slack: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 0 1-2.521 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.166 18.956a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.522h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.52 2.528 2.528 0 0 1 2.521-2.522h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.52H15.166z" fill="#E01E5A"/></svg>`,
        linkedin: `<svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
        youtube: `<svg width="12" height="12" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
        x: `<svg width="11" height="11" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
        reddit: `<svg width="13" height="13" viewBox="0 0 24 24" fill="#FF4500"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.561-1.25-1.25-1.25zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .466c.843.84 2.486.914 2.961.914.474 0 2.105-.056 2.961-.914a.336.336 0 0 0 0-.466.336.336 0 0 0-.466 0c-.326.326-1.31.526-2.495.526-1.18 0-2.15-.205-2.5-.526a.322.322 0 0 0-.23-.094z"/></svg>`,
        front: `<svg width="12" height="12" viewBox="0 0 24 24" fill="#0066FF"><path d="M12 0l12 6.5v11L12 24 0 17.5v-11L12 0zm0 13.5l8-4.5-8-4.5-8 4.5 8 4.5z"/></svg>`,
        whatsapp: `<svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>`,
        globe: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>`,
        database: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`
    };

    /* ── Exact Relay.app Style Cards ── */
    const agents = [
        {
            name: 'Sales Agent',
            doing: 'Qualifying incoming leads ...',
            sub: `<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;background:#25D366;border-radius:50%;flex-shrink:0"><svg width="10" height="10" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg></span> ${icons.globe} <span style="color:#4b5563">Engaging 12 prospects</span>`,
            bg: 'radial-gradient(circle at 50% 38%, #a7f3d0 0%, #d1fae5 40%, #ecfdf5 100%)',
            svg: svgs.salesFlower,
        },
        {
            name: 'Competitive Analyst',
            doing: 'Creating weekly report ...',
            sub: `${icons.slack} <span style="color:#4b5563">Sharing to #research</span>`,
            bg: 'radial-gradient(circle at 50% 38%, #c7d2fe 0%, #e0e7ff 40%, #f1f5f9 100%)',
            svg: svgs.blueFlower,
        },
        {
            name: 'Social Marketer',
            doing: 'Tracks engagement across social media channels',
            sub: `<span style="color:#4b5563;margin-right:6px">2 workflows</span> ${icons.linkedin} ${icons.youtube} ${icons.x} <span style="background:#e5e7eb;padding:1px 4px;border-radius:4px;font-size:7.5px;color:#4b5563;font-weight:600">+3</span>`,
            bg: 'radial-gradient(circle at 50% 38%, #bbf7d0 0%, #dcfce7 40%, #f0fdf4 100%)',
            svg: svgs.greenFlower,
        },
        {
            name: 'Reddit Agent',
            doing: 'Monitoring subreddit ...',
            sub: `${icons.reddit} <span style="color:#4b5563">Found mention 'Trai Inc'</span>`,
            bg: 'radial-gradient(circle at 50% 38%, #fde68a 0%, #fef3c7 40%, #fefce8 100%)',
            svg: svgs.goldSpiral,
        },
        {
            name: 'Company AI Brain',
            doing: 'Indexing internal knowledge ...',
            sub: `${icons.database} <span style="color:#4b5563">Full knowledge of Trai Inc</span>`,
            bg: 'radial-gradient(circle at 50% 38%, #bfdbfe 0%, #dbeafe 40%, #f0f9ff 100%)',
            svg: svgs.blueWire,
        },
        {
            name: 'Support Agent',
            doing: 'Handling support request ...',
            sub: `${icons.front} <span style="color:#4b5563">Analyzing incoming email</span>`,
            bg: 'radial-gradient(circle at 50% 38%, #fecaca 0%, #fee2e2 40%, #fef2f2 100%)',
            svg: svgs.redFlower,
        }
    ];

    function init(selector) {
        containerEl = document.querySelector(selector);
        if (!containerEl) return;
        isLight = document.body.classList.contains('light-mode');

        containerEl.innerHTML = '';
        containerEl.style.cssText = 'position:absolute;inset:0;overflow:hidden;z-index:0;';

        canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:1;';
        containerEl.appendChild(canvas);
        ctx = canvas.getContext('2d');

        const orb = document.createElement('div');
        orb.className = 'cosmos-orb';
        containerEl.appendChild(orb);

        containerEl.appendChild(buildMacBook());
        injectStyles();

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        resize();
        window.addEventListener('resize', resize);
        containerEl.addEventListener('mousemove', onMouse);
        containerEl.addEventListener('mouseleave', () => { mouseX = -1; mouseY = -1; });

        new MutationObserver(() => {
            const nl = document.body.classList.contains('light-mode');
            if (nl !== isLight) { isLight = nl; updateTheme(); }
        }).observe(document.body, { attributes: true, attributeFilter: ['class'] });

        animate();
        startFocus();
    }

    function updateTheme() {
        const h = document.querySelector('.hero-cosmos');
        if (h) h.classList.toggle('hero-cosmos--light', isLight);
    }

    /* ═══ MacBook ═══ */
    function buildMacBook() {
        const w = document.createElement('div');
        w.className = 'mac-wrap';
        w.innerHTML = `
            <div class="mac-frame">
                <div class="mac-notch"><div class="mac-cam"></div></div>
                <div class="mac-screen">
                    <div class="mac-tb">
                        <div class="mac-dots"><span class="d-r"></span><span class="d-y"></span><span class="d-g"></span></div>
                        <span class="mac-tt">TRAI · AI Agent Hub</span>
                    </div>
                    <div class="mac-saas">
                        <div class="mac-saas-header">
                            <span class="mac-saas-label">Your Agents</span>
                            <span class="mac-saas-count">${agents.length} active</span>
                        </div>
                        <div class="mac-cards-scroll" id="mac-cards-scroll">
                            <div class="mac-cards-track" id="mac-cards-track"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mac-base"><div class="mac-hinge"></div></div>
        `;

        const track = w.querySelector('#mac-cards-track');
        agents.forEach((a, i) => {
            const c = document.createElement('div');
            c.className = 'saas-card';
            c.style.background = a.bg;
            c.style.animationDelay = `${0.6 + i * 0.14}s`;
            c.dataset.idx = i;

            c.innerHTML = `
                <div class="card-icon-wrap">
                    ${a.svg}
                </div>
                <div class="card-info">
                    <span class="card-name">${a.name}</span>
                    ${a.doing ? `<span class="card-doing">${a.doing}</span>` : ''}
                    ${a.sub ? `<div class="card-sub-row">${a.sub}</div>` : ''}
                </div>
            `;
            track.appendChild(c);
        });

        return w;
    }

    /* ═══ Focus Cycling ═══ */
    function startFocus() {
        doFocus();
        focusTimer = setInterval(doFocus, 3500);
    }
    function doFocus() {
        const cards = document.querySelectorAll('.saas-card');
        cards.forEach((c, i) => c.classList.toggle('saas-card--focus', i === focusIdx));

        const track = document.getElementById('mac-cards-track');
        const scroll = document.getElementById('mac-cards-scroll');
        if (track && scroll) {
            const card = cards[focusIdx];
            if (card) {
                const offset = card.offsetLeft - scroll.offsetWidth / 2 + card.offsetWidth / 2;
                scroll.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
            }
        }
        focusIdx = (focusIdx + 1) % agents.length;
    }

    /* ═══ Canvas ═══ */
    function resize() {
        if (!containerEl || !canvas) return;
        W = containerEl.clientWidth; H = containerEl.clientHeight;
        canvas.width = W * dpr; canvas.height = H * dpr;
        initParticles();
    }
    function initParticles() {
        particles = [];
        const n = Math.min(65, Math.floor((W * H) / 14000));
        for (let i = 0; i < n; i++) {
            particles.push({
                x: Math.random()*W, y: Math.random()*H,
                vx: (Math.random()-.5)*.5, vy: (Math.random()-.5)*.5,
                r: Math.random()*1.3+.4, o: Math.random()*.4+.12,
                pulse: Math.random()*Math.PI*2
            });
        }
    }
    function drawAurora() {
        ctx.fillStyle = isLight ? '#f0f0f8' : '#050508';
        ctx.fillRect(0, 0, W, H);
        const cc = isLight ? blobC.light : blobC.dark;
        blobs.forEach((b, i) => {
            b.x += b.vx; b.y += b.vy;
            if (b.x < .05 || b.x > .95) b.vx *= -1;
            if (b.y < .05 || b.y > .95) b.vy *= -1;
            const br = 1 + Math.sin(time*.008 + b.x*10)*.15;
            const cx = b.x*W, cy = b.y*H, r = b.r*Math.max(W,H)*br, c = cc[i];
            const g = ctx.createRadialGradient(cx,cy,0,cx,cy,r);
            g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${c[3]*1.5})`);
            g.addColorStop(.35, `rgba(${c[0]},${c[1]},${c[2]},${c[3]*.6})`);
            g.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
        });
    }
    function drawParticles() {
        const pc = isLight ? '80,80,120' : '255,255,255';
        const lc = isLight ? '120,80,200' : '255,140,60';
        const mc = isLight ? '100,60,220' : '255,106,0';
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy; p.pulse += .02;
            if (p.x<0||p.x>W) p.vx*=-1;
            if (p.y<0||p.y>H) p.vy*=-1;
            const a = p.o + Math.sin(p.pulse)*.12;
            ctx.beginPath(); ctx.fillStyle = `rgba(${pc},${a})`;
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
            for (let j=i+1;j<particles.length;j++){
                const p2=particles[j], dx=p.x-p2.x, dy=p.y-p2.y, d=Math.sqrt(dx*dx+dy*dy);
                if(d<140){ctx.beginPath();ctx.strokeStyle=`rgba(${lc},${.07*(1-d/140)})`;ctx.lineWidth=.5;ctx.moveTo(p.x,p.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();}
            }
            if(mouseX>0){const dx=p.x-mouseX,dy=p.y-mouseY,md=Math.sqrt(dx*dx+dy*dy);if(md<200){ctx.beginPath();ctx.strokeStyle=`rgba(${mc},${.2*(1-md/200)})`;ctx.lineWidth=.7;ctx.moveTo(p.x,p.y);ctx.lineTo(mouseX,mouseY);ctx.stroke();}}
        }
    }
    function onMouse(e) {
        const r = containerEl.getBoundingClientRect();
        mouseX = e.clientX - r.left; mouseY = e.clientY - r.top;
        const orb = containerEl.querySelector('.cosmos-orb');
        if (orb) { orb.style.transform = `translate(${((mouseX/W)-.5)*35}px, ${((mouseY/H)-.5)*20}px)`; }
    }
    function animate() {
        animationId = requestAnimationFrame(animate);
        time++;
        ctx.setTransform(dpr,0,0,dpr,0,0);
        drawAurora(); drawParticles();
    }

    /* ═══ Styles ═══ */
    function injectStyles() {
        if (document.getElementById('cosmos-v5-styles')) return;
        const s = document.createElement('style');
        s.id = 'cosmos-v5-styles';
        s.textContent = `
.cosmos-orb {
    position:absolute;top:50%;left:30%;width:500px;height:500px;margin:-250px 0 0 -250px;
    border-radius:50%;
    background:radial-gradient(circle at 35% 35%,rgba(255,140,60,.28),rgba(255,60,0,.10) 50%,transparent 72%);
    filter:blur(50px);z-index:2;pointer-events:none;
    animation:orbP 6s infinite alternate ease-in-out;
    transition:transform .3s ease-out;
}
.hero-cosmos--light .cosmos-orb {
    background:radial-gradient(circle at 35% 35%,rgba(140,80,255,.12),rgba(80,120,255,.06) 50%,transparent 72%);
}
@keyframes orbP{0%{opacity:.5;transform:scale(.92)}50%{opacity:.85;transform:scale(1.05)}100%{opacity:.6;transform:scale(.96)}}

/* ═══ MacBook ═══ */
.mac-wrap {
    position:absolute;right:4%;top:50%;
    transform:translateY(-50%) perspective(1400px) rotateY(-6deg) rotateX(2deg);
    z-index:8;pointer-events:none;
    animation:macF 6s infinite ease-in-out, macIn 1.2s cubic-bezier(.16,1,.3,1) both;
    filter:drop-shadow(0 40px 80px rgba(0,0,0,.4));
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
}
@keyframes macIn{from{opacity:0;transform:translateY(-40%) perspective(1400px) rotateY(-10deg) rotateX(4deg) scale(.88)}to{opacity:1;transform:translateY(-50%) perspective(1400px) rotateY(-6deg) rotateX(2deg) scale(1)}}
@keyframes macF{0%,100%{transform:translateY(-50%) perspective(1400px) rotateY(-6deg) rotateX(2deg)}50%{transform:translateY(-52%) perspective(1400px) rotateY(-4deg) rotateX(1deg)}}

.mac-frame {
    width:620px;
    background:linear-gradient(180deg,#2c2c30,#1c1c20);
    border-radius:16px 16px 0 0;
    border:1.5px solid rgba(255,255,255,.08);border-bottom:none;
    overflow:hidden;box-shadow:inset 0 1px 0 rgba(255,255,255,.12);
}
.mac-notch{width:100%;height:26px;display:flex;justify-content:center;align-items:center;background:linear-gradient(180deg,#383838,#2c2c30)}
.mac-cam{width:7px;height:7px;border-radius:50%;background:radial-gradient(circle,#444,#222);box-shadow:0 0 4px rgba(100,120,255,.2)}

/* ── Screen (LIGHT SaaS interior) ── */
.mac-screen {
    position:relative;
    margin:0 12px 12px;
    background:#ffffff;
    border-radius:8px;overflow:hidden;
    border:1px solid rgba(0,0,0,.1);
    box-shadow: 0 4px 20px rgba(0,0,0,0.15) inset;
}

/* Toolbar */
.mac-tb {
    display:flex;align-items:center;gap:10px;
    padding:10px 16px;
    background:#ffffff;
    border-bottom:1px solid #f1f5f9;
}
.mac-dots{display:flex;gap:6px}
.mac-dots span{width:10px;height:10px;border-radius:50%;box-shadow: inset 0 0 4px rgba(0,0,0,0.1)}
.d-r{background:#ff5f57} .d-y{background:#febc2e} .d-g{background:#28c840}
.mac-tt{font-family:'Inter',sans-serif;font-size:11px;font-weight:600;color:#94a3b8;letter-spacing:.04em;flex:1;text-align:center}

/* ── SaaS Body ── */
.mac-saas {
    padding:16px 20px 24px;
    background: linear-gradient(180deg, #f8fafc, #eff6ff);
}
.mac-saas-header {
    display:flex;justify-content:space-between;align-items:center;
    margin-bottom:16px;
}
.mac-saas-label {
    font-family:'Inter',sans-serif;font-size:14px;font-weight:700;
    color:#1e293b;
}
.mac-saas-count {
    font-family:'Inter',sans-serif;font-size:11px;font-weight:600;
    color:#64748b;
    background: #e2e8f0;
    padding: 2px 8px;
    border-radius: 12px;
}

/* ── Horizontal scroll ── */
.mac-cards-scroll {
    overflow-x:auto;overflow-y:hidden;
    scrollbar-width:none;
    -ms-overflow-style:none;
    scroll-behavior:smooth;
}
.mac-cards-scroll::-webkit-scrollbar{display:none}
.mac-cards-track {
    display:flex;gap:16px;
    padding-bottom:16px;
    padding-top: 4px;
}

/* ═══ SaaS Card (High-Fidelity Relay.app style) ═══ */
.saas-card {
    flex:0 0 160px;
    height: 200px;
    border-radius:12px;
    padding:16px;
    border:1px solid rgba(0,0,0,.04);
    opacity:0;transform:translateY(14px) scale(.96);
    animation:cardIn .55s cubic-bezier(.16,1,.3,1) forwards;
    transition:transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s;
    cursor:default;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
}
@keyframes cardIn{to{opacity:1;transform:translateY(0) scale(1)}}

/* Focus spotlight */
.saas-card--focus {
    transform:scale(1.05) translateY(-4px);
    box-shadow:0 12px 30px rgba(0,0,0,.08), 0 0 0 2px rgba(99,102,241,.1);
}

/* ── SVG Icons ── */
.card-icon-wrap {
    width:100%;height:80px;
    display:flex;align-items:center;justify-content:center;
    margin-bottom:16px;
}
.agent-svg {
    width:70px; height:70px;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.06));
    animation: svgSpin 20s linear infinite;
}
@keyframes svgSpin { to { transform: rotate(360deg); } }

/* ── Card text ── */
.card-info{display:flex;flex-direction:column;gap:4px; margin-top: auto;}
.card-name{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:#1e293b;line-height:1.2}
.card-doing{font-family:'Inter',sans-serif;font-size:9.5px;color:#475569;line-height:1.3; margin-top: 4px;}
.card-sub-row {
    font-family:'Inter',sans-serif;font-size:9px;color:#64748b;line-height:1.3;
    display:flex;align-items:center;gap:4px; margin-top: 6px;
    flex-wrap: wrap;
}
.card-sub-row svg { flex-shrink: 0; }

/* ── MacBook Base ── */
.mac-base{width:660px;height:12px;margin:0 auto;background:linear-gradient(180deg,#2c2c30,#1c1c20);border-radius:0 0 8px 8px;position:relative;left:-20px;border:1.5px solid rgba(255,255,255,.06);border-top:1px solid rgba(255,255,255,.1)}
.mac-hinge{width:80px;height:4px;background:rgba(255,255,255,.08);border-radius:0 0 4px 4px;margin:0 auto}

/* ── Responsive ── */
@media(max-width:1200px){.mac-wrap{right:2%}.mac-frame{width:520px}.mac-base{width:560px}.saas-card{flex:0 0 140px}}
@media(max-width:900px){.mac-wrap{display:none}.cosmos-orb{left:50%;width:320px;height:320px;margin:-160px 0 0 -160px}}
        `;
        document.head.appendChild(s);
    }

    window.TraiBot = {
        init(sel) { init(sel); },
        destroy() {
            if (animationId) cancelAnimationFrame(animationId);
            if (focusTimer) clearInterval(focusTimer);
            window.removeEventListener('resize', resize);
            if (containerEl) { containerEl.removeEventListener('mousemove', onMouse); containerEl.innerHTML = ''; }
        }
    };
})();
