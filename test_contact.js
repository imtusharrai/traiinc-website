const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));

    await page.goto('https://traiinc.com/contact', { waitUntil: 'networkidle2' });
    
    // Wait a moment for Turnstile to render
    await new Promise(r => setTimeout(r, 2000));
    
    // Check DOM for turnstile
    const turnstileDiv = await page.$('.cf-turnstile');
    console.log('Turnstile div exists?', !!turnstileDiv);
    
    if (turnstileDiv) {
        const turnstileHTML = await page.evaluate(el => el.outerHTML, turnstileDiv);
        console.log('Turnstile HTML:', turnstileHTML);
    }
    
    const turnstileInput = await page.$('input[name="cf-turnstile-response"]');
    console.log('Turnstile input exists?', !!turnstileInput);
    
    // Check dark/light mode classes on body
    const bodyClass = await page.evaluate(() => document.body.className);
    console.log('Body class:', bodyClass);
    
    await page.screenshot({ path: 'contact_form_test.png', fullPage: true });
    console.log('Screenshot saved to contact_form_test.png');
    
    await browser.close();
})();
