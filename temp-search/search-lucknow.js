const fs = require('fs');
const google = require('googlethis');

(async () => {
    const missingClients = JSON.parse(fs.readFileSync('./temp-search/missingClients.json', 'utf8'));
    console.log('Total missing clients to search with Lucknow:', missingClients.length);
    const domainLogos = {};
    const newMissing = [];
    
    for (let i = 0; i < missingClients.length; i++) {
        const client = missingClients[i];
        try {
            const query = client + ' Lucknow official website';
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
                           !u.includes('youtube.com') &&
                           !u.includes('sulekha.com') &&
                           !u.includes('magicbricks.com') &&
                           !u.includes('housing.com') &&
                           !u.includes('99acres.com') &&
                           !u.includes('zomato.com') &&
                           !u.includes('swiggy.com');
                });
                
                if (validRes) {
                    const url = new URL(validRes.url);
                    let hostname = url.hostname.replace('www.', '');
                    domainLogos[client] = 'https://logo.clearbit.com/' + hostname;
                    console.log('[' + (i+1) + '/' + missingClients.length + '] ' + client + ' -> ' + hostname);
                } else {
                    newMissing.push(client);
                    console.log('[' + (i+1) + '/' + missingClients.length + '] ' + client + ' -> STILL NO MATCH');
                }
            } else {
                newMissing.push(client);
            }
        } catch (e) {
            newMissing.push(client);
            console.log('[' + (i+1) + '/' + missingClients.length + '] ' + client + ' -> Error/429');
        }
        await new Promise(r => setTimeout(r, 1200)); 
    }
    
    fs.writeFileSync('./temp-search/lucknowLogos.json', JSON.stringify(domainLogos, null, 2));
    fs.writeFileSync('./temp-search/missingClients2.json', JSON.stringify(newMissing, null, 2));
    console.log('Done! Wrote to lucknowLogos.json');
})();
