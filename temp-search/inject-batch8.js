const fs = require('fs');

const mappings = [
    { name: "Pintail Park City", url: "https://pintail.co.in/images/logo.jpg" },
    { name: "Growth Affirm India", url: "https://5.imimg.com/data5/SELLER/Logo/2022/6/XL/QT/QV/154048565/capture-90x90.PNG" }
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');
const entCat = clientsData.categories.find(c => c.id === 'enterprise');

if (realCat) {
    // Rename Park City -> Pintail Park City
    realCat.clients = realCat.clients.map(c => c === 'Park City' ? 'Pintail Park City' : c);
    
    if (!realCat.clients.includes('Pintail Park City')) {
        realCat.clients.push('Pintail Park City');
    }
}

if (entCat) {
    if (!entCat.clients.includes('Growth Affirm India')) {
        entCat.clients.push('Growth Affirm India');
    }
}

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

// Update HTML mapping
let html = fs.readFileSync('clients.html', 'utf8');

mappings.forEach(m => {
    const regex = new RegExp(`("${m.name}"\\s*:\\s*)"([^"]+)"`, 'i');
    if (regex.test(html)) {
        html = html.replace(regex, `"${m.name}": "${m.url}"`);
    } else {
        html = html.replace('        };', `            ,"${m.name}": "${m.url}"\n        };`);
    }
});

// Remove old "Park City" from HTML if it exists
const regex = new RegExp(`\\s*"Park City":\\s*"[^"]+",?`, 'ig');
html = html.replace(regex, '');

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('JSON and HTML updated for Pintail and Growth Affirm.');

