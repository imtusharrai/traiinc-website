const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const code = fs.readFileSync('js/nav.js', 'utf8');

const dom = new JSDOM(`<!DOCTYPE html><html lang="en"><body><nav id="navbar"></nav></body></html>`, { runScripts: "dangerously" });

// Define window and document globally for the script
global.window = dom.window;
global.document = dom.window.document;
global.localStorage = { getItem: () => null, setItem: () => {} };

try {
    dom.window.eval(code);
    console.log("SUCCESS!");
} catch (e) {
    console.error("ERROR:", e);
}
