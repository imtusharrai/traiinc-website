const fs = require('fs');

const oldName = "The IGEA Digital Doctor";
const newName = "The Igea Digital Doctor";
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

const regex = new RegExp(`("${oldName}"\\s*:\\s*)"([^"]+)"`, 'i');
if (regex.test(html)) {
    html = html.replace(regex, `"${newName}": "${url}"`);
    console.log('Renamed in HTML.');
} else {
    html = html.replace('        };', `            ,"${newName}": "${url}"\n        };`);
    console.log('Added to HTML mapping.');
}

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
