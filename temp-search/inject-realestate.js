const fs = require('fs');
const rawInput = fs.readFileSync('temp-search/input4.txt', 'utf8');

// The second url has a comma inside it: /v1/fill/w_280,h_113,al_c,lg_1,q_85,enc_avif,quality_auto/
// So splitting by comma is dangerous! 
// Let's use regex to extract Name - URL patterns.
// Pattern: A name, followed by " - https://...", followed by either ", [Name]" or end of string.

// Let's manually parse since it's just 2 items to be safe
const apps = [
  {
    name: 'Radiance city',
    logo: 'https://scontent.flko11-1.fna.fbcdn.net/v/t39.30808-6/577066609_863941189302581_3191812112616976859_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=j14Qnpu3X5EQ7kNvwEVc-Yx&_nc_oc=Ado64ZfVr-Hw1JWI3za0gCPwSOs2cFT1FLJhGh0UlufHYK-a70p2bFk2F5vUqxl6gpw&_nc_zt=23&_nc_ht=scontent.flko11-1.fna&_nc_gid=FsS-_RwgR96kvVJEDNIh0A&_nc_ss=7b2a8&oh=00_Af4mQHHdOhifN8LDjKoDS2Q38Jw7Sw9jgzr1PI1uPwkLWA&oe=6A0E00BA'
  },
  {
    name: 'sdv construction',
    logo: 'https://static.wixstatic.com/media/9b8923_f0b0b5bc67ad49a2a94a73e6016588e7~mv2.png/v1/fill/w_280,h_113,al_c,lg_1,q_85,enc_avif,quality_auto/SDV-Logo-R-Website-2.png'
  }
];

const clientsData = JSON.parse(fs.readFileSync('data/clients.json', 'utf8'));
const realCat = clientsData.categories.find(c => c.id === 'real-estate');

let addedNames = 0;
if (realCat) {
    apps.forEach(app => {
        if (!realCat.clients.includes(app.name)) {
            realCat.clients.push(app.name);
            addedNames++;
        }
    });
    fs.writeFileSync('data/clients.json', JSON.stringify(clientsData, null, 2));
}

let html = fs.readFileSync('clients.html', 'utf8');
const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;

const existingString = html.substring(startIdx, endIdx);
let newObjStr = existingString.slice(0, -2); // Remove };

let addedUrls = 0;
apps.forEach(app => {
    if (!newObjStr.includes('"' + app.name + '":')) {
        newObjStr = newObjStr.trim();
        if (newObjStr.endsWith(',')) {
            newObjStr += '\n            "' + app.name + '": "' + app.logo + '"';
        } else {
            newObjStr += ',\n            "' + app.name + '": "' + app.logo + '"';
        }
        addedUrls++;
    }
});

newObjStr += '\n        };';

let newHtml = html.substring(0, startIdx) + newObjStr + html.substring(endIdx);
newHtml = newHtml.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', newHtml);
console.log('Added names to JSON:', addedNames);
console.log('Added URLs to HTML:', addedUrls);
