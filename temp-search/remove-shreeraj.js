const fs = require('fs');

const toRemove = ['SHREE RAJ INFRA HOUSING'];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

if (realCat) {
    realCat.clients = realCat.clients.filter(c => c !== 'SHREE RAJ INFRA HOUSING');
    console.log(`Remaining: ${realCat.clients.length}`);
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
}

let html = fs.readFileSync('clients.html', 'utf8');
const regex = new RegExp(`\\s*"SHREE RAJ INFRA HOUSING":\\s*"[^"]+",?`, 'g');
html = html.replace(regex, '');
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
