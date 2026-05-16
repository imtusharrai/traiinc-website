const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.js'));
for (const file of files) {
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('dynamic-content')) {
        console.log(`Found dynamic-content in ${file}`);
    }
}
