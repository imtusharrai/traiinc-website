const fs = require('fs');
let html = fs.readFileSync('clients.html', 'utf8');

// The bad lines start with "lh.googleusercontent.com/
const lines = html.split('\n');
const newLines = lines.filter(line => !line.includes('"lh.googleusercontent.com/'));

html = newLines.join('\n');
fs.writeFileSync('clients.html', html);
console.log('Cleaned up bad lines');
