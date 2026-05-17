const fs = require('fs');
const path = require('path');
const dir = '.';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
files.forEach(file => {
  let c = fs.readFileSync(path.join(dir, file), 'utf8');
  // Replace entire nav block with empty shell
  c = c.replace(/<nav id="navbar">[\s\S]*?<\/nav>/, '<nav id="navbar"></nav>');
  fs.writeFileSync(path.join(dir, file), c, 'utf8');
  console.log('Cleaned: ' + file);
});
console.log('Done');
