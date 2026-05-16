const fs = require('fs');

const name = "PB Wheels";
const url = "https://static.pbcdn.in/pbwheels.com/pbwheels-cdn/PbWheelsWebsite/pb-wheels.png";

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const autoCat = clientsData.categories.find(c => c.id === 'automotive-logistics');
if (autoCat && !autoCat.clients.includes(name)) {
    autoCat.clients.push(name);
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Added to Automotive & Logistics.');
}

let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace('        };', `            ,"${name}": "${url}"\n        };`);
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
