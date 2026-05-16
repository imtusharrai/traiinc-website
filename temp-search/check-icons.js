const fs = require('fs');
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
clientsData.categories.forEach(cat => {
    console.log(`${cat.id}: icon="${cat.icon}" label="${cat.label}"`);
});
