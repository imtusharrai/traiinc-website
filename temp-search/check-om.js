const fs = require('fs');
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

// Find "Mahindra Automobiles" or "Om Group" to see what to rename/add
clientsData.categories.forEach(cat => {
    cat.clients.forEach(c => {
        if (c.toLowerCase().includes('mahindra') || c.toLowerCase().includes('om group')) {
            console.log(`Found "${c}" in ${cat.id}`);
        }
    });
});

// Check if "??" is still anywhere in categories
clientsData.categories.forEach(cat => {
    if (cat.icon.includes('??') || cat.label.includes('??')) {
        console.log(`Found "??" in ${cat.id}: icon="${cat.icon}", label="${cat.label}"`);
    }
});

