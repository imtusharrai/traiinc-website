const fs = require('fs');

const toRemove = ['TV20 Network', 'Jawed Habib Hair & Beauty', 'Trioz Unisex Salon', 'Sapphire', 'Excella'];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
let removed = 0;
clientsData.categories.forEach(cat => {
    const initialLen = cat.clients.length;
    cat.clients = cat.clients.filter(c => !toRemove.map(x => x.toLowerCase()).includes(c.toLowerCase()));
    removed += initialLen - cat.clients.length;
});
fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
console.log(`Removed ${removed} clients from JSON.`);

let html = fs.readFileSync('clients.html', 'utf8');
toRemove.forEach(r => {
    const regex = new RegExp(`\\s*"${r}":\\s*"[^"]+",?`, 'ig');
    html = html.replace(regex, '');
});
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
