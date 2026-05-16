const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/industries.json', 'utf8'));

// Add missing industries if not present
const existing = data.industries.map(i => i.name);

if (!existing.includes('Media & Entertainment')) {
    data.industries.push({
        id: "media",
        icon: "📺",
        name: "Media & Entertainment",
        desc: "Transforming how audiences consume content with scalable streaming platforms, personalized recommendation engines, and high-engagement digital experiences.",
        features: ["OTT Streaming Platforms", "Content Delivery Networks", "Fan Engagement Apps", "DRM & Video Security"]
    });
}

if (!existing.includes('Travel & Tourism')) {
    data.industries.push({
        id: "travel",
        icon: "✈️",
        name: "Travel & Tourism",
        desc: "Elevating the modern travel experience through AI-driven itineraries, seamless booking integrations, and dynamic pricing engines.",
        features: ["Smart Booking Systems", "Itinerary Generators", "GDS Integrations", "Loyalty Program Portals"]
    });
}

fs.writeFileSync('data/industries.json', JSON.stringify(data, null, 2));
console.log('Added missing industries: ' + data.industries.map(i => i.name).join(', '));

// Bump cache
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
    let htmlContent = fs.readFileSync(file, 'utf8');
    htmlContent = htmlContent.replace(/industries\.json\?v=\d+/, 'industries.json?v=' + Date.now());
    fs.writeFileSync(file, htmlContent);
}

