const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Load local file
    const url = 'file:///Users/tusharrai/StudioProjects/traiinc-website/content-creation.html';
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Dark Mode
    await page.screenshot({ path: '/Users/tusharrai/.gemini/antigravity-ide/brain/72cc8c0c-d732-49c2-a314-c1021b088d76/content_creation_dark.png', fullPage: true });

    // Light Mode (trigger toggle)
    await page.evaluate(() => {
        document.body.classList.add('light-mode');
        // If there's a theme toggle function, we just force the class for now
    });
    // Wait a sec for transitions
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: '/Users/tusharrai/.gemini/antigravity-ide/brain/72cc8c0c-d732-49c2-a314-c1021b088d76/content_creation_light.png', fullPage: true });

    await browser.close();
    console.log("Screenshots captured");
})();
