const fs = require('fs');
let nav = fs.readFileSync('nav.js', 'utf8');

if (nav.includes('about.html#contact')) {
    nav = nav.replace(/about\.html#contact/g, 'contact.html');
    fs.writeFileSync('nav.js', nav);
    console.log('Updated nav.js');
} else {
    console.log('nav.js did not contain about.html#contact');
}

// Bump nav.js cache in all html files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
    let htmlContent = fs.readFileSync(file, 'utf8');
    if (htmlContent.includes('nav.js?v=')) {
        htmlContent = htmlContent.replace(/nav\.js\?v=\d+/, 'nav.js?v=' + Date.now());
        fs.writeFileSync(file, htmlContent);
    }
}
console.log('Cache bumped for nav.js');
