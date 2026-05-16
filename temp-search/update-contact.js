const fs = require('fs');
const clientsData = JSON.parse(fs.readFileSync('data/contact.json', 'utf8'));

clientsData.booking.calendar_url = "https://calendar.app.google/PUsxADQBnpQsTrDbA";
clientsData.form = {
    "title": "Send us a Message",
    "description": "Fill out the form below and our team will get back to you within 24 hours.",
    "fields": {
        "name": "Full Name",
        "email": "Work Email",
        "phone": "Phone Number",
        "company": "Company Name",
        "message": "Tell us about your project..."
    },
    "button": "Send Message"
};

fs.writeFileSync('data/contact.json', JSON.stringify(clientsData, null, 2));
console.log('Updated data/contact.json');

// Also bump cache in clients.html for good measure
let html = fs.readFileSync('clients.html', 'utf8');
html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
fs.writeFileSync('clients.html', html);
