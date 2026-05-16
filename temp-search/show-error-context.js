const fs = require('fs');
const js = fs.readFileSync('temp-search/test-clients.js', 'utf8');

const lines = js.split('\n');
const idx = lines.findIndex(l => l.includes('"Awadh Homes"'));
if (idx !== -1) {
    for (let i = Math.max(0, idx - 5); i <= idx + 2; i++) {
        console.log(`${i + 1}: ${lines[i]}`);
    }
}
