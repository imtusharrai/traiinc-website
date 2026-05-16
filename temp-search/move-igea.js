const fs = require('fs');

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

const eduCat = clientsData.categories.find(c => c.id === 'education');
const healthCat = clientsData.categories.find(c => c.id === 'healthcare');

// 1. Move The IGEA to Healthcare
if (healthCat) {
    if (!healthCat.clients.includes('The IGEA')) {
        healthCat.clients.push('The IGEA');
        console.log('Moved The IGEA to Healthcare.');
    }
}

// 2. Remove Education category entirely
const eduIdx = clientsData.categories.findIndex(c => c.id === 'education');
if (eduIdx !== -1) {
    console.log('Removing Education category with clients:', clientsData.categories[eduIdx].clients);
    clientsData.categories.splice(eduIdx, 1);
    console.log('Education category removed.');
}

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

// Bump cache
let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
