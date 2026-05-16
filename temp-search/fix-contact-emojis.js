const fs = require('fs');
let script = fs.readFileSync('script.js', 'utf8');

const idx = script.indexOf('function renderContact');
const endIdx = script.indexOf('function ', idx + 20);

if (idx !== -1) {
    let block = script.substring(idx, endIdx !== -1 ? endIdx : script.length);
    
    // Replace the first ?? with ✅ (in the form success message)
    block = block.replace('??', '✅');
    
    // Replace the next ?? with 📞 (Call Us)
    block = block.replace('??', '📞');
    
    // Replace the next ?? with ✉️ (Email Us)
    block = block.replace('??', '✉️');
    
    // Replace the next ?? with 📍 (Headquarters)
    block = block.replace('??', '📍');
    
    // Replace the next ?? with 📅 (Booking card)
    block = block.replace('??', '📅');
    
    script = script.substring(0, idx) + block + (endIdx !== -1 ? script.substring(endIdx) : '');
    fs.writeFileSync('script.js', script);
    console.log('Fixed emojis in renderContact!');
}

// Bump cache
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
    let htmlContent = fs.readFileSync(file, 'utf8');
    htmlContent = htmlContent.replace(/script\.js\?v=\d+/, 'script.js?v=' + Date.now());
    fs.writeFileSync(file, htmlContent);
}

