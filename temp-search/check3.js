const fs = require('fs');
let html = fs.readFileSync('clients.html', 'utf8');
console.log(html.includes('"Design N Decor":'));
