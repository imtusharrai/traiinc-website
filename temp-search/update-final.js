const fs = require('fs');

const nameOM = "Om Group - Mahindra";
const urlOM = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTpYOSus8B9yg2AOGcKrPwGxzwLTk3ylxciw&s";

const namePB = "PB Wheels";
const urlPB = "https://static.pbcdn.in/pbwheels.com/pbwheels-cdn/PbWheelsWebsite/pb-wheels.png";

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

clientsData.categories.forEach(cat => {
    // Fix emojis safely using JS escape sequences
    if (cat.id === 'automotive-logistics') cat.icon = '\uD83D\uDE97'; // 🚗
    if (cat.id === 'finance') cat.icon = '\uD83C\uDFE6'; // 🏦

    // Rename Mahindra Automobiles to Om Group - Mahindra
    const idx = cat.clients.findIndex(c => c.toLowerCase() === 'mahindra automobiles');
    if (idx !== -1) {
        cat.clients[idx] = nameOM;
    }
});

// Ensure PB Wheels is there
const autoCat = clientsData.categories.find(c => c.id === 'automotive-logistics');
if (autoCat && !autoCat.clients.includes(namePB)) {
    autoCat.clients.push(namePB);
}

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

let html = fs.readFileSync('clients.html', 'utf8');

// Update mappings
const mappings = [
    { name: nameOM, url: urlOM },
    { name: namePB, url: urlPB }
];

mappings.forEach(m => {
    const regex = new RegExp(`("${m.name}"\\s*:\\s*)"([^"]+)"`, 'i');
    if (regex.test(html)) {
        html = html.replace(regex, `"${m.name}": "${m.url}"`);
    } else {
        html = html.replace('        };', `            ,"${m.name}": "${m.url}"\n        };`);
    }
});

// Remove old mahindra mapping
html = html.replace(/\s*"Mahindra Automobiles":\s*"[^"]+",?/g, '');

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done mapping OM and PB, and fixing emojis.');

