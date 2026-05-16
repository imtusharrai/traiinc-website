const fs = require('fs');

const clearbitRaw = fs.readFileSync('./temp-search/clearbitLogos.json', 'utf8');
const clearbitLogos = JSON.parse(clearbitRaw);

const html = fs.readFileSync('./clients.html', 'utf8');
// Find the domainLogos object in clients.html
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;

const existingString = html.substring(startIdx, endIdx);
// Extract the object safely
const existingObjStr = existingString.replace('const domainLogos = ', '');

// simple regex parsing for current keys to avoid eval
const existingKeys = [];
existingObjStr.split('\n').forEach(line => {
    if (line.includes(':')) {
        const key = line.split(':')[0].trim().replace(/"/g, '');
        existingKeys.push(key);
    }
});

// Build the new object string
let newObjStr = 'const domainLogos = {\n';

// 1. Add all existing manually curated
const existingLines = existingString.split('\n').slice(1, -1);
for(let i=0; i<existingLines.length; i++){
    let line = existingLines[i].trim();
    if(line.endsWith(',')) line = line.slice(0, -1);
    newObjStr += '            ' + line + ',\n';
}

// 2. Add new clearbit ones
for (const [client, logo] of Object.entries(clearbitLogos)) {
    if (!existingKeys.includes(client)) {
        // filter out blatant bad ones
        if (client === 'Park City' || client === 'Car Heaven' || client === 'Audi') continue;
        newObjStr += '            "' + client + '": "' + logo + '",\n';
    }
}

// remove last comma
newObjStr = newObjStr.slice(0, -2) + '\n        };';

// Update HTML
const newHtml = html.substring(0, startIdx) + newObjStr + html.substring(endIdx);
fs.writeFileSync('./clients.html', newHtml);

console.log('Successfully updated clients.html with merged logos.');
