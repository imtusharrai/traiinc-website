const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const idx = script.indexOf('function renderContact');
if (idx !== -1) {
    console.log(script.substring(idx, idx + 500));
} else {
    console.log("renderContact not found in script.js");
}
