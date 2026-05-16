const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
data.categories.forEach(c => console.log(c.id, c.label));
