const fs = require('fs');

const mappings = [
    { name: "Vajraj Balaji Infraestate", url: "https://scontent.flko11-1.fna.fbcdn.net/v/t39.30808-6/343839093_259068326578031_6746816166131875916_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_esDNZ2F03kQ7kNvwFMcexZ&_nc_oc=AdpQbJ4bFIAQrQ5oIZ_5Carj5ILDB63FICg3p2sQEzF7hJEEj5VTKc1cyjbZdSaRM_0&_nc_zt=23&_nc_ht=scontent.flko11-1.fna&_nc_gid=oKcuuTuittxifELJpdFoPw&_nc_ss=7b2a8&oh=00_Af5BceN9ik8onW-iPM0apE04t0sV8HtlUyc3JJl8AtbSjA&oe=6A0E3773" }
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

if (realCat) {
    // Rename Vajra -> Vajraj
    realCat.clients = realCat.clients.map(c => {
        if (c === 'Vajra Balaji Infraestate') {
            return 'Vajraj Balaji Infraestate';
        }
        return c;
    });

    if (!realCat.clients.includes('Vajraj Balaji Infraestate')) {
        realCat.clients.push('Vajraj Balaji Infraestate');
    }

    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log(`JSON updated.`);
}

let html = fs.readFileSync('clients.html', 'utf8');

// Update mappings
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
console.log('HTML updated.');

