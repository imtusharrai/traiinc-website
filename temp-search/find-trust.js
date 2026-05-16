const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const match = script.match(/<section class="trust-banner">[\s\S]*?<\/section>/);
if (match) {
    console.log(match[0]);
} else {
    console.log('Not found in script.js');
}

// Let's also check data/home.json
if (fs.existsSync('data/home.json')) {
    console.log('\n--- data/home.json ---');
    console.log(fs.readFileSync('data/home.json', 'utf8').substring(0, 1000));
}
