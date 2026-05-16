const fs = require('fs');

const mappings = [
    { name: "Yug India", url: "https://www.yugindia.in/images/yug-india-logo.jpeg" },
    { name: "SHREE RAJ INFRA HOUSING", url: "https://www.shreerajinfra.com/wp-content/uploads/2022/01/shreeraj-logo.png" },
    { name: "Anant Krishna Infra Housing", url: "https://www.anantkrishnainfra.com/images/logo.png" }
];

// Clean up JSON to ensure these exact names exist instead of their old typos
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

if (realCat) {
    // Replace typos if they exist
    realCat.clients = realCat.clients.map(c => {
        if (c === 'Anantkrishna Infra Housing') return 'Anant Krishna Infra Housing';
        if (c === 'Raji Infra Housing') return 'SHREE RAJ INFRA HOUSING';
        return c;
    });
    // Ensure they exist
    mappings.forEach(m => {
        if (!realCat.clients.includes(m.name)) {
            realCat.clients.push(m.name);
        }
    });
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('JSON names synced.');
}

// Update cache in HTML
let html = fs.readFileSync('clients.html', 'utf8');

let added = 0;
mappings.forEach(m => {
    // If it exists, replace the URL part. If it doesn't, append it.
    // Need to handle regex special characters safely, though names are alphanumeric here.
    const regex = new RegExp(`("${m.name}"\\s*:\\s*)"([^"]+)"`);
    if (regex.test(html)) {
        html = html.replace(regex, `$1"${m.url}"`);
        added++;
    } else {
        html = html.replace('        };', `            ,"${m.name}": "${m.url}"\n        };`);
        added++;
    }
});

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('Forced mappings in HTML:', added);
