const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto('http://localhost:9999', { waitUntil: 'networkidle0' });

    // Hover Services
    await page.hover('.has-dropdown:nth-child(2) > a');
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/Users/tusharrai/.gemini/antigravity/brain/7efcf47b-f19c-4275-9b4d-b67b1907a08b/services_hover_1280.png' });

    // Hover Technologies
    await page.hover('.has-dropdown:nth-child(5) > a');
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/Users/tusharrai/.gemini/antigravity/brain/7efcf47b-f19c-4275-9b4d-b67b1907a08b/tech_hover_1280.png' });

    // Narrow Viewport
    await page.setViewport({ width: 1000, height: 800 });
    await page.hover('.has-dropdown:nth-child(2) > a');
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/Users/tusharrai/.gemini/antigravity/brain/7efcf47b-f19c-4275-9b4d-b67b1907a08b/services_hover_1000.png' });
    
    await page.hover('.has-dropdown:nth-child(5) > a');
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/Users/tusharrai/.gemini/antigravity/brain/7efcf47b-f19c-4275-9b4d-b67b1907a08b/tech_hover_1000.png' });

    // Mobile Viewport
    await page.setViewport({ width: 400, height: 800 });
    // Click mobile menu
    await page.click('#mobile-menu-btn');
    await page.waitForTimeout(300);
    // Click Technologies dropdown
    await page.click('.has-dropdown:nth-child(5) > a');
    await page.waitForTimeout(500);
    await page.screenshot({ path: '/Users/tusharrai/.gemini/antigravity/brain/7efcf47b-f19c-4275-9b4d-b67b1907a08b/mobile_menu.png' });

    await browser.close();
    console.log("Screenshots captured!");
})();
