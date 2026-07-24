const fs = require('fs');
const path = require('path');
const http = require('http');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const PORT = 9999;
const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

const skipEntries = new Set([
    '.git', '.github', '.agents', '.claude', '.gitignore', '.DS_Store',
    'node_modules', 'dist', 'functions',
    'build.js', 'package.json', 'package-lock.json',
    'screenshots', 'docs', 'CLAUDE.md', 'llms.txt'
]);
const skipExtensions = new Set(['.py', '.patch', '.pdf', '.md', '.sh']);

function copyDirectory(src, dest, isRoot) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        if (skipEntries.has(entry.name)) continue;
        if (isRoot && !entry.isDirectory() && skipExtensions.has(path.extname(entry.name).toLowerCase())) continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) copyDirectory(srcPath, destPath, false);
        else if (!entry.name.endsWith('.html') || entry.name === '404.html') {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log("Copying static assets to dist...");
copyDirectory(rootDir, distDir, true);

['robots.txt', '_redirects'].forEach(file => {
    if (fs.existsSync(path.join(rootDir, file))) {
        fs.copyFileSync(path.join(rootDir, file), path.join(distDir, file));
    }
});

const server = http.createServer((req, res) => {
    let filePath = path.join(rootDir, req.url.split('?')[0]);
    
    if (filePath === rootDir || filePath === rootDir + '/') filePath = path.join(rootDir, 'index.html');
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        if (filePath.endsWith('.js')) res.writeHead(200, {'Content-Type': 'application/javascript'});
        else if (filePath.endsWith('.css')) res.writeHead(200, {'Content-Type': 'text/css'});
        else if (filePath.endsWith('.json')) res.writeHead(200, {'Content-Type': 'application/json'});
        else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            if (filePath.endsWith('.html')) {
                let htmlStr = data.toString('utf8');
                const vNow = Date.now();
                htmlStr = htmlStr.replace(/css\/style\.css\?v=\d+/g, `css/style.css?v=${vNow}`);
                htmlStr = htmlStr.replace(/js\/app\.js\?v=\d+/g, `js/app.js?v=${vNow}`);
                htmlStr = htmlStr.replace(/js\/nav\.js\?v=\d+/g, `js/nav.js?v=${vNow}`);
                // Prevent JSDOM from loading external maps script which crashes it
                htmlStr = htmlStr.replace(/<script src="https:\/\/maps\.googleapis\.com/g, '<script data-mocked-src="https://maps.googleapis.com');
                res.end(htmlStr);
                return;
            }
        }
        res.end(data);
    });
});

