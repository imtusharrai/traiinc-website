const fs = require('fs');
const data = fs.readFileSync('data/about.json', 'utf8');
const about = JSON.parse(data);

about.team.members = about.team.members.map((m, index) => {
  if (index === 0) m.image = "img/tushar.png";
  else if (index === 1) m.image = "img/manna.png";
  else if (index === 2) m.image = "img/anjana.png";
  else if (index === 3) m.image = "img/prafulla.png";
  else m.image = ""; // Clear images for everyone else
  return m;
});

fs.writeFileSync('data/about.json', JSON.stringify(about, null, 2));
