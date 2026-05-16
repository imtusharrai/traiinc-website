const fs = require('fs');
let script = fs.readFileSync('script.js', 'utf8');

// Find the form block in renderContact
const formRegex = /<form class="premium-form"[^>]*>[\s\S]*?<\/form>/;

const replacementBlock = `
            <div class="onboarding-timeline" style="margin-top: 40px;">
                <h3 style="font-size: 1.6rem; margin-bottom: 30px; border-bottom: 1px solid var(--border-light); padding-bottom: 15px;">Our Engagement Process</h3>
                
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <div style="background: var(--accent-color); color: white; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">1</div>
                    <div>
                        <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Discovery & Scoping</h4>
                        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">We schedule a call to understand your business objectives, technical constraints, and current architecture.</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); color: var(--text-main); width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">2</div>
                    <div>
                        <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Proposal & Timeline</h4>
                        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">Our engineering team delivers a comprehensive roadmap, system architecture draft, and transparent pricing.</p>
                    </div>
                </div>
                
                <div style="display: flex; gap: 20px;">
                    <div style="background: rgba(255,255,255,0.05); border: 1px solid var(--border-light); color: var(--text-main); width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; font-size: 1.2rem;">3</div>
                    <div>
                        <h4 style="font-size: 1.2rem; margin-bottom: 8px;">Project Kickoff</h4>
                        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6;">We allocate your dedicated squad, set up communication channels, and execute the first development sprint.</p>
                    </div>
                </div>
            </div>
`;

if (formRegex.test(script)) {
    script = script.replace(formRegex, replacementBlock);
    
    // Also remove the data.form.title reference and replace with a generic text
    script = script.replace(/\$\{data\.form\.title \|\| 'GET IN TOUCH'\}/, 'GET IN TOUCH');
    script = script.replace(/\$\{data\.form\.description \|\| data\.header\.description\}/, '${data.header.description}');
    
    fs.writeFileSync('script.js', script);
    console.log('Replaced form with timeline!');
} else {
    console.log('Could not find form block');
}

// Bump cache
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
    let htmlContent = fs.readFileSync(file, 'utf8');
    htmlContent = htmlContent.replace(/script\.js\?v=\d+/, 'script.js?v=' + Date.now());
    fs.writeFileSync(file, htmlContent);
}
