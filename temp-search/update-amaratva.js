const fs = require('fs');

let html = fs.readFileSync('clients.html', 'utf8');

const oldRegex = /("Amaratva Bioscience"\s*:\s*)"([^"]+)"/;
if (oldRegex.test(html)) {
    html = html.replace(oldRegex, '"Amaratva Bioscience": "https://amaratvabioscience.com/websiteassets/img/logo.png"');
    console.log('Updated Amaratva Bioscience URL.');
} else {
    html = html.replace('        };', '            ,"Amaratva Bioscience": "https://amaratvabioscience.com/websiteassets/img/logo.png"\n        };');
    console.log('Added Amaratva Bioscience URL.');
}

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
