const fs = require('fs');
const { chromium } = require('playwright');

const pages = [
  '404.html', 'about.html', 'ai-automation.html', 'app-store.html',
  'bhu-master.html', 'blog.html', 'careers.html', 'choosing-a-development-partner.html',
  'client-reviews.html', 'clients.html', 'cloud-devops.html', 'contact.html',
  'content-creation.html', 'custom-software.html', 'data-analytics.html', 'digital-marketing.html',
  'enterprise-platforms.html', 'enterprise.html', 'index.html', 'industries.html',
  'mobile-apps.html', 'msmes.html', 'our-development-process.html', 'partner.html',
  'pricing.html', 'privacy.html', 'refund.html', 'smb.html', 'solutions.html',
  'startups.html', 'terms.html', 'ui-ux-design.html', 'web-development.html',
  'whatsapp_cover_generator.html', 'whatsapp_welcome_card.html', 'workezy.html'
];

const baseUrl = 'http://localhost:8081/';

(async () => {
  if (!fs.existsSync('screenshots/dark-mode')) {
    fs.mkdirSync('screenshots/dark-mode', { recursive: true });
  }

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  await context.addInitScript(() => {
    localStorage.setItem('trai-theme', 'dark');
    document.documentElement.classList.add('bot-detected');
    window.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('bot-detected');
        document.documentElement.classList.remove('light-mode');
        document.body.classList.remove('light-mode');
        
        // Force height to be auto and make fade-ins instantly visible
        const style = document.createElement('style');
        style.innerHTML = `
            html, body {
                height: auto !important;
                min-height: auto !important;
                overflow-y: visible !important;
            }
            .fade-in {
                opacity: 1 !important;
                transform: none !important;
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    });
  });
  const page = await context.newPage();

  for (const p of pages) {
    try {
      console.log(`Navigating to ${baseUrl}${p}...`);
      await page.goto(`${baseUrl}${p}`, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Auto-scroll to trigger lazy loading and wait for renders
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 400;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if (totalHeight >= scrollHeight - window.innerHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 50);
        });
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 1000)); // wait for transitions
      });

      const screenshotName = `screenshots/dark-mode/${p.replace('.html', '.png')}`;
      console.log(`Saving screenshot to ${screenshotName}`);
      
      await page.screenshot({ path: screenshotName, fullPage: true });
    } catch (e) {
      console.error(`Error capturing ${p}:`, e);
    }
  }

  await browser.close();
  console.log('All dark-mode screenshots captured successfully!');
})();
