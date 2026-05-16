const fs = require('fs');
const html = fs.readFileSync('clients.html', 'utf8');

const jsStart = html.indexOf('function populateMarquee');
if (jsStart !== -1) {
    const jsEnd = html.indexOf('}', jsStart) + 1;
    console.log(html.substring(jsStart, jsEnd + 200));
} else {
    const backupStart = html.indexOf('marquee-inner');
    console.log("Couldn't find populateMarquee. Looking for marquee-inner usage:");
    const scriptStart = html.lastIndexOf('<script', backupStart);
    // Find where the script does it. Let's just find "marquee-inner" in the bottom script.
    const regex = /document\.getElementById\('marquee-inner'\).*?\n(.*\n){1,20}/;
    const match = html.match(regex);
    if(match) console.log(match[0]);
}

