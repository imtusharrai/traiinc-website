const fs = require('fs');

const mappings = [
    { name: "Rishita Developers", url: "https://www.rishitasmulberryheights.com/assets/img/logo.svg" }
];

let html = fs.readFileSync('clients.html', 'utf8');

// 1. Map Rishita Developers in HTML
mappings.forEach(m => {
    const regex = new RegExp(`("${m.name}"\\s*:\\s*)"([^"]+)"`, 'i');
    if (regex.test(html)) {
        html = html.replace(regex, `"${m.name}": "${m.url}"`);
    } else {
        html = html.replace('        };', `            ,"${m.name}": "${m.url}"\n        };`);
    }
});

// 2. Identify all clients without real logos
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;
const existingString = html.substring(startIdx, endIdx);

const domainLogosStr = existingString.replace('const domainLogos = ', '').replace('};', '}').trim();
let domainLogos = {};
try {
    domainLogos = new Function('return ' + domainLogosStr)();
} catch (e) {
    console.error("Error parsing domainLogos", e);
}

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

let withoutLogo = [];

realCat.clients.forEach(name => {
    let logoUrl = domainLogos[name];
    if (!logoUrl || logoUrl.includes('logo.clearbit.com')) {
        const localFileName = `assets/logos/${name.replace(/\s+/g, '-').toLowerCase()}.png`;
        if (!fs.existsSync(localFileName)) {
            withoutLogo.push(name);
        }
    }
});

console.log(`Found ${withoutLogo.length} clients without real logos. Removing them...`);
console.log(withoutLogo);

// 3. Remove them from JSON
realCat.clients = realCat.clients.filter(name => !withoutLogo.includes(name));
fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

// Optional: clean them from HTML mapping if they have clearbit logos
withoutLogo.forEach(r => {
    const regex = new RegExp(`\\s*"${r}":\\s*"[^"]+",?`, 'ig');
    html = html.replace(regex, '');
});

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);

console.log('Update complete.');
