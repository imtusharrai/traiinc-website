const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log("Running public build isolation audit...");

if (!fs.existsSync(distDir)) {
    console.error("FAIL: dist/ directory does not exist. Run npm run build first.");
    process.exit(1);
}

// 1. Verify essential public site files are present
const expectedFiles = [
    'index.html',
    'about.html',
    'contact.html',
    'sitemap.xml',
    'robots.txt',
    'css/style.css'
];

for (const rel of expectedFiles) {
    const full = path.join(distDir, rel);
    if (!fs.existsSync(full)) {
        console.error(`FAIL: Expected public website file missing from dist: ${rel}`);
        process.exit(1);
    }
}

// 2. Scan dist/ recursively for forbidden files or directories
const forbiddenNames = new Set([
    'src', 'migrations', 'cms', 'admin', 'scripts',
    'wrangler.toml', 'wrangler.worker.jsonc', 'wrangler.admin.jsonc',
    'ACCESS-CONFIG.md', 'CLAUDE.md'
]);

const forbiddenExtensions = new Set(['.sql', '.jsonc', '.toml', '.sh']);

function auditDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const relPath = path.relative(distDir, fullPath);

        if (forbiddenNames.has(entry.name)) {
            console.error(`SECURITY VIOLATION: Forbidden entry found in dist/: ${relPath}`);
            process.exit(1);
        }

        const ext = path.extname(entry.name).toLowerCase();
        if (forbiddenExtensions.has(ext)) {
            console.error(`SECURITY VIOLATION: Forbidden file extension (${ext}) found in dist/: ${relPath}`);
            process.exit(1);
        }

        if (entry.isDirectory()) {
            auditDir(fullPath);
        }
    }
}

auditDir(distDir);
console.log("PASS: Build isolation audit succeeded. Zero CMS backend or internal source files found in dist/.");
process.exit(0);
