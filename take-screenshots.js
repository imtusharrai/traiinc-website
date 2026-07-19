
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  // Dark mode screenshot
  await page.goto('http://localhost:8081/custom-software', { waitUntil: 'networkidle2', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: 'assets/screenshots/dark-mode-full.png', fullPage: true });
  
  // Toggle to light mode
  await page.click('.theme-toggle');
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'assets/screenshots/light-mode-full.png', fullPage: true });
  
  await browser.close();
  console.log('Screenshots saved successfully!');
})();
