const fs = require('fs');

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const idx = clientsData.categories.findIndex(c => c.id === 'retail');
if (idx !== -1) {
    console.log('Removing Retail & Consumer with clients:', clientsData.categories[idx].clients);
    clientsData.categories.splice(idx, 1);
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Removed.');
}

let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
