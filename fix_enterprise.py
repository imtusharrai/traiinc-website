import re
import random

with open('enterprise.html', 'r') as f:
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
                    <div class="msme-badge">🏢 Enterprise Grade. Startup Speed.</div>
                    <h1>Digital transformation.<br>Without the <span class="gradient-word">bloat.</span></h1>
                    <p class="msme-hero-sub">We modernize legacy systems, build scalable cloud architectures, and integrate AI into enterprise workflows. Delivered by senior engineers, not massive offshore teams.</p>
                    <div class="hero-cta-row">
                        <a href="contact.html" class="btn-primary large">📅 Schedule Architecture Review</a>
                    </div>
                    <div class="hero-trust">
                        <div class="hero-trust-avatars">
                            <span class="trust-avatar trust-avatar-5">TV</span>
                            <span class="trust-avatar trust-avatar-6">JH</span>
                            <span class="trust-avatar trust-avatar-7">CS</span>
                            <span class="trust-avatar trust-avatar-8">+</span>
                        </div>
                        <span>Trusted by <strong class="trust-count">Enterprise Leaders</strong> across India</span>
                    </div>
                </div>
                <div class="hero-mockup">
                    <div class="mockup-main">
                        <div class="mockup-bar"><span></span><span></span><span></span></div>
                        <div class="mockup-metrics">
                            <div class="mockup-metric">
                                <div class="mockup-metric-label">⚡ System Uptime</div>
                                <div class="mockup-metric-value green">99.99%</div>
                            </div>
                            <div class="mockup-metric">
                                <div class="mockup-metric-label">🚀 Legacy Migrations</div>
                                <div class="mockup-metric-value gold">12+</div>
                            </div>
                            <div class="mockup-metric">
                                <div class="mockup-metric-label">🛡️ Security Score</div>
                                <div class="mockup-metric-value">A+</div>
                            </div>
                            <div class="mockup-metric">
                                <div class="mockup-metric-label">💰 Team Overhead</div>
                                <div class="mockup-metric-value green">Zero</div>
                            </div>
                        </div>
                        <div class="mockup-chart"></div>
                    </div>
                    <div class="float-card float-card-1">
                        <div class="fc-icon">☁️</div>
                        <div class="fc-label">Cloud Migration</div>
                        <div class="fc-value fc-value-active">Complete ✓</div>
                    </div>
                    <div class="float-card float-card-2">
                        <div class="fc-icon">🤖</div>
                        <div class="fc-label">AI Integration</div>
                        <div class="fc-value">Deploying</div>
                    </div>
                </div>
            </div>
        </section>
"""
content = re.sub(old_hero, new_hero, content, count=1)

# 3. Fix inline styles globally
content = re.sub(r' style="[^"]*"', '', content)

# 4. Map logo-avatar gradients
def repl_avatar(match):
    grad_num = random.randint(1, 10)
    return f'<div class="logo-avatar avatar-grad-{grad_num}">'
content = re.sub(r'<div class="logo-avatar">', repl_avatar, content)

# 5. Fix classes
content = content.replace('<!-- FEATURE PILLS -->\n    <section class="container fade-in">', '<!-- FEATURE PILLS -->\n    <section class="container fade-in section-pills">')
content = content.replace('<section class="container fade-in">', '<section class="container fade-in content-section">')

# Write back
with open('enterprise_fixed.html', 'w') as f:
    f.write(content)
