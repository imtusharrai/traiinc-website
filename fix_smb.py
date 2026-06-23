import re

with open('smb.html', 'r') as f:
    content = f.read()

# 1. Remove the inline <style> block
content = re.sub(r'<style>[\s\S]*?</style>', '', content)

# 2. Replace the hero section
old_hero = r'<section class="cf-hero-wrapper"[\s\S]*?</section>'
new_hero = """
        <!-- ════════ HERO ════════ -->
        <section class="msme-hero">
            <div class="msme-hero-inner">
                <div>
                    <div class="msme-badge">📈 Built for Growing Businesses</div>
                    <h1>You have outgrown spreadsheets.<br>Now <span class="gradient-word">what?</span></h1>
                    <p class="msme-hero-sub">Custom CRMs, workflow automation, and digital marketing systems that scale with your business — without the cost of an in-house IT team.</p>
                    <div class="hero-cta-row">
                        <a href="https://calendar.app.google/PUsxADQBnpQsTrDbA" target="_blank" class="btn-primary large">📅 Get a Free Consultation</a>
                    </div>
                    <div class="hero-trust">
                        <div class="hero-trust-avatars">
                            <span class="trust-avatar trust-avatar-1">SG</span>
                            <span class="trust-avatar trust-avatar-2">RC</span>
                            <span class="trust-avatar trust-avatar-3">CC</span>
                            <span class="trust-avatar trust-avatar-4">+</span>
                        </div>
                        <span>Trusted by <strong class="trust-count">80+ SMBs</strong> across India</span>
                    </div>
                </div>
                <div class="hero-mockup">
                    <div class="mockup-main">
                        <div class="mockup-bar"><span></span><span></span><span></span></div>
                        <div class="mockup-metrics">
                            <div class="mockup-metric">
                                <div class="mockup-metric-label">👥 Active CRM Users</div>
                                <div class="mockup-metric-value green">450+</div>
                            </div>
                            <div class="mockup-metric">
                                <div class="mockup-metric-label">⚡ Workflows Automated</div>
                                <div class="mockup-metric-value gold">12,000/mo</div>
                            </div>
                            <div class="mockup-metric">
                                <div class="mockup-metric-label">💰 IT Cost Savings</div>
                                <div class="mockup-metric-value">₹15L/yr</div>
                            </div>
                            <div class="mockup-metric">
                                <div class="mockup-metric-label">⭐ Client Retention</div>
                                <div class="mockup-metric-value green">98%</div>
                            </div>
                        </div>
                        <div class="mockup-chart"></div>
                    </div>
                    <div class="float-card float-card-1">
                        <div class="fc-icon">📊</div>
                        <div class="fc-label">Sales Dashboard</div>
                        <div class="fc-value fc-value-active">Live ✓</div>
                    </div>
                    <div class="float-card float-card-2">
                        <div class="fc-icon">💬</div>
                        <div class="fc-label">WhatsApp Bot</div>
                        <div class="fc-value">Active</div>
                    </div>
                </div>
            </div>
        </section>
"""
content = re.sub(old_hero, new_hero, content, count=1)

# 3. Fix inline styles globally
# Strip style attributes from HTML tags, except for gradient text logic where classes handle it now
content = re.sub(r' style="[^"]*"', '', content)

# 4. Map logo-avatar gradients to avatar-grad-N
import random
def repl_avatar(match):
    grad_num = random.randint(1, 10)
    return f'<div class="logo-avatar avatar-grad-{grad_num}">'

content = re.sub(r'<div class="logo-avatar">', repl_avatar, content)

# 5. Fix specific sections that need classes applied instead of inline styles
content = content.replace('<!-- FEATURE PILLS -->\n    <section class="container fade-in">', '<!-- FEATURE PILLS -->\n    <section class="container fade-in section-pills">')

# Let's write back
with open('smb_fixed.html', 'w') as f:
    f.write(content)
