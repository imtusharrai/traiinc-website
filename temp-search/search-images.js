const fs = require('fs');
const google = require('googlethis');

(async () => {
    const missingClients = JSON.parse(fs.readFileSync('./temp-search/missingClients.json', 'utf8'));
    console.log('Fetching raw image URLs for:', missingClients.length, 'clients');
    const externalLogos = {};
    const stillMissing = [];
    
    // We filter out SG Square as we already added it
    const filteredClients = missingClients.filter(c => c !== 'SG Square');

    for (let i = 0; i < filteredClients.length; i++) {
        const client = filteredClients[i];
        try {
            const query = client + ' logo Lucknow';
            const images = await google.image(query, { safe: false });
            
            if (images && images.length > 0) {
                // Find first decent image url
                const validImg = images.find(img => img.url && img.url.startsWith('http') && !img.url.includes('lookaside.fbsbx.com'));
                if (validImg) {
                    externalLogos[client] = validImg.url;
                    console.log('[' + (i+1) + '/' + filteredClients.length + '] ' + client + ' -> Found Image');
                } else {
                    stillMissing.push(client);
                    console.log('[' + (i+1) + '/' + filteredClients.length + '] ' + client + ' -> NO IMAGE');
                }
            } else {
                stillMissing.push(client);
            }
        } catch (e) {
            stillMissing.push(client);
            console.log('[' + (i+1) + '/' + filteredClients.length + '] ' + client + ' -> Error/429');
            // If we hit 429, wait extra
            await new Promise(r => setTimeout(r, 4000));
        }
        await new Promise(r => setTimeout(r, 1000)); 
    }
    
    fs.writeFileSync('./temp-search/externalLogos.json', JSON.stringify(externalLogos, null, 2));
    console.log('Done! Wrote externalLogos.json');
})();
