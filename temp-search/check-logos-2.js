const fs = require('fs');

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

let html = fs.readFileSync('clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;
const existingString = html.substring(startIdx, endIdx);

let withLogo = [];
let withoutLogo = [];

realCat.clients.forEach(name => {
    // Check if in domainLogos
    const inDomainLogos = existingString.includes(`"${name}":`);
    
    // Check local file
    const localFileName = `assets/logos/${name.replace(/\s+/g, '-').toLowerCase()}.png`;
    const inLocal = fs.existsSync(localFileName);
    
    if (inDomainLogos || inLocal) {
        withLogo.push({name, inDomainLogos, inLocal});
    } else {
        withoutLogo.push(name);
    }
});

console.log(withLogo.slice(0, 5));
console.log(withoutLogo.length);

