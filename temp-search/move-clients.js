const fs = require('fs');

const moves = [
    { name: 'Shivaya Industries', to: 'media' },
    { name: 'North Quest Solutions', to: 'finance' },
    { name: 'Growth Affirm India', to: 'healthcare' }
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

moves.forEach(m => {
    // Remove from all categories
    clientsData.categories.forEach(cat => {
        cat.clients = cat.clients.filter(c => c !== m.name);
    });
    // Add to target
    const target = clientsData.categories.find(c => c.id === m.to);
    if (target) {
        target.clients.push(m.name);
        console.log(`Moved "${m.name}" to ${target.label}`);
    }
});

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
