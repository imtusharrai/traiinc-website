const fs = require('fs');

const toRemove = ['Jadoo The Choice of India', 'Food Hub Group Ltd'];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

let removedCount = 0;
clientsData.categories.forEach(cat => {
    const initialLen = cat.clients.length;
    cat.clients = cat.clients.filter(c => !toRemove.map(x => x.toLowerCase()).includes(c.toLowerCase()));
    removedCount += initialLen - cat.clients.length;
});

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
console.log(`Removed ${removedCount} clients from JSON.`);

let html = fs.readFileSync('clients.html', 'utf8');

toRemove.forEach(r => {
    const regex = new RegExp(`\\s*"${r}":\\s*"[^"]+",?`, 'ig');
    html = html.replace(regex, '');
});

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('HTML updated.');
