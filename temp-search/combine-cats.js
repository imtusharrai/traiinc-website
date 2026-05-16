const fs = require('fs');

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));

const autoIdx = clientsData.categories.findIndex(c => c.id === 'automotive');
const transIdx = clientsData.categories.findIndex(c => c.id === 'transport');

if (autoIdx !== -1 && transIdx !== -1) {
    const autoCat = clientsData.categories[autoIdx];
    const transCat = clientsData.categories[transIdx];
    
    // Create combined category
    const combinedCat = {
        id: 'automotive-logistics',
        label: 'Automotive & Logistics',
        icon: '??', // Or autoCat.icon
        color: transCat.color,
        color2: transCat.color2,
        clients: [...new Set([...autoCat.clients, ...transCat.clients])]
    };
    
    // Replace the first one with the combined one
    clientsData.categories[autoIdx] = combinedCat;
    
    // Remove the second one
    clientsData.categories.splice(transIdx, 1);
    
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
    console.log('Categories combined successfully.');
} else {
    console.log('Could not find one or both categories.');
}

// Bump cache
let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Cache bumped.');
