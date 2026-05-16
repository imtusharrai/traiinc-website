const cheerio = require('cheerio');

(async () => {
    try {
        const res = await fetch('https://play.google.com/store/apps/developer?id=FH+Apps+Five&hl=en_US');
        const html = await res.text();
        const $ = cheerio.load(html);
        
        const apps = [];
        
        $('a[href^="/store/apps/details"]').each((i, el) => {
            const name = $(el).find('.DdHX5e').text() || $(el).find('.ubtiRe').text() || $(el).text();
            const img = $(el).find('img').attr('src');
            if (name && img && !name.includes('google')) {
                apps.push({ name: name.trim(), logo: img });
            }
        });
        
        if (apps.length === 0) {
            // Google Play Store renders client side sometimes, but the initial HTML usually has a script tag with the data
            const matches = html.match(/"([^"]+)","[^"]+","(https:\/\/play-lh\.googleusercontent\.com\/[^"]+)"/g);
            if (matches) {
                matches.forEach(m => {
                    const parts = m.split(',');
                    if (parts.length >= 3) {
                        const name = parts[0].replace(/"/g, '');
                        const logo = parts[2].replace(/"/g, '');
                        if (name.length > 2 && !name.includes('http')) {
                            apps.push({ name, logo });
                        }
                    }
                });
            }
        }
        
        // deduplicate
        const unique = [];
        const seen = new Set();
        apps.forEach(a => {
            if (!seen.has(a.name) && a.name.length > 0 && !a.name.includes('\\u003d')) {
                seen.add(a.name);
                unique.push(a);
            }
        });
        
        console.log('Found unique apps:', unique.length);
        console.log(unique.slice(0, 10));
        
        const fs = require('fs');
        fs.writeFileSync('fh_apps.json', JSON.stringify(unique, null, 2));
    } catch(e) {
        console.error(e);
    }
})();
