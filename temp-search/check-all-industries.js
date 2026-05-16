const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/industries.json', 'utf8'));

console.log(data.industries.map(i => i.name).join(', '));
