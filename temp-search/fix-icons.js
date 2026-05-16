const fs = require('fs');
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

clientsData.categories.forEach(cat => {
    if (cat.id === 'automotive-logistics') cat.icon = '??';
    if (cat.id === 'finance') cat.icon = '??';
});

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Fixed icons for Automotive & Finance.');
