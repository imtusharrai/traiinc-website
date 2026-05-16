const fs = require('fs');
const script = fs.readFileSync('script.js', 'utf8');

const idx = script.indexOf('function renderContact');
const endIdx = script.indexOf('function ', idx + 20);

const replacement = `function renderContact(data) {
    return \`
    <section class="contact-section container fade-in" style="padding: 150px 24px 100px; display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px; align-items: start;">
        
        <!-- Left Column: Premium Form -->
        <div class="contact-form-wrapper" style="background: var(--bg-card); padding: 50px; border-radius: 24px; border: 1px solid var(--border-light); box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
            <h4 class="mini-title">\${data.form.title || 'GET IN TOUCH'}</h4>
            <h2 style="font-size: 2.2rem; margin-bottom: 10px;">\${data.header.title}</h2>
            <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 1.05rem;">\${data.form.description || data.header.description}</p>
            
            <form class="premium-form" id="contactForm" onsubmit="event.preventDefault(); this.innerHTML='<div style=\\'text-align:center; padding: 40px;\\'><div style=\\'font-size:3rem; margin-bottom:20px;\\'>?</div><h3 style=\\'font-size:1.5rem; margin-bottom:10px;\\'>Message Sent Successfully!</h3><p style=\\'color:var(--text-muted);\\'>Our team will reach out to you within 24 hours.</p></div>';">
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">\${data.form.fields.name || 'Full Name'}</label>
                        <input type="text" required style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; color: var(--text-main); font-size: 1rem; transition: all 0.3s ease;">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">\${data.form.fields.email || 'Work Email'}</label>
                        <input type="email" required style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; color: var(--text-main); font-size: 1rem; transition: all 0.3s ease;">
                    </div>
                </div>
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">\${data.form.fields.phone || 'Phone Number'}</label>
                        <input type="tel" required style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; color: var(--text-main); font-size: 1rem; transition: all 0.3s ease;">
                    </div>
                    <div class="form-group">
                        <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">\${data.form.fields.company || 'Company'}</label>
                        <input type="text" style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; color: var(--text-main); font-size: 1rem; transition: all 0.3s ease;">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: 30px;">
                    <label style="display: block; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">\${data.form.fields.message || 'Message'}</label>
                    <textarea required rows="4" style="width: 100%; padding: 16px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: 12px; color: var(--text-main); font-size: 1rem; transition: all 0.3s ease; resize: vertical;"></textarea>
                </div>
                <button type="submit" class="btn-primary large" style="width: 100%; justify-content: center; font-size: 1.1rem; padding: 18px;">\${data.form.button || 'Send Message'}</button>
            </form>
        </div>
        
        <!-- Right Column: Info & Calendar -->
        <div class="contact-sidebar" style="display: flex; flex-direction: column; gap: 40px;">
            
            <div class="contact-info-blocks" style="display: grid; gap: 30px;">
                <div class="info-block" style="display: flex; gap: 20px; align-items: flex-start;">
                    <div class="info-icon" style="font-size: 1.8rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; border: 1px solid var(--border-light);">??</div>
                    <div>
                        <h4 style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Call Us Directly</h4>
                        <a href="tel:\${data.contact_info.phone}" style="font-size: 1.4rem; font-weight: 600; color: var(--text-main); text-decoration: none;">\${data.contact_info.phone}</a>
                    </div>
                </div>
                
                <div class="info-block" style="display: flex; gap: 20px; align-items: flex-start;">
                    <div class="info-icon" style="font-size: 1.8rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; border: 1px solid var(--border-light);">??</div>
                    <div>
                        <h4 style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Email Us</h4>
                        <a href="mailto:\${data.contact_info.email}" style="font-size: 1.4rem; font-weight: 600; color: var(--text-main); text-decoration: none;">\${data.contact_info.email}</a>
                    </div>
                </div>
                
                <div class="info-block" style="display: flex; gap: 20px; align-items: flex-start;">
                    <div class="info-icon" style="font-size: 1.8rem; background: rgba(255,255,255,0.05); width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 16px; border: 1px solid var(--border-light);">??</div>
                    <div>
                        <h4 style="font-size: 0.9rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Headquarters</h4>
                        <p style="font-size: 1.1rem; color: var(--text-main); line-height: 1.5; max-width: 250px;">\${data.contact_info.address}</p>
                    </div>
                </div>
            </div>

            <div class="booking-card" style="background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent); padding: 40px; border-radius: 24px; border: 1px solid var(--border-light); text-align: center; position: relative; overflow: hidden;">
                <!-- Decorative glow -->
                <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: var(--accent-color); filter: blur(80px); opacity: 0.3; border-radius: 50%;"></div>
                
                <div style="font-size: 3rem; margin-bottom: 20px; position: relative; z-index: 1;">??</div>
                <h3 style="font-size: 1.8rem; margin-bottom: 15px; position: relative; z-index: 1;">\${data.booking.title}</h3>
                <p style="color: var(--text-muted); margin-bottom: 30px; font-size: 1.05rem; line-height: 1.6; position: relative; z-index: 1;">\${data.booking.description}</p>
                <a href="\${data.booking.calendar_url}" target="_blank" class="btn-primary large" style="width: 100%; position: relative; z-index: 1; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">\${data.booking.button_text}</a>
            </div>
            
        </div>
    </section>
    
    <!-- CSS for Inputs -->
    <style>
        .premium-form input:focus, .premium-form textarea:focus {
            outline: none;
            border-color: var(--accent-color);
            background: rgba(255,255,255,0.08);
            box-shadow: 0 0 0 4px rgba(255, 62, 108, 0.1);
        }
        @media (max-width: 768px) {
            .contact-section {
                grid-template-columns: 1fr !important;
                padding: 120px 20px 80px !important;
            }
            .premium-form .form-row {
                grid-template-columns: 1fr !important;
            }
        }
    </style>
    \`;
}
`;

let newScript;
if (endIdx !== -1) {
    newScript = script.substring(0, idx) + replacement + script.substring(endIdx);
} else {
    newScript = script.substring(0, idx) + replacement;
}

// Ensure the cache parameter is bumped for script.js inside the HTML files
const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
    let htmlContent = fs.readFileSync(file, 'utf8');
    htmlContent = htmlContent.replace(/script\.js\?v=\d+/, 'script.js?v=' + Date.now());
    fs.writeFileSync(file, htmlContent);
}

fs.writeFileSync('script.js', newScript);
console.log('Updated renderContact in script.js and bumped cache.');
