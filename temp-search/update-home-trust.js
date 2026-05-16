const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/home.json', 'utf8'));

console.log('Current trust block:', JSON.stringify(data.trust, null, 2));

data.trust.title = "POWERED BY INDUSTRY-LEADING TECHNOLOGIES & PLATFORMS";
data.trust.logos = [
  "AWS", "Google Cloud", "Microsoft Azure", "Zoho", "Canva", 
  "GoDaddy", "Google Workspace", "Meta", "WhatsApp Business", 
  "HubSpot", "Odoo", "Zoho ERP", "LinkedIn"
];

fs.writeFileSync('data/home.json', JSON.stringify(data, null, 2));
console.log('Updated data/home.json with technology brands!');

// Bump cache
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
    let htmlContent = fs.readFileSync(file, 'utf8');
    htmlContent = htmlContent.replace(/home\.json\?v=\d+/, 'home.json?v=' + Date.now());
    htmlContent = htmlContent.replace(/script\.js\?v=\d+/, 'script.js?v=' + Date.now());
    fs.writeFileSync(file, htmlContent);
}

