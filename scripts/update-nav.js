const fs = require('fs');
const path = require('path');
const dir = '.';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let c = fs.readFileSync(path.join(dir, file), 'utf8');
  
  // Remove old static nav-links block
  c = c.replace(/<ul class="nav-links">[\s\S]*?<\/ul>/g, '');
  
  // Remove old Let's Talk CTA + mobile btn (calendar link variant)
  c = c.replace(/<a href="https:\/\/calendar[^"]*"[^>]*>Let's Talk<\/a>\s*<button[^>]*>&#9776;<\/button>/g, '');
  
  // Remove old Let's Talk CTA + mobile btn (contact.html variant)
  c = c.replace(/<a href="contact\.html"[^>]*>Let's Talk<\/a>\s*<button[^>]*>&#9776;<\/button>/g, '');
  
  // Inject nav.js before </body> if not already there
  if (!c.includes('nav.js')) {
    c = c.replace('</body>', '    <script src="nav.js?v=1"></script>\n</body>');
  }
  
  // Bump cache version numbers
  c = c.replace(/style\.css\?v=\d+/g, 'style.css?v=26');
  c = c.replace(/script\.js\?v=\d+/g, 'script.js?v=26');
  
  fs.writeFileSync(path.join(dir, file), c, 'utf8');
  console.log('Updated: ' + file);
});

console.log('All done!');
