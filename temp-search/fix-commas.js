const fs = require('fs');
let html = fs.readFileSync('clients.html', 'utf8');

// Find stray commas in the domainLogos object.
// A stray comma is a comma followed only by whitespace and another comma.
html = html.replace(/,\s*,/g, ',');

// Also check for a trailing comma before the closing brace
html = html.replace(/,\s*};/, '\n        };');

// Also check for leading comma right after the opening brace
html = html.replace(/{\s*,/, '{');

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Cleaned up stray commas in clients.html');
