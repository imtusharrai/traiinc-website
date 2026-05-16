const fs = require('fs');

const name = "The IGEA";
const url = "https://www.theigea.com/webassets/img/logo/logo-white.png";

let html = fs.readFileSync('clients.html', 'utf8');

const regex = new RegExp(`("${name}"\\s*:\\s*)"([^"]+)"`, 'i');
if (regex.test(html)) {
    html = html.replace(regex, `"${name}": "${url}"`);
    console.log(`Updated URL for ${name}.`);
}

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
