const fs = require('fs');
let html = fs.readFileSync('clients.html', 'utf8');

const startIdx = html.indexOf('const domainLogos = {');
const endIdx = html.indexOf('};', startIdx) + 2;
const objStr = html.substring(startIdx, endIdx);

// Fix the object string
let fixed = objStr;

// Fix double-quoted values like ,"key": "value"" -> ,"key": "value"
// The issue is lines ending with "" instead of "
fixed = fixed.replace(/""$/gm, '"');

// Remove stray comma-only lines
fixed = fixed.replace(/^\s*,\s*$/gm, '');

// Fix leading comma entries like ,"key": -> "key":
// Actually these are fine as continuation, but let's make sure no double commas
fixed = fixed.replace(/,\s*,/g, ',');

// Make sure no trailing comma before };
fixed = fixed.replace(/,\s*\n\s*};/, '\n        };');

html = html.substring(0, startIdx) + fixed + html.substring(endIdx);

// Bump cache
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());

fs.writeFileSync('clients.html', html);

// Verify
try {
    const newHtml = fs.readFileSync('clients.html', 'utf8');
    const s = newHtml.indexOf('const domainLogos = {');
    const e = newHtml.indexOf('};', s) + 1;
    const o = newHtml.substring(s + 'const domainLogos = '.length, e);
    new Function('return ' + o)();
    console.log('FIXED! domainLogos is now valid JS.');
} catch(err) {
    console.error('Still broken:', err.message);
}
