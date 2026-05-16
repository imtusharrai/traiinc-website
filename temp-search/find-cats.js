const fs = require('fs');
const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

// Find where these clients are
const names = ['Audi', 'Kohli Group', 'Ghar Saathi LLP', 'PB India Group', 'Awadhpuri'];
names.forEach(n => {
    clientsData.categories.forEach(cat => {
        if (cat.clients.includes(n)) {
            console.log(`"${n}" is in ${cat.id} (${cat.label})`);
        }
    });
});

// Check if finance category exists
const fin = clientsData.categories.find(c => c.id === 'finance');
console.log('\nFinance category exists:', !!fin);
console.log('\nAll categories:', clientsData.categories.map(c => c.id + ' - ' + c.label).join('\n'));
