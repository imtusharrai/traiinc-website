const fs = require('fs');

const oldName = "Vasudha Homes and Resorts";
const newName = "Vasudha Hospitality";
const newUrl = "https://vasudhahospitality.com/wp-content/uploads/2025/03/Vasudha-Hospitality-01-1024x683.jpg";

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

if (realCat) {
    realCat.clients = realCat.clients.map(c => c === oldName ? newName : c);
    if (!realCat.clients.includes(newName)) {
        realCat.clients.push(newName);
    }
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('JSON renamed.');
}

let html = fs.readFileSync('clients.html', 'utf8');

// Remove old mapping
const regex = new RegExp(`\\s*"${oldName}":\\s*"[^"]+",?`, 'g');
html = html.replace(regex, '');

// Add new mapping
const newRegex = new RegExp(`("${newName}"\\s*:\\s*)"([^"]+)"`, 'i');
if (newRegex.test(html)) {
    html = html.replace(newRegex, `"${newName}": "${newUrl}"`);
} else {
    html = html.replace('        };', `            ,"${newName}": "${newUrl}"\n        };`);
}

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('HTML updated.');
