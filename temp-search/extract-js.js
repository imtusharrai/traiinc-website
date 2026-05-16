const fs = require('fs');
const html = fs.readFileSync('clients.html', 'utf8');

const jsStart = html.indexOf('<script>');
const jsEnd = html.lastIndexOf('</script>');

if (jsStart !== -1 && jsEnd !== -1) {
    const jsCode = html.substring(jsStart + 8, jsEnd);
    fs.writeFileSync('temp-search/test-clients.js', jsCode);
    console.log('Saved JS to test-clients.js');
}
