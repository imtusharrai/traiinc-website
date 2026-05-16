const fs = require('fs');

const oldName = "MALife";
const newName = "Cure Wantri";
const newUrl = "https://scontent.flko11-1.fna.fbcdn.net/v/t39.30808-6/346072662_563329992550094_1660216429168313790_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=nsYQOSd7zgYQ7kNvwHTc0At&_nc_oc=AdrznvcllR93uUzL2FWg0heBM-09aYt7Rjmnrc9gjdjnd-27N45DHIPXXHGgKW06Jfo&_nc_zt=23&_nc_ht=scontent.flko11-1.fna&_nc_gid=Lr6IE1ZZrGt-CfnVAV47Lw&_nc_ss=7b2a8&oh=00_Af7o5nbE9blxDahC2yTWHKqmnwX31yWNSrB6T3YPpSDv-A&oe=6A0E1B49";

// Update JSON
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
clientsData.categories.forEach(cat => {
    const idx = cat.clients.indexOf(oldName);
    if (idx !== -1) {
        cat.clients[idx] = newName;
        console.log(`Renamed in JSON (${cat.id}).`);
    }
});
fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

// Update HTML
let html = fs.readFileSync('clients.html', 'utf8');

// Remove old mapping
const regex = new RegExp(`\\s*"${oldName}":\\s*"[^"]+",?`, 'g');
html = html.replace(regex, '');

// Add new mapping
html = html.replace('        };', `            ,"${newName}": "${newUrl}"\n        };`);

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
