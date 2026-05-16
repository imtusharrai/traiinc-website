const fs = require('fs');
const html = fs.readFileSync('clients.html', 'utf8');

const jsStart = html.indexOf('const domainLogos = {');
if (jsStart !== -1) {
    const jsEnd = html.indexOf('};', jsStart) + 2;
    console.log(html.substring(jsEnd - 500, jsEnd + 50));
}
