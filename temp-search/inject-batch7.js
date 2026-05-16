const fs = require('fs');

const toRemoveRealEstate = ['abhipriyam', 'sc group'];

const mappings = [
    { name: "SS Ram Projects", url: "https://www.ssram.in/assets/images/logo.png" },
    { name: "Gayatri Group", url: "https://www.gayatri.co.in/images/logo.gif" },
    { name: "Yuva Infra", url: "https://yuvainfra.com/wp-content/uploads/2022/04/logo-.png" },
    { name: "DNR Group", url: "https://dnrgroup.in/wp-content/uploads/2023/09/DNR-BRAND-ID-LIGHT.svg" },
    { name: "Royal Group", url: "https://royalgroupuae.com/images/royal-group-new.png" },
    { name: "Workezy", url: "https://www.workezy.co.in/assets/img/Logo_dark.png" },
    { name: "Maxcleano", url: "https://maxcleano.in/wp-content/uploads/2021/03/max-cleano-1.png" },
    { name: "Safaiwale", url: "https://safaiwale.in/wp-content/uploads/2021/11/safaiwale-logo.png" }
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');
const homeCat = clientsData.categories.find(c => c.id === 'home-services');

if (realCat) {
    // Remove
    realCat.clients = realCat.clients.filter(c => !toRemoveRealEstate.map(x => x.toLowerCase()).includes(c.toLowerCase()));
    
    // Rename DNR Infra Developers -> DNR Group
    realCat.clients = realCat.clients.map(c => c === 'DNR Infra Developers' ? 'DNR Group' : c);
    
    // Ensure first 5 exist in Real Estate
    const realEstateNames = ["SS Ram Projects", "Gayatri Group", "Yuva Infra", "DNR Group", "Royal Group"];
    realEstateNames.forEach(n => {
        if (!realCat.clients.includes(n)) {
            realCat.clients.push(n);
        }
    });
}

if (homeCat) {
    // Ensure the last 3 exist in Home Services
    const homeNames = ["Workezy", "Maxcleano", "Safaiwale"];
    homeNames.forEach(n => {
        if (!homeCat.clients.includes(n)) {
            homeCat.clients.push(n);
        }
    });
}

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
console.log('JSON updated.');

// Update HTML mapping
let html = fs.readFileSync('clients.html', 'utf8');

let added = 0;
mappings.forEach(m => {
    const regex = new RegExp(`("${m.name}"\\s*:\\s*)"([^"]+)"`);
    if (regex.test(html)) {
        html = html.replace(regex, `$1"${m.url}"`);
        added++;
    } else {
        html = html.replace('        };', `            ,"${m.name}": "${m.url}"\n        };`);
        added++;
    }
});

// Remove abhipriyam, sc group from HTML if they exist
toRemoveRealEstate.forEach(r => {
    // Since we don't know the exact case, let's use a case-insensitive regex for the HTML string too,
    // though the HTML replaces might be slightly riskier. But it's fine.
    const regex = new RegExp(`\\s*"${r}":\\s*"[^"]+",?`, 'ig');
    html = html.replace(regex, '');
});

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('Mappings updated in HTML:', added);

