const fs = require('fs');

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const foodCat = clientsData.categories.find(c => c.id === 'food-beverage');

if (foodCat) {
    const badClients = foodCat.clients.filter(c => c.includes('lh.googleusercontent.com') || c.includes('=w480') || c.includes('=w832'));
    console.log('Bad clients found in JSON:', badClients.length);
    
    // Remove them
    foodCat.clients = foodCat.clients.filter(c => !badClients.includes(c));
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
}

let html = fs.readFileSync('clients.html', 'utf8');
const lines = html.split('\n');
const badLines = lines.filter(l => l.includes('"lh.googleusercontent.com') || l.includes('=w480') || l.includes('=w832'));
console.log('Bad lines found in HTML:', badLines.length);

const goodLines = lines.filter(l => !badLines.includes(l));

// Clean up trailing commas before the closing brace of domainLogos if needed
let newHtml = goodLines.join('\n');
// Fix possible trailing comma before };
newHtml = newHtml.replace(/,\s*};\s*function makeCard/g, '\n        };\n\n        function makeCard');

fs.writeFileSync('clients.html', newHtml);
console.log('Cleaned up clients.json and clients.html');
