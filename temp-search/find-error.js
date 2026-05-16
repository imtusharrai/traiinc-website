const fs = require('fs');
const html = fs.readFileSync('clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;
const objStr = html.substring(startIdx, endIdx);

// Find lines with issues - look for double commas, trailing commas before }
const lines = objStr.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === ',' || line === ',,') {
        console.log(`Line ${i}: STRAY COMMA -> "${lines[i]}"`);
    }
    if (line.match(/,\s*,/)) {
        console.log(`Line ${i}: DOUBLE COMMA -> "${lines[i]}"`);
    }
}

// Check last few lines before closing brace
for (let i = lines.length - 5; i < lines.length; i++) {
    console.log(`Line ${i}: "${lines[i]}"`);
}
