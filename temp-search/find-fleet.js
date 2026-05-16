const fs = require('fs');

const name = "New Fleet Solutions";
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

// Find it
clientsData.categories.forEach(cat => {
    if (cat.clients.includes(name)) {
        console.log(`Found "${name}" in ${cat.id} (${cat.label})`);
    }
});
