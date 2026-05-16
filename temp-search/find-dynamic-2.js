const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const regex = /const page = document\.body\.getAttribute\('data-page'\);[\s\S]*?(?=\}\);)/;
const match = script.match(regex);
if (match) {
    console.log(match[0].substring(0, 1000));
} else {
    // maybe just look for dynamic-content
    const lines = script.split('\n');
    lines.forEach((l, i) => {
        if (l.includes('dynamic-content')) {
            console.log(`Line ${i}: ${l}`);
        }
    });
}
