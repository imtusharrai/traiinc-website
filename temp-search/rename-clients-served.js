const fs = require('fs');

let html = fs.readFileSync('clients.html', 'utf8');

if (html.includes('Clients Served')) {
    html = html.replace(/Clients Served/g, 'Showcased Clients');
    console.log('Renamed "Clients Served" to "Showcased Clients".');
}

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
