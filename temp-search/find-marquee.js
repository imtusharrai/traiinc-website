const fs = require('fs');
const html = fs.readFileSync('clients.html', 'utf8');

// Find the marquee render logic or HTML
const start = html.indexOf('<div class="marquee-section">');
const end = html.indexOf('</div>', start) + 6;

if (start !== -1) {
    console.log(html.substring(start, start + 300));
}

// Or is it dynamically generated?
const jsStart = html.indexOf('function generateMarquee');
if (jsStart !== -1) {
    const jsEnd = html.indexOf('}', jsStart) + 1;
    console.log('\n\n' + html.substring(jsStart, jsEnd));
}

// If no function, look for how marquee-inner is populated
const innerStart = html.indexOf('class="marquee-inner"');
if (innerStart !== -1) {
    console.log('\n\nMarquee inner logic:');
    console.log(html.substring(innerStart, innerStart + 300));
}

