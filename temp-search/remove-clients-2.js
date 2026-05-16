const fs = require('fs');

const toRemove = ['ZIR Real Estate', 'NDL', 'KDL', 'Shri Happy'];

// Clean up JSON
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const cat = clientsData.categories.find(c => c.id === 'real-estate');

if (cat) {
    cat.clients = cat.clients.filter(c => !toRemove.includes(c));
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Removed clients from JSON.');
}

// Update cache in HTML
let html = fs.readFileSync('clients.html', 'utf8');

// Optional: clean up the domainLogos for these specific keys just to keep it tidy
toRemove.forEach(r => {
    const regex = new RegExp(`\\s*"${r}":\\s*"[^"]+",?`, 'g');
    html = html.replace(regex, '');
});

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('Bumped cache in HTML.');
