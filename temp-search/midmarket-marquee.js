const fs = require('fs');

// We exclude: Tata, Reliance, Adani, Birla, Mahindra, Bajaj, Godrej, Hindustan
const prefixes = [
    "Sharma", "Verma", "Gupta", "Bharat", "India", "National", "Asian", "Orient", "Ganga", "Yamuna", 
    "Narmada", "Godavari", "Krishna", "Kaveri", "Brahmaputra", "Himalaya", "Vindhya", "Aravali", "Nilgiri", 
    "Deccan", "Malabar", "Coromandel", "Surya", "Chandra", "Akash", "Prithvi", "Agni", "Vayu", "Jal", "Tej", 
    "Shakti", "Gati", "Pragati", "Vikas", "Navya", "Modern", "New Age", "Future", "Apex", "Summit", "Crown", 
    "Royal", "Imperial", "Shree", "Om", "Swastik", "Jai", "Vijay", "Anand", "Shanti", "Prem", "Kiran", "Jyoti", 
    "Uday", "Sunrise", "Horizon", "Shiv", "Balaji", "Tirupati", "Ganesh", "Lakshmi", "Saraswati", "Durga", 
    "Bhavani", "Amba", "Rama", "Vishnu", "Mahesh", "Raj", "Kapoor", "Singh", "Reddy", "Patel", "Shah", "Mehta", 
    "Desai", "Jain", "Agarwal", "Bansal", "Mittal", "Garg", "Goel", "Chauhan", "Rajput", "Rao", "Nair", "Menon", 
    "Iyer", "Iyengar", "Pillai", "Das", "Bose", "Ghosh", "Mukherjee", "Banerjee", "Chatterjee", "Sen", "Nath",
    "Avendus", "Chitra", "Vedanta", "Aarav", "Param", "Nirman", "Kalyan", "Aayush"
];

const suffixes = [
    "Industries", "Enterprises", "Group", "Corporation", "Limited", "Holdings", "Partners", "Ventures", 
    "Solutions", "Systems", "Technologies", "Networks", "Logistics", "Transports", "Freight", "Cargo", 
    "Shipping", "Aviation", "Automotive", "Motors", "Vehicles", "Tractors", "Engineering", "Construction", 
    "Builders", "Developers", "Real Estate", "Properties", "Infra", "Infrastructure", "Capital", "Finance", 
    "Banking", "Insurance", "Wealth", "Investments", "Securities", "Trading", "Commerce", "Retail", "Mart", 
    "Bazaar", "Supermarket", "Consumer", "FMCG", "Foods", "Beverages", "Agro", "Agriculture", "Farms", 
    "Dairy", "Seeds", "Fertilizers", "Chemicals", "Plastics", "Polymers", "Rubber", "Textiles", "Garments", 
    "Apparel", "Fashion", "Silks", "Cottons", "Yarns", "Mills", "Synthetics", "Healthcare", "Medical", 
    "Hospitals", "Clinics", "Pharma", "Pharmaceuticals", "Bio", "Life Sciences", "Wellness", "Diagnostics", 
    "Energy", "Power", "Solar", "Wind", "Hydro", "Green", "Renewables", "Mining", "Minerals", "Metals", 
    "Steel", "Iron", "Aluminum", "Copper", "Cement", "Concrete", "Ceramics", "Glass", "Media", "Broadcasting", 
    "Entertainment", "Studios", "Cinemas", "Press", "Publishing", "Education", "Academy", "Institute", 
    "EdTech", "Hospitality", "Hotels", "Resorts", "Tourism", "Travels", "IT", "Software", "Hardware", 
    "Electronics", "AI", "Data"
];

let extraNames = [];
for (let i = 0; i < 600; i++) {
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    extraNames.push(`"${p} ${s}"`);
}

// Ensure uniqueness and take exactly 400
extraNames = [...new Set(extraNames)].slice(0, 400);

let html = fs.readFileSync('clients.html', 'utf8');

// Find the existing dummyNames array using regex
const regex = /const dummyNames = \[[^\]]+\];/s;
const match = html.match(regex);

if (match) {
    const replacement = `const dummyNames = [\n            ${extraNames.join(',\n            ')}\n        ];`;
    html = html.replace(match[0], replacement);
    
    // Bump cache
    html = html.replace(/data\/clients\.json\?v=\d+/, 'data/clients.json?v=' + Date.now());
    
    fs.writeFileSync('clients.html', html);
    console.log('Injected realistic SMB/mid-market Indian client list into marquee.');
} else {
    console.log('Could not find existing dummyNames array.');
}
