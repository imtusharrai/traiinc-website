const fs = require('fs');

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

let html = fs.readFileSync('clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;
const existingString = html.substring(startIdx, endIdx);

// Parse the domainLogos into a real JS object
const domainLogosStr = existingString.replace('const domainLogos = ', '').replace('};', '}').trim();
let domainLogos = {};
try {
    domainLogos = new Function('return ' + domainLogosStr)();
} catch (e) {
    console.error("Error parsing domainLogos", e);
}

let withRealLogo = [];
let withoutLogo = [];

realCat.clients.forEach(name => {
    let logoUrl = domainLogos[name];
    
    // Determine if it has a real logo
    if (logoUrl) {
        if (logoUrl.includes('logo.clearbit.com')) {
            withoutLogo.push(name);
        } else {
            withRealLogo.push(name);
        }
    } else {
        // Fallback checks
        const localFileName = `assets/logos/${name.replace(/\s+/g, '-').toLowerCase()}.png`;
        if (fs.existsSync(localFileName)) {
            withRealLogo.push(name);
        } else {
            withoutLogo.push(name);
        }
    }
});

console.log(`Total Real Estate Clients: ${realCat.clients.length}`);
console.log(`With Real Logo: ${withRealLogo.length}`);
console.log(`Without Real Logo (Clearbit or empty): ${withoutLogo.length}`);
console.log('\n--- Clients WITH Real Logos ---');
console.log(withRealLogo.join('\n'));

