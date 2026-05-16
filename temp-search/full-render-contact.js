const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const idx = script.indexOf('function renderContact');
if (idx !== -1) {
    const end = script.indexOf('function ', idx + 20);
    console.log(script.substring(idx, end !== -1 ? end : idx + 2000));
}
