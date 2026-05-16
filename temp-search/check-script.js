const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const contactMatch = script.match(/case 'contact':[\s\S]*?break;/);
if (contactMatch) {
    console.log(contactMatch[0]);
} else {
    console.log("No contact case found in script.js switch statement.");
    // show switch statement start
    console.log(script.substring(0, 500));
}
