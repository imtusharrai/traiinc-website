const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Serve files locally with a simple HTTP server using Python so Puppeteer can load them
    const { exec } = require('child_process');
    const server = exec('python3 -m http.server 8080');
    
    // Wait for server to start
    await new Promise(r => setTimeout(r, 1000));
    
    try {
        await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0' });
        
        const widths = [1400, 1250, 1100, 1000];
        for (const w of widths) {
            await page.setViewport({ width: w, height: 900 });
            await new Promise(r => setTimeout(r, 1000)); // wait for resize animations
            await page.screenshot({ path: `hero_${w}.png`, clip: { x: 0, y: 0, width: w, height: 750 } });
            console.log(`Saved hero_${w}.png`);
        }
    } finally {
        server.kill();
        await browser.close();
    }
})();
