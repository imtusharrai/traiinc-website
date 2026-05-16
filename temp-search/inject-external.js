const fs = require('fs');

const externalRaw = fs.readFileSync('./temp-search/externalLogos.json', 'utf8');
const externalLogos = JSON.parse(externalRaw);

const html = fs.readFileSync('./clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;

const existingString = html.substring(startIdx, endIdx);
const existingObjStr = existingString.replace('const domainLogos = ', '');

const existingKeys = [];
existingObjStr.split('\n').forEach(line => {
    if (line.includes(':')) {
        const key = line.split(':')[0].trim().replace(/"/g, '');
        existingKeys.push(key);
    }
});

let newObjStr = 'const domainLogos = {\n';

const existingLines = existingString.split('\n').slice(1, -1);
for(let i=0; i<existingLines.length; i++){
    let line = existingLines[i].trim();
    if(line.endsWith(',')) line = line.slice(0, -1);
    newObjStr += '            ' + line + ',\n';
}

for (const [client, logoUrl] of Object.entries(externalLogos)) {
    if (!existingKeys.includes(client)) {
        // Sanitize string quotes
        const safeUrl = logoUrl.replace(/"/g, '\\"');
        newObjStr += '            "' + client + '": "' + safeUrl + '",\n';
    }
}

newObjStr = newObjStr.slice(0, -2) + '\n        };';

const newHtml = html.substring(0, startIdx) + newObjStr + html.substring(endIdx);
fs.writeFileSync('./clients.html', newHtml);
console.log('Successfully injected raw image URLs.');
