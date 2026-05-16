const fs = require('fs');

const name = "New Fleet Solutions";
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

// Remove from all categories EXCEPT automotive-logistics
clientsData.categories.forEach(cat => {
    if (cat.id !== 'automotive-logistics') {
        cat.clients = cat.clients.filter(c => c !== name);
    }
});

// Make sure it IS in automotive-logistics
const autoCat = clientsData.categories.find(c => c.id === 'automotive-logistics');
if (autoCat && !autoCat.clients.includes(name)) {
    autoCat.clients.push(name);
}

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Fixed New Fleet Solutions location.');

