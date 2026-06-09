const fs = require('fs');
const path = require('path');

console.log("Starting static site generation...");

// Extract renderers from app.js
const appJsPath = path.join(__dirname, 'js', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');
const renderersContent = appJsContent.split('/* ===== PAGE RENDERERS ===== */')[1].split('/* ===== SCROLL ANIMATIONS ===== */')[0];

// Evaluate the renderers in this scope
eval(renderersContent);

const pages = [
    { id: 'home', file: 'index.html', renderer: renderHome },
    { id: 'about', file: 'about.html', renderer: renderAbout },
    { id: 'solutions', file: 'solutions.html', renderer: renderSolutions },
    { id: 'industries', file: 'industries.html', renderer: renderIndustries },
    { id: 'incubation', file: 'incubation.html', renderer: renderIncubation },
    { id: 'careers', file: 'careers.html', renderer: renderCareers },
    { id: 'partner', file: 'partner.html', renderer: renderPartner },
    { id: 'contact', file: 'contact.html', renderer: renderContact }
];

const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Copy everything to dist first
function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
        if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name === 'build.js') continue;
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log("Copying files to ./dist...");
copyDirectory(__dirname, distDir);

pages.forEach(page => {
    try {
        const jsonPath = path.join(__dirname, 'data', `${page.id}.json`);
        if (fs.existsSync(jsonPath)) {
            const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            // Build the HTML string using the renderer
            const contentHTML = page.renderer(data);
            
            // Read index.html template from dist
            const templatePath = path.join(distDir, page.file);
            let template = fs.readFileSync(templatePath, 'utf8');
            
            // Replace the loader with the actual content
            let finalHTML = template.replace(
                '<main id="dynamic-content"><div class="loader">Loading...</div></main>',
                `<main id="dynamic-content">\n${contentHTML}\n</main>`
            );
            
            // Inject early bot detection into the <head> to prevent opacity issues in Google Search Console
            const inlineScript = `
    <script>
        if (/bot|googlebot|crawler|spider|robot|crawling|inspectiontool|lighthouse/i.test(navigator.userAgent)) {
            document.documentElement.classList.add('bot-detected');
        }
    </script>`;
            finalHTML = finalHTML.replace('</head>', `${inlineScript}\n</head>`);
            
            // Dynamically update cache buster for CSS and JS
            const newVersion = Date.now();
            finalHTML = finalHTML.replace(/v=\d+/g, `v=${newVersion}`);
            
            // Save the statically generated file
            fs.writeFileSync(templatePath, finalHTML);
            console.log(`Static HTML generated successfully for SEO! (${page.file})`);
        } else {
            console.log(`Skipping ${page.file}: No JSON data found.`);
        }
    } catch (err) {
        console.error(`Failed to build ${page.id}:`, err);
    }
});

console.log("Build complete! All files ready in ./dist/");
