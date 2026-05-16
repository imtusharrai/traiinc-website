const fs = require('fs');

const toRemove = 'LHD Lucknow House Developers';

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

if (realCat) {
    const initialLen = realCat.clients.length;
    realCat.clients = realCat.clients.filter(c => !c.toLowerCase().includes('lhd lucknow'));
    
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log(`JSON updated. Removed ${initialLen - realCat.clients.length} instance(s).`);
}

let html = fs.readFileSync('clients.html', 'utf8');

// Clean up mapping if it exists
const regex = new RegExp(`\\s*"${toRemove}":\\s*"[^"]+",?`, 'ig');
html = html.replace(regex, '');

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('HTML updated.');

