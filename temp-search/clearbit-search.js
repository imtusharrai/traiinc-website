const fs = require('fs');

(async () => {
    const clientsData = JSON.parse(fs.readFileSync('./data/clients.json', 'utf8'));
    const allClients = clientsData.categories.flatMap(c => c.clients);
    
    console.log('Total clients to search:', allClients.length);
    const domainLogos = {};
    const missingClients = [];
    
    for (let i = 0; i < allClients.length; i++) {
        const client = allClients[i];
        try {
            const encoded = encodeURIComponent(client);
            const response = await fetch('https://autocomplete.clearbit.com/v1/companies/suggest?query=' + encoded);
            const data = await response.json();
            
            if (data && data.length > 0) {
                // Clearbit returns a logo URL usually, or we can use logo.clearbit.com
                const url = data[0].domain;
                domainLogos[client] = 'https://logo.clearbit.com/' + url;
                console.log('[' + (i+1) + '/' + allClients.length + '] ' + client + ' -> ' + url);
            } else {
                missingClients.push(client);
                console.log('[' + (i+1) + '/' + allClients.length + '] ' + client + ' -> NO MATCH');
            }
        } catch (e) {
            missingClients.push(client);
            console.log('[' + (i+1) + '/' + allClients.length + '] ' + client + ' -> Error');
        }
        await new Promise(r => setTimeout(r, 200)); 
    }
    
    fs.writeFileSync('./temp-search/clearbitLogos.json', JSON.stringify(domainLogos, null, 2));
    fs.writeFileSync('./temp-search/missingClients.json', JSON.stringify(missingClients, null, 2));
    console.log('Done! Wrote to clearbitLogos.json and missingClients.json');
})();
