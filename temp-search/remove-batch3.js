const fs = require('fs');

const toRemove = [
    'UNIMAXX City Bahraich',
    'Zavian Builders',
    'Vedanshi Group',
    'Vanshika Ontario',
    'Paitrik Superstructure'
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

if (realCat) {
    const initialLen = realCat.clients.length;
    realCat.clients = realCat.clients.filter(c => !toRemove.map(x => x.toLowerCase()).includes(c.toLowerCase()));
    console.log(`Removed ${initialLen - realCat.clients.length} clients from JSON.`);
    console.log(`Remaining Real Estate clients: ${realCat.clients.length}`);
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
}

let html = fs.readFileSync('clients.html', 'utf8');

toRemove.forEach(r => {
    const regex = new RegExp(`\\s*"${r}":\\s*"[^"]+",?`, 'ig');
    html = html.replace(regex, '');
});

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('HTML updated.');
