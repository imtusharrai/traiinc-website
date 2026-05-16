const fs = require('fs');
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
clientsData.categories.forEach(cat => {
    cat.clients.forEach(c => {
        if (c.toLowerCase().includes('magnet')) console.log(`Found: "${c}" in ${cat.id}`);
    });
});
