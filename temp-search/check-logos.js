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
        withLogo.push(name);
    } else {
        withoutLogo.push(name);
    }
});

console.log(`Total Real Estate Clients: ${realCat.clients.length}`);
console.log(`With Logo: ${withLogo.length}`);
console.log(`Without Logo: ${withoutLogo.length}`);
console.log('\n--- Clients WITH Logos ---');
console.log(withLogo.join('\n'));
console.log('\n--- Clients WITHOUT Logos ---');
console.log(withoutLogo.join('\n'));

