const fs = require('fs');

const toRemove = ['Audi', 'Kohli Group', 'Ghar Saathi LLP', 'Awadhpuri'];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const entCat = clientsData.categories.find(c => c.id === 'enterprise');

// Remove 4 clients from enterprise
if (entCat) {
    entCat.clients = entCat.clients.filter(c => !toRemove.map(x => x.toLowerCase()).includes(c.toLowerCase()));
    // Also remove PB India Group from enterprise (moving it)
    entCat.clients = entCat.clients.filter(c => c !== 'PB India Group');
}

// Create Finance category with PB India Group
clientsData.categories.push({
    id: 'finance',
    label: 'Finance & Banking',
    icon: '??',
    color: '#f7971e',
    color2: '#ffd200',
    clients: ['PB India Group']
});

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
console.log('JSON updated. PB India Group moved to Finance. 4 clients removed.');

let html = fs.readFileSync('clients.html', 'utf8');
toRemove.forEach(r => {
    const regex = new RegExp(`\\s*"${r}":\\s*"[^"]+",?`, 'ig');
    html = html.replace(regex, '');
});
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
