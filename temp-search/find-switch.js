const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const regex = /switch\s*\(\s*page\s*\)[\s\S]*?(?=document\.addEventListener|$)/;
const match = script.match(regex);
if (match) {
    console.log("Switch statement structure:");
    // Just list the cases
    const cases = match[0].match(/case '[^']+':/g);
    console.log(cases);
} else {
    console.log("No page switch found.");
}
