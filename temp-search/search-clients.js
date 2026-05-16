const fs = require('fs');
const google = require('googlethis');

(async () => {
    const clientsData = JSON.parse(fs.readFileSync('./data/clients.json', 'utf8'));
    const allClients = clientsData.categories.flatMap(c => c.clients);
    
    console.log('Total clients to search:', allClients.length);
    const domainLogos = {};
    
    for (let i = 0; i < allClients.length; i++) {
        const client = allClients[i];
        try {
            const query = client + ' company official website';
            const options = {
              page: 0, 
              safe: false,
              additional_params: { hl: 'en' }
            };
            const response = await google.search(query, options);
            if (response.results && response.results.length > 0) {
                const validRes = response.results.find(r => {
                    const u = r.url.toLowerCase();
                    return !u.includes('justdial.com') && 
                           !u.includes('facebook.com') && 
                           !u.includes('linkedin.com') && 
                           !u.includes('instagram.com') &&
                           !u.includes('indiamart.com') &&
                           !u.includes('zaubacorp.com') &&
                           !u.includes('tradeindia.com') &&
                           !u.includes('wikipedia.org') &&
                           !u.includes('youtube.com');
                });
                if (validRes) {
                    const url = new URL(validRes.url);
                    let hostname = url.hostname.replace('www.', '');
                    domainLogos[client] = 'https://logo.clearbit.com/' + hostname;
                    console.log('[' + (i+1) + '/' + allClients.length + '] ' + client + ' -> ' + hostname);
                } else {
                    console.log('[' + (i+1) + '/' + allClients.length + '] ' + client + ' -> No valid domain found');
                }
            }
        } catch (e) {
            console.log('[' + (i+1) + '/' + allClients.length + '] ' + client + ' -> Error');
        }
        await new Promise(r => setTimeout(r, 600)); // 600ms to avoid Google 429
    }
    
    fs.writeFileSync('./temp-search/domainLogos.json', JSON.stringify(domainLogos, null, 2));
    console.log('Done! Wrote to domainLogos.json');
})();
