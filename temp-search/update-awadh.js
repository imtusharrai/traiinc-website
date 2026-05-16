const fs = require('fs');

const mappings = [
    { name: "Awadh Homes", url: "https://awadhhomeservices.in/images/awadh-home-services.png" }
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

let removedCount = 0;
if (realCat) {
    // 1. Remove Radiance city
    const initialLen = realCat.clients.length;
    realCat.clients = realCat.clients.filter(c => c.toLowerCase() !== 'radiance city');
    removedCount = initialLen - realCat.clients.length;

    // 2. Rename Avadh Homes & Development -> Awadh Homes
    realCat.clients = realCat.clients.map(c => {
        if (c.toLowerCase().includes('avadh') || c.toLowerCase().includes('awadh')) {
            return 'Awadh Homes';
        }
        return c;
    });

    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log(`JSON updated. Removed ${removedCount} instances of Radiance City.`);
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

// Remove any mapping for Radiance City
const regex = new RegExp(`\\s*"Radiance [cC]ity":\\s*"[^"]+",?`, 'g');
html = html.replace(regex, '');

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('HTML updated.');

