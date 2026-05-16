const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const idx = script.indexOf('function renderContact');
if (idx !== -1) {
    console.log(script.substring(idx, idx + 1000));
}
