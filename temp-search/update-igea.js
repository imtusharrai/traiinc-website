const fs = require('fs');

const name = "The IGEA";
const url = "https://play-lh.googleusercontent.com/z8v9uPj700BXrHHcoWl0uNQzsbgyoX-KeRjBAqW6MQnKUwlwt8P0R9MT2-7uvJdQYjw=w480-h960-rw";

let html = fs.readFileSync('clients.html', 'utf8');

const regex = new RegExp(`("${name}"\\s*:\\s*)"([^"]+)"`, 'i');
if (regex.test(html)) {
    html = html.replace(regex, `"${name}": "${url}"`);
    console.log(`Updated URL for ${name}.`);
} else {
    html = html.replace('        };', `            ,"${name}": "${url}"\n        };`);
    console.log(`Added URL for ${name}.`);
}

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
