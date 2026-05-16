const fs = require('fs');

const mappings = [
    { name: "New Fleet Solutions", cat: "transport", url: "https://static.wixstatic.com/media/3fa915_092a5cbed845442d8ec5113426efe05d~mv2.png/v1/fill/w_412,h_90,al_c,lg_1,q_85,enc_avif,quality_auto/new%20fleet%20horizontal.png" },
    { name: "North Quest Solutions", cat: "enterprise", url: "https://northquestsolutions.com/wp-content/uploads/2023/08/North-Quest-Solutions-Name-Logo-1.png" },
    { name: "The IGEA", cat: "education", url: "https://www.theigea.com/webassets/img/logo/logo-white.png" }
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

mappings.forEach(m => {
    const category = clientsData.categories.find(c => c.id === m.cat);
    if (category) {
        if (!category.clients.includes(m.name)) {
            category.clients.push(m.name);
        }
    }
});

fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));

// Update HTML mapping
let html = fs.readFileSync('clients.html', 'utf8');

mappings.forEach(m => {
    const regex = new RegExp(`("${m.name}"\\s*:\\s*)"([^"]+)"`, 'i');
    if (regex.test(html)) {
        html = html.replace(regex, `"${m.name}": "${m.url}"`);
    } else {
        html = html.replace('        };', `            ,"${m.name}": "${m.url}"\n        };`);
    }
});

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);
console.log('JSON and HTML updated for Fleet, North Quest, and IGEA.');