server.listen(PORT, async () => {
    console.log(`Local server started on port ${PORT}`);
    const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== '404.html' && f !== 'client-reviews.html');
    
    const virtualConsole = new jsdom.VirtualConsole();
    
    // For sitemap generation
    const sitemapUrls = [];

    for (const file of htmlFiles) {
        console.log(`Building ${file}...`);
        try {
            const url = `http://localhost:${PORT}/${file}`;
            const dom = await JSDOM.fromURL(url, {
                runScripts: "dangerously",
                resources: "usable",
                pretendToBeVisual: true,
                virtualConsole,
                beforeParse(window) {
                    window.fetch = (reqUrl, options) => {
                        let finalUrl = reqUrl;
                        if (finalUrl.startsWith('/')) finalUrl = `http://localhost:${PORT}${finalUrl}`;
                        else if (!finalUrl.startsWith('http')) finalUrl = `http://localhost:${PORT}/${finalUrl}`;
                        return fetch(finalUrl, options);
                    };
                    window.IntersectionObserver = class IntersectionObserver {
                        constructor() {}
                        observe() {}
                        unobserve() {}
                        disconnect() {}
                    };
                    window.matchMedia = function() {
                        return { matches: false, addListener: function() {}, removeListener: function() {} };
                    };
                    window.scrollTo = function() {};
                    if (window.performance) {
                        Object.getPrototypeOf(window.performance).getEntriesByType = () => [];
                    }
                }
            });
            
            await new Promise(resolve => {
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    const content = dom.window.document.getElementById('content');
                    const navbar = dom.window.document.getElementById('navbar');
                    const contentReady = content && !content.innerHTML.includes('Loading...');
                    const navReady = navbar && navbar.innerHTML.trim() !== '';
                    
                    if ((contentReady && navReady) || attempts > 50 || (!content && navReady)) {
                        clearInterval(interval);
                        resolve();
                    }
                }, 100);
            });
            
            const head = dom.window.document.head;
            const script = dom.window.document.createElement('script');
            script.textContent = `
        if (/bot|googlebot|crawler|spider|robot|crawling|inspectiontool|lighthouse/i.test(navigator.userAgent)) {
            document.documentElement.classList.add('bot-detected');
        }`;
            head.appendChild(script);

            dom.window.document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('visible');
            });

            const newVersion = Date.now();
            dom.window.document.querySelectorAll('script[src]').forEach(s => {
                if (s.src && s.src.includes('?v=')) s.src = s.src.replace(/v=\d+/, `v=${newVersion}`);
            });
            dom.window.document.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
                if (l.href && l.href.includes('?v=')) l.href = l.href.replace(/v=\d+/, `v=${newVersion}`);
            });
            
            // Schema Injection
            let schemas = [];
            let schemaJson = null;
            let breadcrumbSchema = null;
            if (file !== 'index.html' && file !== '404.html') {
                const title = (dom.window.document.title.split('|')[0] || dom.window.document.title.split('-')[0] || file.replace('.html', '')).trim();
                breadcrumbSchema = {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [{
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://traiinc.com"
                    },{
                        "@type": "ListItem",
                        "position": 2,
                        "name": title,
                        "item": `https://traiinc.com/${file.replace('.html', '')}`
                    }]
                };
            }
            if (file !== '404.html') {
                schemas.push({
                    "@context": "https://schema.org",
                    "@type": ["Organization", "LocalBusiness"],
                    "name": "Trai Inc",
                    "url": "https://traiinc.com",
                    "logo": "https://traiinc.com/assets/logos/logo.png",
                    "image": "https://traiinc.com/assets/logos/logo.png",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Tower B2, DLF Mypad, Vibhuti Khand, Gomti Nagar",
                        "addressLocality": "Lucknow",
                        "postalCode": "226010",
                        "addressCountry": "IN"
                    },
                    "founder": {
                        "@type": "Person",
                        "name": "Tushar Rai"
                    },
                    "sameAs": [
                        "https://www.linkedin.com/company/trai-inc",
                        "https://x.com/trai_inc",
                        "https://www.instagram.com/trai.inc",
                        "https://www.youtube.com/@trai-inc"
                    ]
                });
            } else if ([
                'ai-automation.html', 'cloud-devops.html', 'content-creation.html', 'custom-software.html',
                'cybersecurity.html', 'data-analytics.html', 'digital-marketing.html',
                'enterprise-platforms.html', 'lead-gen-scraping.html', 'mobile-apps.html',
                'motion-video.html', 'ui-ux-design.html', 'web-development.html',
                'solutions.html', 'custom-crm-development.html', 'ecommerce-development.html',
                'wordpress-cms-development.html'
            ].includes(file)) {
                const serviceNameMap = {
                    'ai-automation': 'AI & Automation',
                    'cloud-devops': 'Cloud & DevOps',
                    'content-creation': 'AI Content Creation',
                    'custom-software': 'Custom Software Development',
                    'cybersecurity': 'Cybersecurity Solutions',
                    'data-analytics': 'Data & Analytics',
                    'digital-marketing': 'Digital Marketing',
                    'enterprise-platforms': 'Enterprise Platforms',
                    'lead-gen-scraping': 'Lead Gen & Scraping',
                    'mobile-apps': 'Application Development',
                    'motion-video': 'Motion & Video',
                    'ui-ux-design': 'UI/UX Design',
                    'web-development': 'Web Development',
                    'solutions': 'Solutions',
                    'custom-crm-development': 'Custom CRM Development',
                    'ecommerce-development': 'E-Commerce Development',
                    'wordpress-cms-development': 'WordPress & CMS Development',
                    'workflow-automation': 'Workflow Automation'
                };
                const fileSlug = file.replace('.html', '');
                let serviceName = serviceNameMap[fileSlug] || fileSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                schemaJson = {
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": serviceName,
                    "provider": {
                        "@type": "Organization",
                        "name": "Trai Inc"
                    },
                    "areaServed": "IN"
                };
            } else if (file === 'choosing-a-development-partner.html') {
                schemaJson = {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": "What to check before choosing a development partner",
                    "publisher": {
                        "@type": "Organization",
                        "name": "Trai Inc",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://traiinc.com/assets/logos/logo.png"
                        }
                    }
                };
            } else if (file.startsWith('blog-') && file !== 'blog.html') {
                schemaJson = {
                    "@context": "https://schema.org",
                    "@type": "BlogPosting",
                    "headline": dom.window.document.title.split('|')[0].trim(),
                    "publisher": {
                        "@type": "Organization",
                        "name": "Trai Inc",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://traiinc.com/assets/logos/logo.png"
                        }
                    }
                };
            }
            
            if (schemaJson) schemas.push(schemaJson);

            schemas.forEach(schema => {
                const schemaScript = dom.window.document.createElement('script');
                schemaScript.type = 'application/ld+json';
                schemaScript.textContent = JSON.stringify(schema);
                head.appendChild(schemaScript);
            });
            if (breadcrumbSchema) {
                const breadcrumbScript = dom.window.document.createElement('script');
                breadcrumbScript.type = 'application/ld+json';
                breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema);
                head.appendChild(breadcrumbScript);
            }
            
            // Person Schema for about.html
            if (file === 'about.html') {
                try {
                    let aboutPath = path.join(rootDir, 'data', 'about.json');
                    if (fs.existsSync(aboutPath)) {
                        let aboutData = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
                        if (aboutData.team && aboutData.team.members) {
                            aboutData.team.members.forEach(member => {
                                let personSchema = {
                                    "@context": "https://schema.org",
                                    "@type": "Person",
                                    "name": member.name,
                                    "jobTitle": member.role,
                                    "worksFor": {
                                        "@type": "Organization",
                                        "name": "Trai Inc"
                                    }
                                };
                                if (member.linkedin && member.linkedin !== "#") {
                                    personSchema.sameAs = [member.linkedin];
                                }
                                if (member.image) {
                                    personSchema.image = member.image.startsWith('http') ? member.image : `https://traiinc.com/${member.image}`;
                                }
                                const personScript = dom.window.document.createElement('script');
                                personScript.type = 'application/ld+json';
                                personScript.textContent = JSON.stringify(personSchema);
                                head.appendChild(personScript);
                            });
                        }
                    }
                } catch(e) {}
            }
            
            // FAQPage Schema Injection
            try {
                const faqDataFile = file === 'index.html' ? 'home.json' : file.replace('.html', '.json');
                let dataPath = path.join(rootDir, 'data', faqDataFile);
                if (fs.existsSync(dataPath)) {
                    let pageData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
                    if (pageData.faq && pageData.faq.items && pageData.faq.items.length > 0) {
                        let faqSchema = {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": pageData.faq.items.map(item => ({
                                "@type": "Question",
                                "name": item.q,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": item.a
                                }
                            }))
                        };
                        const faqScript = dom.window.document.createElement('script');
                        faqScript.type = 'application/ld+json';
                        faqScript.textContent = JSON.stringify(faqSchema);
                        head.appendChild(faqScript);
                    }
                    if (file === 'app-store.html' && pageData.apps) {
                        pageData.apps.forEach(app => {
                            let offers = app.tiers.map(t => ({
                                "@type": "Offer",
                                "name": t.name,
                                "price": t.price === "Quote-based" ? "0" : t.price.replace(/[^0-9]/g, ''),
                                "priceCurrency": "INR"
                            }));
                            let productSchema = {
                                "@context": "https://schema.org",
                                "@type": "Product",
                                "name": app.name,
                                "description": app.description,
                                "offers": {
                                    "@type": "AggregateOffer",
                                    "offers": offers,
                                    "priceCurrency": "INR",
                                    "lowPrice": Math.min(...offers.map(o => parseInt(o.price) || 0).filter(p => p > 0)) || 0,
                                    "highPrice": Math.max(...offers.map(o => parseInt(o.price) || 0)) || 0
                                }
                            };
                            const prodScript = dom.window.document.createElement('script');
                            prodScript.type = 'application/ld+json';
                            prodScript.textContent = JSON.stringify(productSchema);
                            head.appendChild(prodScript);
                        });
                    }
                }
            } catch(e) {}
            
            // Collect sitemap URLs
            const loc = file === 'index.html' ? 'https://traiinc.com/' : `https://traiinc.com/${file.replace('.html', '')}`;
            const priority = file === 'index.html' ? '1.0' : '0.8';
            const lastmod = new Date().toISOString().split('T')[0];
            sitemapUrls.push(`  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`);

            
            let html = dom.serialize();
            html = html.replace(/http:\/\/localhost:9999\//g, '');
            // Restore Google Maps script
            html = html.replace(/<script data-mocked-src="https:\/\/maps\.googleapis\.com/g, '<script src="https://maps.googleapis.com');
            // Restore Google Maps iframe
            html = html.replace(/<iframe data-mock-src="https:\/\/www\.google\.com/g, '<iframe src="https://www.google.com');
            html = html.replace(/<iframe\s+data-mock-src="https:\/\/www\.google\.com/g, '<iframe src="https://www.google.com');
            fs.writeFileSync(path.join(distDir, file), html);
            console.log(`Successfully built ${file}`);
            dom.window.close();
        } catch (err) {
            console.error(`Error building ${file}:`, err);
        }
    }
    
    // Write dynamic sitemap.xml
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.join('\n')}
</urlset>`;
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapContent);
    console.log("Successfully built sitemap.xml");

    console.log("Build complete! All files ready in ./dist/");
    server.close();
    process.exit(0);
});
