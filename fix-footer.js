const fs = require('fs');
let code = fs.readFileSync('script.js', 'utf8');

// Use regex to match the footer-links div and replace it
// The file stores & as & (single ampersand inside template literal)
const regex = /            <div class="footer-links">[\s\S]*?            <\/div>\n            <div class="footer-newsletter">/;

const newCols = `            <!-- Col 2: Company -->
            <div class="link-group">
                <h4>Company</h4>
                <ul>
                    <li><a href="about.html">🏢 About Us</a></li>
                    <li><a href="solutions.html">⚙️ Solutions</a></li>
                    <li><a href="industries.html">🏭 Industries</a></li>
                    <li><a href="incubation.html">🚀 Incubation</a></li>
                    <li><a href="careers.html">💼 Careers</a></li>
                    <li><a href="partner.html">🤝 Partner</a></li>
                </ul>
            </div>

            <!-- Col 3: Services -->
            <div class="link-group">
                <h4>Services</h4>
                <ul>
                    <li><a href="solutions.html">☁️ Cloud & DevOps</a></li>
                    <li><a href="solutions.html">🤖 AI & Automation</a></li>
                    <li><a href="solutions.html">📱 Mobile Apps</a></li>
                    <li><a href="solutions.html">🎨 UI/UX Design</a></li>
                    <li><a href="solutions.html">📈 Digital Marketing</a></li>
                    <li><a href="solutions.html">🔒 Cybersecurity</a></li>
                </ul>
            </div>

            <!-- Col 4: Location + Hours -->
            <div class="link-group">
                <h4>📍 Location</h4>
                <p>DLF Mypad, Vibhuti Khand,<br>Gomti Nagar, Lucknow,<br>India — 226010</p>
                <h4 style="margin-top:20px;">⏰ Hours</h4>
                <p>Mon–Sat: 9am – 7pm IST<br>Sun: By appointment</p>
            </div>

            <!-- Col 5: Newsletter -->
            <div class="footer-newsletter">`;

const result = code.replace(regex, newCols);

if (result === code) {
    console.log('ERROR: regex did not match');
    // Debug: find the footer-links line
    const lines = code.split('\n');
    const idx = lines.findIndex(l => l.includes('footer-links'));
    console.log('footer-links found at line', idx+1);
    console.log('Lines around it:');
    lines.slice(idx-1, idx+5).forEach((l,i) => console.log((idx+i)+': '+JSON.stringify(l)));
} else {
    fs.writeFileSync('script.js', result, 'utf8');
    console.log('SUCCESS: footer-links div replaced with flat columns');
}
