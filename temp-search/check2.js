try {
    const fs = require('fs');
    const html = fs.readFileSync('clients.html', 'utf8');
    
    const startIdx = html.indexOf('const domainLogos = {');
    const endIdx = html.indexOf('};', startIdx) + 1;
    
    if (startIdx === -1 || endIdx === 0) {
        console.error('domainLogos object not found in HTML!');
    } else {
        const objStr = html.substring(startIdx + 'const domainLogos = '.length, endIdx);
        // try parsing the object using Function constructor
        const check = new Function('return ' + objStr);
        check();
        console.log('clients.html domainLogos is valid JS');
    }
} catch(e) {
    console.error('clients.html JS ERROR:', e.message);
}
