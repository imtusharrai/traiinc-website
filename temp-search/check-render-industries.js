const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const idx = script.indexOf('function renderIndustries');
const endIdx = script.indexOf('function ', idx + 20);

if (idx !== -1) {
    console.log(script.substring(idx, endIdx !== -1 ? endIdx : script.length));
} else {
    console.log('renderIndustries not found');
}
