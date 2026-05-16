const fs = require('fs');

let html = fs.readFileSync('clients.html', 'utf8');

const oldRegex = /("Dashak Pharma"\s*:\s*)"([^"]+)"/;
if (oldRegex.test(html)) {
    html = html.replace(oldRegex, '"Dashak Pharma": "https://dashakpharma.com/assets/dashak-pharma-edited.webp"');
    console.log('Updated Dashak Pharma URL.');
} else {
    html = html.replace('        };', '            ,"Dashak Pharma": "https://dashakpharma.com/assets/dashak-pharma-edited.webp"\n        };');
    console.log('Added Dashak Pharma URL.');
}

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
