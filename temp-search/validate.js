const fs = require('fs');

// Check JSON validity
try {
    const data = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
    console.log('JSON is valid. Categories:', data.categories.length);
} catch(e) {
    console.error('JSON ERROR:', e.message);
}

// Check HTML JS validity
try {
    const html = fs.readFileSync('clients.html', 'utf8');
    const startIdx = html.indexOf('const domainLogos = {');
    const endIdx = html.indexOf('};', startIdx) + 1;
    const objStr = html.substring(startIdx + 'const domainLogos = '.length, endIdx);
    const check = new Function('return ' + objStr);
    check();
    console.log('domainLogos JS is valid.');
} catch(e) {
    console.error('HTML JS ERROR:', e.message);
}
