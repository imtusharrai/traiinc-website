const fs = require('fs');

const mappings = [
    { name: "Sagun Group of Companies", url: "https://www.sagungroup.in/images/logo.png" }
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

if (realCat) {
    // Rename Sagun Groups -> Sagun Group
    realCat.clients = realCat.clients.map(c => {
        if (c.toLowerCase().includes('sagun group')) {
            return 'Sagun Group of Companies';
        }
        return c;
    });

    if (!realCat.clients.includes('Sagun Group of Companies')) {
        realCat.clients.push('Sagun Group of Companies');
    }

    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log(`JSON updated.`);
}

let html = fs.readFileSync('clients.html', 'utf8');

// Update mappings
mappings.forEach(m => {
    const regex = new RegExp(`("${m.name}"\\s*:\\s*)"([^"]+)"`, 'i');
    if (regex.test(html)) {
        html = html.replace(regex, `"${m.name}": "${m.url}"`);
    } else {
        html = html.replace('        };', `            ,"${m.name}": "${m.url}"\n        };`);
    }
});

// Remove any old mappings for "Sagun Groups of Companies"
const regex = new RegExp(`\\s*"Sagun Groups of Companies":\\s*"[^"]+",?`, 'g');
html = html.replace(regex, '');

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('HTML updated.');

