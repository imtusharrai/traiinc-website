const fs = require('fs');
const about = JSON.parse(fs.readFileSync('data/about.json', 'utf8'));

// Add tier and department to each member
const tiers = {
  "Tushar Rai": { tier: "founder", department: "Leadership" },
  "Manna Rai": { tier: "founder", department: "Leadership" },
  "Anjana Rai": { tier: "founder", department: "Leadership" },
  "Prafulla Chandra Rai": { tier: "founder", department: "Leadership" },
  "Harsh Pandey": { tier: "leadership", department: "Engineering" },
  "Neha Sharma": { tier: "leadership", department: "Design" },
  "Pallavi Mehta": { tier: "leadership", department: "Marketing" },
  "Vineet Saxena": { tier: "leadership", department: "Engineering" },
  "Shipra Singh": { tier: "leadership", department: "Delivery" },
  "Aditya Khanna": { tier: "regional", department: "Business Development" },
  "Ritika Bhasin": { tier: "regional", department: "Business Development" },
  "Sriram Krishnamurthy": { tier: "regional", department: "Solutions" },
  "Karan Malhotra": { tier: "regional", department: "Business Development" },
  "Ananya Chatterjee": { tier: "regional", department: "Business Development" },
  "Faisal Merchant": { tier: "regional", department: "Business Development" },
  "Nandini Iyer": { tier: "regional", department: "Business Development" },
  "Arvind Menon": { tier: "regional", department: "Business Development" },
  "Rohan Kulkarni": { tier: "regional", department: "Business Development" },
  "Karthik Narayanan": { tier: "specialist", department: "Engineering" },
  "Sneha Deshpande": { tier: "specialist", department: "Engineering" },
  "Pranav Patel": { tier: "specialist", department: "Engineering" },
  "Ishita Ghosh": { tier: "specialist", department: "Marketing" },
  "Dhruv Trivedi": { tier: "specialist", department: "Solutions" },
  "Aparna Nair": { tier: "specialist", department: "Solutions" },
  "Lavanya Reddy": { tier: "specialist", department: "Design" },
  "Nikhil Dubey": { tier: "specialist", department: "Delivery" },
  "Aditi Sabnis": { tier: "specialist", department: "Operations" },
  "Shreya Contractor": { tier: "specialist", department: "Operations" },
};

about.team.members = about.team.members.map(m => {
  const meta = tiers[m.name] || { tier: "specialist", department: "Operations" };
  return { ...m, tier: meta.tier, department: meta.department };
});

// Update section text
about.team.subtitle = "OUR TEAM";
about.team.title = "28 professionals across 6 regions, one mission";

fs.writeFileSync('data/about.json', JSON.stringify(about, null, 2));
console.log("Done — tiers added");
