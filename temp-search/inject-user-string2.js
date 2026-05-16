const fs = require('fs');
const rawInput = fs.readFileSync('temp-search/input.txt', 'utf8');

const chunks = rawInput.split('https://');
const apps = [];

chunks.forEach(chunk => {
    if(chunk.trim() === '') return;
    const fullChunk = 'https://' + chunk;
    
    // The URL stops at the first space or comma
    const urlMatches = fullChunk.match(/(https:\/\/[^\s,]+)/);
    if (!urlMatches) return;
    
    let url = urlMatches[1];
    let nameStr = fullChunk.replace(url, '');
    
    // clean up name - remove leading/trailing commas, hyphens, and spaces
    nameStr = nameStr.replace(/^[\s,\-]+/, '').replace(/[\s,\-]+$/, '').trim();
    
    // Replace the URL with a 256x256 square format
    if (nameStr && url) {
        url = url.split('=')[0] + '=s256-rw';
        apps.push({ name: nameStr, logo: url });
    }
});

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const foodCat = clientsData.categories.find(c => c.id === 'food-beverage');

let addedNames = 0;
if (foodCat) {
    apps.forEach(app => {
        if (!foodCat.clients.includes(app.name)) {
            foodCat.clients.push(app.name);
            addedNames++;
        }
    });
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
}

let html = fs.readFileSync('clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;

const existingString = html.substring(startIdx, endIdx);
let newObjStr = existingString.slice(0, -2); // Remove };

let addedUrls = 0;
apps.forEach(app => {
    if (!newObjStr.includes('"' + app.name + '":')) {
        // add comma to previous if needed. Actually just always prepend comma
        newObjStr = newObjStr.trim();
        if (newObjStr.endsWith(',')) {
            newObjStr += '\n            "' + app.name + '": "' + app.logo + '"';
        } else {
            newObjStr += ',\n            "' + app.name + '": "' + app.logo + '"';
        }
        addedUrls++;
    }
});

newObjStr += '\n        };';

let newHtml = html.substring(0, startIdx) + newObjStr + html.substring(endIdx);
newHtml = newHtml.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', newHtml);
console.log('Successfully injected ' + apps.length + ' apps.');
console.log('Added names to JSON:', addedNames);
console.log('Added URLs to HTML:', addedUrls);
console.log('Sample:', apps[0], apps[1]);
