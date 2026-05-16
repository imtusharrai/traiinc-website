const fs = require('fs');
const html = fs.readFileSync('clients.html', 'utf8');

const regex = /(function|\(function).*?marquee-inner.*?\n/s;
// Let's just view lines 400-600 to find the whole `<script>` block.
const scriptStart = html.lastIndexOf('<script');
const scriptEnd = html.lastIndexOf('</script>') + 9;
console.log(html.substring(scriptStart, scriptEnd));

