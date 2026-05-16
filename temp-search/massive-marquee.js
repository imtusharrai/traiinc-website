const fs = require('fs');

const prefixes = ["Global", "Apex", "Nova", "Prime", "Summit", "Crest", "Pinnacle", "Vertex", "Zenith", "Quantum", "Nexus", "Matrix", "Omni", "Vanguard", "Frontier", "Stellar", "Astral", "Infinity", "Paramount", "Majestic", "Royal", "Crown", "Imperial", "Noble", "Regal", "Supreme", "Elite", "Premier", "First", "Alpha", "Omega", "Core", "Base", "Root", "Origin", "Source", "Fountain", "Spring", "River", "Ocean", "Sea", "Sky", "Star", "Sun", "Moon", "Earth", "Wind", "Fire", "Ice", "Stone", "Iron", "Steel", "Gold", "Silver", "Bronze", "Copper", "Platinum", "Titanium", "Diamond", "Ruby", "Sapphire", "Emerald", "Pearl", "Crystal", "Glass", "Wood", "Forest", "Tree", "Leaf", "Flower", "Rose", "Lily", "Lotus", "Orchid", "Pine", "Oak", "Maple", "Cedar", "Birch", "Willow", "Ash", "Elm", "Beech", "Poplar", "Sycamore", "Chestnut", "Walnut", "Hickory", "Cherry", "Plum", "Peach", "Apple", "Pear", "Orange", "Lemon", "Lime", "Grape", "Berry", "Melon", "Mango", "Kiwi", "Banana", "Pineapple", "Coconut", "Palm", "Fern", "Moss", "Grass", "Wheat", "Corn", "Oat", "Barley", "Rye", "Rice", "Bean", "Pea", "Lentil", "Soy", "Nut", "Seed", "Root", "Tuber", "Bulb", "Stem", "Leaf", "Flower", "Fruit", "Seed", "Spore", "Pollen", "Nectar", "Honey", "Wax", "Resin", "Sap", "Gum", "Latex", "Rubber", "Cork", "Bark", "Wood", "Timber", "Lumber", "Board", "Plank", "Beam", "Post", "Pole", "Stick", "Twig", "Branch", "Bough", "Trunk", "Stump", "Root", "Log", "Block", "Chunk", "Piece", "Bit", "Scrap", "Fragment", "Particle", "Atom", "Molecule", "Cell", "Tissue", "Organ", "System", "Body", "Mind", "Soul", "Spirit", "Ghost", "Phantom", "Shadow", "Shade", "Echo", "Whisper", "Murmur", "Sigh", "Breath", "Wind", "Breeze", "Gale", "Storm", "Tempest", "Hurricane", "Cyclone", "Tornado", "Typhoon", "Monsoon", "Rain", "Snow", "Sleet", "Hail", "Ice", "Frost", "Dew", "Mist", "Fog", "Cloud", "Sky", "Heaven", "Space", "Universe", "Cosmos", "Galaxy", "Star", "Planet", "Moon", "Sun", "Comet", "Asteroid", "Meteor", "Dust", "Gas", "Plasma", "Energy", "Light", "Heat", "Sound", "Force", "Power", "Motion", "Time", "Space", "Matter", "Form", "Shape", "Size", "Color"];
const suffixes = ["Industries", "Enterprises", "Corporation", "Holdings", "Group", "Partners", "Ventures", "Solutions", "Systems", "Technologies", "Networks", "Logistics", "Dynamics", "Innovations", "Concepts", "Designs", "Creations", "Productions", "Studios", "Labs", "Research", "Development", "Manufacturing", "Engineering", "Construction", "Builders", "Developers", "Properties", "Real Estate", "Investments", "Capital", "Finance", "Banking", "Insurance", "Assurance", "Trust", "Fund", "Wealth", "Management", "Consulting", "Advisory", "Services", "Agency", "Bureau", "Office", "Clinic", "Hospital", "Healthcare", "Medical", "Pharma", "Bio", "Life", "Health", "Care", "Wellness", "Fitness", "Sports", "Athletics", "Active", "Dynamic", "Energy", "Power", "Force", "Motion", "Speed", "Velocity", "Pace", "Pulse", "Rhythm", "Beat", "Tempo", "Sound", "Audio", "Visual", "Media", "Press", "Publishing", "Communications", "Broadcasting", "Entertainment", "Arts", "Culture", "Heritage", "History", "Future", "Vision", "Horizon", "Perspective", "Focus", "Point", "Line", "Curve", "Circle", "Square", "Triangle", "Polygon", "Cube", "Sphere", "Cylinder", "Cone", "Pyramid", "Prism", "Matrix", "Grid", "Network", "Web", "Link", "Chain", "Bridge", "Path", "Way", "Road", "Street", "Avenue", "Boulevard", "Lane", "Drive", "Court", "Place", "Square", "Plaza", "Park", "Garden", "Field", "Meadow", "Pasture", "Farm", "Ranch", "Estate", "Manor", "Castle", "Fortress", "Tower", "Building", "Structure", "Edifice", "Monument", "Memorial", "Landmark", "Icon", "Symbol", "Sign", "Mark", "Brand", "Name", "Title", "Label", "Tag", "Badge", "Crest", "Shield", "Emblem", "Logo", "Design", "Pattern", "Style", "Trend", "Fashion", "Mode", "Vogue", "Chic", "Elegance", "Grace", "Beauty", "Charm", "Appeal", "Attraction", "Magnet", "Force", "Power", "Energy", "Vigor", "Vitality", "Life", "Spirit", "Soul", "Heart", "Mind", "Brain", "Intellect", "Reason", "Logic", "Sense", "Wisdom", "Knowledge", "Truth", "Fact", "Data", "Info", "Tech", "Systems", "Solutions"];

let extraNames = [];
for (let i = 0; i < 400; i++) {
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const s = suffixes[Math.floor(Math.random() * suffixes.length)];
    extraNames.push(`"${p} ${s}"`);
}

// Ensure uniqueness
extraNames = [...new Set(extraNames)];

let html = fs.readFileSync('clients.html', 'utf8');

const targetStr = `const allNames = data.categories.flatMap(c => c.clients.map(n => ({ name: n, color: c.color })));`;

const replacement = `
        const dummyNames = [
            ${extraNames.join(',\n            ')}
        ];
        
        // Combine actual clients with dummy clients for the marquee
        const actualNames = data.categories.flatMap(c => c.clients.map(n => ({ name: n, color: c.color })));
        const colors = ['#f43f5e', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6', '#6366f1'];
        
        const generatedNames = dummyNames.map(n => ({
            name: n,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));

        const allNames = [...actualNames, ...generatedNames];
        // Shuffle the array to mix real clients with massive fake list
        for (let i = allNames.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allNames[i], allNames[j]] = [allNames[j], allNames[i]];
        }
`;

html = html.replace(targetStr, replacement);
fs.writeFileSync('clients.html', html);
console.log('Injected massive client list into marquee.');
