const fs = require('fs');

const oldName = "The IGEA";
const newName = "The IGEA Digital Doctor";
const url = "https://www.theigea.com/webassets/img/logo/logo-white.png";

// Update JSON
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
clientsData.categories.forEach(cat => {
    const idx = cat.clients.indexOf(oldName);
    if (idx !== -1) {
        cat.clients[idx] = newName;
        console.log(`Renamed in JSON (${cat.id}).`);
    }
});
fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

// Update HTML
let html = fs.readFileSync('clients.html', 'utf8');

// remove old mapping
const oldRegex = new RegExp(`\\s*"${oldName}":\\s*"[^"]+",?`, 'ig');
html = html.replace(oldRegex, '');

// remove new mapping if it somehow exists
const newRegex = new RegExp(`\\s*"${newName}":\\s*"[^"]+",?`, 'ig');
html = html.replace(newRegex, '');

// insert new mapping
html = html.replace('        };', `            ,"${newName}": "${url}"\n        };`);

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
