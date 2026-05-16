const fs = require('fs');

const name = 'Car18';
const logo = 'data:image/png;base64,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';

// Update JSON
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const autoCat = clientsData.categories.find(c => c.id === 'automotive');

if (autoCat && !autoCat.clients.includes(name)) {
    autoCat.clients.push(name);
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Added to automotive category');
}

// Update HTML
let html = fs.readFileSync('clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;

const existingString = html.substring(startIdx, endIdx);
let newObjStr = existingString.slice(0, -2); // Remove };

if (!newObjStr.includes(`"${name}":`)) {
    newObjStr = newObjStr.trim();
    if (newObjStr.endsWith(',')) {
        newObjStr += `\n            "${name}": "${logo}"`;
    } else {
        newObjStr += `,\n            "${name}": "${logo}"`;
    }
}

newObjStr += '\n        };';

let newHtml = html.substring(0, startIdx) + newObjStr + html.substring(endIdx);
newHtml = newHtml.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', newHtml);
console.log('Added base64 logo to HTML');
