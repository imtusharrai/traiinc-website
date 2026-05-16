const fs = require('fs');

const raw = fs.readFileSync('fh_apps.json', 'utf8');
const apps = JSON.parse(raw).map(a => {
    return {
        name: a.name.replace('FH Apps Five', '').trim(),
        // Replace the wide banner format with a square icon format
        logo: a.logo.split('=')[0] + '=s256-rw'
    };
});

// Update clients.json
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const foodCat = clientsData.categories.find(c => c.id === 'food-beverage');
if (foodCat) {
    apps.forEach(app => {
        if (!foodCat.clients.includes(app.name)) {
            foodCat.clients.push(app.name);
        }
    });
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
}

// Update clients.html
let html = fs.readFileSync('clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;

const existingString = html.substring(startIdx, endIdx);
let newObjStr = existingString.slice(0, -2); // Remove the }; at the end

apps.forEach(app => {
    if (!newObjStr.includes('"' + app.name + '":')) {
        newObjStr += ',\n            "' + app.name + '": "' + app.logo + '"';
    }
});

newObjStr += '\n        };';

const newHtml = html.substring(0, startIdx) + newObjStr + html.substring(endIdx);
// Bump version
const bumpedHtml = newHtml.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', bumpedHtml);
console.log('Successfully injected ' + apps.length + ' apps from FH Apps Five!');
