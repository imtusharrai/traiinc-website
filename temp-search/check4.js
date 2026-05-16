const fs = require('fs');
let html = fs.readFileSync('clients.html', 'utf8');
const lines = html.split('\n');
const match = lines.find(l => l.includes('"Radiance City"'));
console.log(match);
