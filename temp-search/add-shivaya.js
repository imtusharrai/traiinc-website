const fs = require('fs');

const name = "Shivaya Industries";
const url = "https://shivayaindustries.com/wp-content/uploads/2024/05/Untitled_design__31_-removebg-preview.png";

// Add to JSON - enterprise category
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const entCat = clientsData.categories.find(c => c.id === 'enterprise');
if (entCat && !entCat.clients.includes(name)) {
    entCat.clients.push(name);
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Added to Enterprise in JSON.');
}

// Add to HTML
let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace('        };', `            ,"${name}": "${url}"\n        };`);
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
