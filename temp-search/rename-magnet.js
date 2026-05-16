const fs = require('fs');

const oldName = "MagnetGold";
const newName = "Rodex";
const newUrl = "https://www.rodexgroup.in/image/logo.jpg";

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
const regex = new RegExp(`\\s*"${oldName}":\\s*"[^"]+",?`, 'g');
html = html.replace(regex, '');
html = html.replace('        };', `            ,"${newName}": "${newUrl}"\n        };`);
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
