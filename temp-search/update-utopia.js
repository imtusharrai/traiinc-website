const fs = require('fs');

let html = fs.readFileSync('clients.html', 'utf8');

const oldRegex = /("Utopia Medihealth"\s*:\s*)"([^"]+)"/;
if (oldRegex.test(html)) {
    html = html.replace(oldRegex, '"Utopia Medihealth": "https://scontent.flko11-1.fna.fbcdn.net/v/t39.30808-6/299196611_399432538995605_8338896356169761770_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=H10cJNZsjmoQ7kNvwEIC14_&_nc_oc=AdoXsZpSLH2cLWAEvNh7yi4OaxXp-q7tMjH_eui4Aq6PXjdZ2cksHuWUSl9fISmLV18&_nc_zt=23&_nc_ht=scontent.flko11-1.fna&_nc_gid=aCAQoTT3EXuwL0SANKlpOg&_nc_ss=7b2a8&oh=00_Af5MVDLdm0SoWsugt5tJorXFz1dfc1EW4sos6Pfya3HoTA&oe=6A0E1579"');
    console.log('Updated Utopia Medihealth URL.');
} else {
    html = html.replace('        };', '            ,"Utopia Medihealth": "https://scontent.flko11-1.fna.fbcdn.net/v/t39.30808-6/299196611_399432538995605_8338896356169761770_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=H10cJNZsjmoQ7kNvwEIC14_&_nc_oc=AdoXsZpSLH2cLWAEvNh7yi4OaxXp-q7tMjH_eui4Aq6PXjdZ2cksHuWUSl9fISmLV18&_nc_zt=23&_nc_ht=scontent.flko11-1.fna&_nc_gid=aCAQoTT3EXuwL0SANKlpOg&_nc_ss=7b2a8&oh=00_Af5MVDLdm0SoWsugt5tJorXFz1dfc1EW4sos6Pfya3HoTA&oe=6A0E1579"\n        };');
    console.log('Added Utopia Medihealth URL.');
}

html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
console.log('Done.');
