const fs = require('fs');
const path = require('path');
const http = require('http');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const PORT = 9999;
const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        if (['.git', 'node_modules', 'dist', 'build.js', 'package.json', 'package-lock.json'].includes(entry.name)) continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) copyDirectory(srcPath, destPath);
        else if (!entry.name.endsWith('.html') || entry.name === '404.html') {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log("Copying static assets to dist...");
copyDirectory(rootDir, distDir);

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
        else res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
});

server.listen(PORT, async () => {
    console.log(`Local server started on port ${PORT}`);
    const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html') && f !== '404.html');
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
                }
            });
            
            await new Promise(resolve => {
                let attempts = 0;
                const interval = setInterval(() => {
                    attempts++;
                    const content = dom.window.document.getElementById('content');
                    if ((content && !content.innerHTML.includes('Loading...')) || attempts > 50 || !content) {
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

            const newVersion = Date.now();
            dom.window.document.querySelectorAll('script[src]').forEach(s => {
                if (s.src && s.src.includes('?v=')) s.src = s.src.replace(/v=\d+/, `v=${newVersion}`);
            });
            dom.window.document.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
                if (l.href && l.href.includes('?v=')) l.href = l.href.replace(/v=\d+/, `v=${newVersion}`);
            });
            
            // Schema Injection
            let schemaJson = null;
            if (file === 'index.html' || file === 'contact.html') {
                schemaJson = {
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
                    "sameAs": [
                        "https://www.linkedin.com/company/trai-inc",
                        "https://x.com/trai_inc",
                        "https://www.instagram.com/trai.inc",
                        "https://www.youtube.com/@trai-inc"
                    ]
                };
            } else if ([
                'ai-agents.html', 'ai-automation.html', 'ai-voice-agents.html', 
                'cloud-devops.html', 'custom-software.html', 'cybersecurity.html', 
                'data-analytics.html', 'digital-marketing.html', 'enterprise-platforms.html', 
                'lead-gen-scraping.html', 'mobile-apps.html', 'motion-video.html', 
                'ui-ux-design.html', 'web-development.html', 'workflow-automation.html'
            ].includes(file)) {
                let serviceName = file.replace('.html', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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
            }
            
            if (schemaJson) {
                const schemaScript = dom.window.document.createElement('script');
                schemaScript.type = 'application/ld+json';
                schemaScript.textContent = JSON.stringify(schemaJson);
                head.appendChild(schemaScript);
            }
            
            // FAQPage Schema Injection
            try {
                let dataPath = path.join(rootDir, 'data', file.replace('.html', '.json'));
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
            const loc = file === 'index.html' ? 'https://traiinc.com/' : `https://traiinc.com/${file}`;
            const priority = file === 'index.html' ? '1.0' : '0.8';
            const lastmod = new Date().toISOString().split('T')[0];
            sitemapUrls.push(`  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`);

            
            let html = dom.serialize();
            html = html.replace(/http:\/\/localhost:9999\//g, '');
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
