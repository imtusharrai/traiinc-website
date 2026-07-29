const fs = require('fs');
const data = fs.readFileSync('data/about.json', 'utf8');
const about = JSON.parse(data);

const rawMembers = `
1	Tushar Rai	Founder & CEO	Global	tushar.rai@traiinc.com
2	Manna Rai	Director – Head of People & Operations	Global	manna.rai@traiinc.com
3	Anjana Rai	Director – PR & Corporate Communications	Global	anjana.rai@traiinc.com
4	Prafulla Chandra Rai	Director – Government & Public Sector Business	Global	prafulla.rai@traiinc.com
5	Harsh Pandey	VP – Engineering	Global Delivery	harsh.pandey@traiinc.com
6	Neha Sharma	Head of Design & UX	Global Delivery	neha.sharma@traiinc.com
7	Pallavi Mehta	Head of Marketing & Growth	Global	pallavi.mehta@traiinc.com
8	Vineet Saxena	VP – Cloud, AI & Infrastructure	Global Delivery	vineet.saxena@traiinc.com
9	Shipra Singh	VP – Delivery & Quality	Global Delivery	shipra.singh@traiinc.com
10	Aditya Khanna	Business Development Manager	North America	aditya.khanna@traiinc.com
11	Ritika Bhasin	Account Manager	North America	ritika.bhasin@traiinc.com
12	Sriram Krishnamurthy	Solutions Architect	North America	sriram.krishnamurthy@traiinc.com
13	Karan Malhotra	Business Development Manager	UK & Europe	karan.malhotra@traiinc.com
14	Ananya Chatterjee	Account Manager	UK & Europe	ananya.chatterjee@traiinc.com
15	Faisal Merchant	Business Development Manager	Middle East	faisal.merchant@traiinc.com
16	Nandini Iyer	Account Manager	GCC Region	nandini.iyer@traiinc.com
17	Arvind Menon	Business Development Manager	APAC	arvind.menon@traiinc.com
18	Rohan Kulkarni	Business Development Manager	India	rohan.kulkarni@traiinc.com
19	Karthik Narayanan	Senior Mobile App Developer	Global Delivery	karthik.narayanan@traiinc.com
20	Sneha Deshpande	Senior AI & Automation Engineer	Global Delivery	sneha.deshpande@traiinc.com
21	Pranav Patel	Senior Cloud & DevOps Engineer	Global Delivery	pranav.patel@traiinc.com
22	Ishita Ghosh	Digital Marketing Strategist	Global	ishita.ghosh@traiinc.com
23	Dhruv Trivedi	CRM & ERP Consultant	Global Delivery	dhruv.trivedi@traiinc.com
24	Aparna Nair	WhatsApp Business API Specialist	Global Delivery	aparna.nair@traiinc.com
25	Lavanya Reddy	UI/UX Designer	Global Delivery	lavanya.reddy@traiinc.com
26	Nikhil Dubey	Project Manager	Global Delivery	nikhil.dubey@traiinc.com
27	Aditi Sabnis	Technical Writer & Proposals Lead	Global	aditi.sabnis@traiinc.com
28	Shreya Contractor	Partnerships & Alliances Manager	Global	shreya.contractor@traiinc.com
`;

const existingImages = {
  "Tushar Rai": "img/tushar.png",
  "Neha Sharma": "img/neha.png",
  "Harsh Pandey": "img/harsh.png",
  "Pallavi Mehta": "img/pallavi.png",
  "Vineet Saxena": "img/vineet.png",
  "Shipra Singh": "img/shipra.png"
};

const newMembers = rawMembers.trim().split('\n').map(line => {
  const parts = line.split('\t');
  const name = parts[1].trim();
  const role = parts[2].trim();
  const region = parts[3].trim();
  const email = parts[4].trim();
  
  return {
    name,
    role,
    region,
    email,
    image: existingImages[name] || ""
  };
});

about.team.members = newMembers;
fs.writeFileSync('data/about.json', JSON.stringify(about, null, 2));
