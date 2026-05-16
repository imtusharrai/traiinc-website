const fs = require('fs');

// 1. Remove RBR Redefining Luxury
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');
if (realCat) {
    realCat.clients = realCat.clients.filter(c => c !== 'RBR Redefining Luxury');
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Removed RBR Redefining Luxury from JSON');
}

// 2. Inject URL mappings
const mappings = [
    { name: "Design N Decor", url: "https://designndecor.co.in/wp-content/uploads/2024/09/LOGO_-DD.png" },
    { name: "Home Stories Interior Design", url: "https://www.homestories.co.in/assets/img/logo/logo.png" },
    { name: "Bhu Master", url: "https://www.bhumaster.com/assets/images/logo.png" },
    { name: "Siddharthas Construction & Colonizer", url: "https://siddharthas.in/portal/assets/img/logo.jpg" },
    { name: "Unishine Group", url: "https://unishinegroup.com/wp-content/uploads/2021/11/unishinelogo.png" },
    { name: "Shriyansh Infracon", url: "https://shriyanshinfracon.in/images/logo-white.png" }
];

let html = fs.readFileSync('clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;

const existingString = html.substring(startIdx, endIdx);
let newObjStr = existingString.slice(0, -2); // Remove };

let added = 0;
mappings.forEach(m => {
    if (!newObjStr.includes(`"${m.name}":`)) {
        newObjStr = newObjStr.trim();
        if (newObjStr.endsWith(',')) {
            newObjStr += `\n            "${m.name}": "${m.url}"`;
        } else {
            newObjStr += `,\n            "${m.name}": "${m.url}"`;
        }
        added++;
    }
});

newObjStr += '\n        };';

let newHtml = html.substring(0, startIdx) + newObjStr + html.substring(endIdx);
// Bump cache
newHtml = newHtml.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', newHtml);
console.log('Injected mappings into HTML:', added);

