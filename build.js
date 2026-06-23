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

['robots.txt', 'sitemap.xml', '_redirects'].forEach(file => {
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
            
            fs.writeFileSync(path.join(distDir, file), dom.serialize());
            console.log(`Successfully built ${file}`);
            dom.window.close();
        } catch (err) {
            console.error(`Error building ${file}:`, err);
        }
    }
    console.log("Build complete! All files ready in ./dist/");
    server.close();
    process.exit(0);
});
