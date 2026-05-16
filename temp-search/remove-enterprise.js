const fs = require('fs');

const toRemove = ['Railtel', 'Lucknow Metro', 'Ministry of Railways', 'RDS Railways'];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

// Remove specific clients from all categories
clientsData.categories.forEach(cat => {
    cat.clients = cat.clients.filter(c => !toRemove.map(x => x.toLowerCase()).includes(c.toLowerCase()));
});

// Remove Large Enterprises category entirely
const entIdx = clientsData.categories.findIndex(c => c.id === 'enterprise');
if (entIdx !== -1) {
    console.log('Removing Large Enterprises with clients:', clientsData.categories[entIdx].clients);
    clientsData.categories.splice(entIdx, 1);
    console.log('Large Enterprises removed.');
}

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

let html = fs.readFileSync('clients.html', 'utf8');
toRemove.forEach(r => {
    const regex = new RegExp(`\\s*"${r}":\\s*"[^"]+",?`, 'ig');
    html = html.replace(regex, '');
});
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
