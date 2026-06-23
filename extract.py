import os
import json
import re

services = [
    "ai-agents", "ai-automation", "ai-voice-agents", "cloud-devops", 
    "custom-software", "cybersecurity", "data-analytics", "digital-marketing", 
    "enterprise-platforms", "lead-gen-scraping", "mobile-apps", "motion-video", 
    "ui-ux-design", "web-development", "workflow-automation"
]

data = {}

def get_text_between(html, start_marker, end_marker, start_index=0):
    start = html.find(start_marker, start_index)
    if start == -1: return "", -1
    start += len(start_marker)
    end = html.find(end_marker, start)
    if end == -1: return "", -1
    return html[start:end].strip(), end

for svc in services:
    filepath = f"{svc}.html"
    if not os.path.exists(filepath): continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()
    
    badge, _ = get_text_between(html, '<div class="msme-badge">', '</div>')
    title, _ = get_text_between(html, '<h1>', '</h1>')
    subtitle, _ = get_text_between(html, '<p class="msme-hero-sub">', '</p>')
    
    # Extract bento cards
    features = []
    idx = 0
    while True:
        card_start = html.find('class="bento-card', idx)
        if card_start == -1: break
        
        # Color
        color_start = html.find('border-top: 4px solid ', card_start)
        color = html[color_start+22:color_start+29] if color_start != -1 else ""
        
        icon, _ = get_text_between(html, 'class="bento-icon"', '</div>', card_start)
        icon = icon.split('>')[-1].strip() if icon else ""
        
        title_text, _ = get_text_between(html, 'class="bento-title">', '</h3>', card_start)
        desc_text, idx = get_text_between(html, 'class="bento-desc">', '</p>', card_start)
        
        features.append({
            "icon": icon,
            "color": color,
            "title": title_text,
            "desc": desc_text
        })
        
    # Process
    process_steps = []
    idx = 0
    while True:
        card_start = html.find('class="process-card"', idx)
        if card_start == -1: break
        
        num, _ = get_text_between(html, 'class="process-number">', '</div>', card_start)
        title_text, _ = get_text_between(html, '<h3>', '</h3>', card_start)
        desc_text, idx = get_text_between(html, '<p>', '</p>', card_start)
        
        process_steps.append({
            "number": num,
            "title": title_text,
            "desc": desc_text
        })
        
    data[svc] = {
        "hero": {
            "badge": badge,
            "title": title,
            "subtitle": subtitle
        },
        "features": features,
        "process": process_steps
    }

with open("data/extracted_services.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

print("Extracted to data/extracted_services.json")
