const fs = require('fs');

const oldName = "Home Stories Interior Design";
const newName = "Home Stories";

// Update JSON
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
let foundInJson = false;

clientsData.categories.forEach(cat => {
    const idx = cat.clients.indexOf(oldName);
    if (idx !== -1) {
        cat.clients[idx] = newName;
        foundInJson = true;
    }
});

if (foundInJson) {
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Renamed in JSON.');
}

// Update HTML
let html = fs.readFileSync('clients.html', 'utf8');
if (html.includes(`"${oldName}":`)) {
    html = html.replace(`"${oldName}":`, `"${newName}":`);
    console.log('Renamed in HTML mapping.');
}

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('Cache bumped.');
