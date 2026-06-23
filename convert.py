import os
import re

services = [
    "ai-agents", "ai-automation", "ai-voice-agents", "cloud-devops", 
    "custom-software", "cybersecurity", "data-analytics", "digital-marketing", 
    "enterprise-platforms", "lead-gen-scraping", "mobile-apps", "motion-video", 
    "ui-ux-design", "web-development", "workflow-automation"
]

def get_text_between(html, start_marker, end_marker, start_index=0):
    start = html.find(start_marker, start_index)
    if start == -1: return ""
    start += len(start_marker)
    end = html.find(end_marker, start)
    if end == -1: return ""
    return html[start:end].strip()

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{desc}">
    <title>{title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">

    <!-- SEO & Tracking -->
    <meta property="og:title" content="{title}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://traiinc.com/{slug}.html">
    <meta property="og:image" content="https://traiinc.com/assets/logos/logo.png">
    <meta name="twitter:card" content="summary_large_image">
    <link rel="canonical" href="https://traiinc.com/{slug}.html">
    <link rel="icon" type="image/x-icon" href="assets/logos/favicon.ico">
    <link rel="apple-touch-icon" href="assets/logos/apple-touch-icon.png">
</head>
<body data-page="{slug}">
    <nav id="navbar"></nav>
    <main id="content">Loading...</main>
    <footer id="footer"></footer>

    <script src="js/app.js"></script>
    <script src="js/nav.js"></script>
    <script src="js/animations.js"></script>
</body>
</html>"""

for svc in services:
    filepath = f"{svc}.html"
    if not os.path.exists(filepath): continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Check if already a thin template
    if 'id="content"' in html and 'app.js' in html and len(html) < 2000:
        continue

    title = get_text_between(html, "<title>", "</title>")
    if not title: title = f"{svc.replace('-', ' ').title()} | TRAI Inc"
    
    desc_match = re.search(r'<meta name="description" content="(.*?)">', html)
    desc = desc_match.group(1) if desc_match else "Custom enterprise IT solutions."

    new_html = template.format(slug=svc, title=title, desc=desc)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_html)

print("Converted all service pages to thin templates.")
