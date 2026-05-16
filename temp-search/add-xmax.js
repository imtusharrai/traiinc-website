const fs = require('fs');

const name = "Xmax Group";
const url = "https://d3jbu7vaxvlagf.cloudfront.net/public/flyer_image/business_logo/14869751772547789.png";

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const mediaCat = clientsData.categories.find(c => c.id === 'media');
if (mediaCat && !mediaCat.clients.includes(name)) {
    mediaCat.clients.push(name);
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Added to Media & Lifestyle in JSON.');
}

let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace('        };', `            ,"${name}": "${url}"\n        };`);
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
