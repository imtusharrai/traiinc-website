const fs = require('fs');
let html = fs.readFileSync('clients.html', 'utf8');

const mappings = [
    { name: "Design N Decor", url: "https://designndecor.co.in/wp-content/uploads/2024/09/LOGO_-DD.png" },
    { name: "Home Stories Interior Design", url: "https://www.homestories.co.in/assets/img/logo/logo.png" },
    { name: "Bhu Master", url: "https://www.bhumaster.com/assets/images/logo.png" },
    { name: "Siddharthas Construction & Colonizer", url: "https://siddharthas.in/portal/assets/img/logo.jpg" },
    { name: "Unishine Group", url: "https://unishinegroup.com/wp-content/uploads/2021/11/unishinelogo.png" },
    { name: "Shriyansh Infracon", url: "https://shriyanshinfracon.in/images/logo-white.png" }
];

let added = 0;
mappings.forEach(m => {
    // If it exists, replace the URL part. If it doesn't, we will append it.
    const regex = new RegExp(`("${m.name}"\\s*:\\s*)"([^"]+)"`);
    if (regex.test(html)) {
        html = html.replace(regex, `$1"${m.url}"`);
        added++;
    } else {
        // Not found, so we inject it right before };
        html = html.replace('        };', `            ,"${m.name}": "${m.url}"\n        };`);
        added++;
    }
});

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Forced mappings in HTML:', added);
