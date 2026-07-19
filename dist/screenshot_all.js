const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Get all html files from dist/
  const files = fs.readdirSync('./dist').filter(f => f.endsWith('.html'));
  
  // Exclude files we already reviewed to save time
  const exclude = ['index.html', 'solutions.html', 'custom-software.html', 'mobile-apps.html', 'ai-automation.html', 'contact.html'];
  
  const targetFiles = files.filter(f => !exclude.includes(f));

  for (const file of targetFiles) {
    const name = file.replace('.html', '');
    console.log(`Processing ${name}...`);
    try {
      await page.goto(`http://localhost:3000/${file}`, { waitUntil: 'networkidle2' });
      
      // Take Dark Mode screenshot
      await page.screenshot({ path: `/Users/tusharrai/.gemini/antigravity-ide/brain/72cc8c0c-d732-49c2-a314-c1021b088d76/${name}_dark.png`, fullPage: true });

      // Toggle Light Mode
      await page.evaluate(() => {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      });
      
      await new Promise(r => setTimeout(r, 500));
      
      // Take Light Mode screenshot
      await page.screenshot({ path: `/Users/tusharrai/.gemini/antigravity-ide/brain/72cc8c0c-d732-49c2-a314-c1021b088d76/${name}_light.png`, fullPage: true });
      
      // Reset
      await page.evaluate(() => {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
      });
    } catch (e) {
      console.log(`Failed on ${name}: ${e.message}`);
    }
  }

  await browser.close();
})();
