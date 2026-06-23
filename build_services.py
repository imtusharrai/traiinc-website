import json
import os

with open("data/extracted_services.json", "r", encoding="utf-8") as f:
    extracted = json.load(f)

with open("data/solutions.json", "r", encoding="utf-8") as f:
    solutions = json.load(f)

# Build a mapping from solutions.json to extract tags
tags_map = {}
for sol in solutions.get("solutions", []):
    tags_map[sol["title"]] = sol["tags"]
for grp in solutions.get("service_groups", []):
    for s in grp.get("services", []):
        tags_map[s["name"]] = [] # can fallback
for ai in solutions.get("ai_agents", []):
    tags_map[ai["title"]] = ai["tags"]

# Specific enhancements for each service
enhancements = {
    "ai-agents": {
        "icon": "🧠", "color": "#d299c2",
        "tech_stack": ["LangChain", "OpenAI", "LlamaIndex", "Pinecone", "Python", "FastAPI"],
        "use_cases": ["Customer Support Automation", "Internal Knowledge Retrieval", "Competitive Analysis Research"],
        "extra_features": [
            {"icon": "🔄", "color": "#fbc2eb", "title": "Continuous Learning", "desc": "Agents that adapt and improve over time based on feedback and new data."}
        ]
    },
    "ai-automation": {
        "icon": "🤖", "color": "#a18cd1",
        "tech_stack": ["TensorFlow", "PyTorch", "Hugging Face", "AWS SageMaker", "OpenAI API"],
        "use_cases": ["Document Processing", "Predictive Maintenance", "Automated QA"],
        "extra_features": [
            {"icon": "📄", "color": "#fda085", "title": "Intelligent Document Processing", "desc": "Extract and structure data from PDFs, invoices, and hand-written forms automatically."}
        ]
    },
    "ai-voice-agents": {
        "icon": "🎙️", "color": "#f6d365",
        "tech_stack": ["Vapi", "Retell AI", "ElevenLabs", "Twilio", "Deepgram"],
        "use_cases": ["Inbound Call Routing", "Outbound Lead Qualification", "Appointment Scheduling"],
        "extra_features": [
            {"icon": "🗣️", "color": "#ff9a9e", "title": "Human-like TTS", "desc": "Ultra-realistic text-to-speech with natural pauses and conversational pacing."}
        ]
    },
    "cloud-devops": {
        "icon": "☁️", "color": "#00f2fe",
        "tech_stack": ["AWS", "Terraform", "Kubernetes", "Docker", "GitHub Actions", "Datadog"],
        "use_cases": ["Zero-downtime Migrations", "Microservices Orchestration", "Cost Optimization"],
        "extra_features": [
            {"icon": "📉", "color": "#4facfe", "title": "Cloud Cost Optimization", "desc": "Audit and restructure your cloud instances to save up to 40% on monthly AWS/GCP bills."}
        ]
    },
    "custom-software": {
        "icon": "🏗️", "color": "#43e97b",
        "tech_stack": ["React", "Node.js", "Python", "PostgreSQL", "GraphQL", "AWS"],
        "use_cases": ["SaaS Platform Development", "Internal Tools", "Legacy System Modernization"],
        "extra_features": [
            {"icon": "🧩", "color": "#38f9d7", "title": "Modular Architecture", "desc": "Microservices and decoupled architectures that scale infinitely as your user base grows."}
        ]
    },
    "cybersecurity": {
        "icon": "🔒", "color": "#fa709a",
        "tech_stack": ["Kali Linux", "Burp Suite", "AWS Shield", "Cloudflare", "OpenVAS"],
        "use_cases": ["Penetration Testing", "SOC 2 Readiness", "Vulnerability Management"],
        "extra_features": [
            {"icon": "🛡️", "color": "#fee140", "title": "Zero-Trust Implementation", "desc": "Secure your internal networks and applications using modern identity-first security."}
        ]
    },
    "data-analytics": {
        "icon": "📊", "color": "#30cfd0",
        "tech_stack": ["Snowflake", "dbt", "Apache Kafka", "Power BI", "Tableau", "Airflow"],
        "use_cases": ["Real-time Dashboards", "Data Lake Setup", "Predictive Analytics"],
        "extra_features": [
            {"icon": "📈", "color": "#330867", "title": "Actionable BI", "desc": "Transform raw database rows into visual, real-time insights for your executive team."}
        ]
    },
    "digital-marketing": {
        "icon": "📈", "color": "#f093fb",
        "tech_stack": ["Google Ads", "Meta Ads", "Ahrefs", "HubSpot", "Mailchimp"],
        "use_cases": ["B2B Lead Generation", "E-Commerce ROAS Scaling", "SEO & Content Strategy"],
        "extra_features": [
            {"icon": "🎯", "color": "#f5576c", "title": "Conversion Rate Optimization", "desc": "A/B testing and funnel optimization to turn more visitors into paying customers."}
        ]
    },
    "enterprise-platforms": {
        "icon": "⚙️", "color": "#a1c4fd",
        "tech_stack": ["Salesforce", "SAP", "Node.js", "React", "Kafka"],
        "use_cases": ["Custom ERP Development", "CRM Integration", "Supply Chain Management"],
        "extra_features": [
            {"icon": "🔗", "color": "#c2e9fb", "title": "Seamless API Integrations", "desc": "Connect your legacy on-premise systems with modern cloud APIs without disruption."}
        ]
    },
    "lead-gen-scraping": {
        "icon": "🕷️", "color": "#cfd9df",
        "tech_stack": ["Puppeteer", "BeautifulSoup", "Scrapy", "Python", "Apify"],
        "use_cases": ["Competitor Pricing Tracking", "B2B Contact Scraping", "Real Estate Aggregation"],
        "extra_features": [
            {"icon": "🕵️", "color": "#e2ebf0", "title": "Anti-Ban Scraping", "desc": "Rotating proxies and headless browsers to reliably extract data from heavily protected sites."}
        ]
    },
    "mobile-apps": {
        "icon": "📱", "color": "#84fab0",
        "tech_stack": ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
        "use_cases": ["Consumer iOS/Android Apps", "Enterprise Field Worker Apps", "Mobile E-Commerce"],
        "extra_features": [
            {"icon": "🚀", "color": "#8fd3f4", "title": "Offline-First Sync", "desc": "Apps that work perfectly without an internet connection and sync seamlessly when online."}
        ]
    },
    "motion-video": {
        "icon": "🎥", "color": "#ff0844",
        "tech_stack": ["After Effects", "Premiere Pro", "Cinema 4D", "Lottie", "Blender"],
        "use_cases": ["Product Explainer Videos", "UI Micro-interactions", "Social Media Campaigns"],
        "extra_features": [
            {"icon": "✨", "color": "#ffb199", "title": "Web-Optimized Lottie", "desc": "High-quality vector animations exported as tiny JSON files for zero-lag web performance."}
        ]
    },
    "ui-ux-design": {
        "icon": "🎨", "color": "#a6c0fe",
        "tech_stack": ["Figma", "Adobe XD", "Framer", "Webflow", "Storybook"],
        "use_cases": ["SaaS Dashboard Design", "Mobile App UI", "Design System Creation"],
        "extra_features": [
            {"icon": "📐", "color": "#f68084", "title": "Component Libraries", "desc": "We build scalable Figma design systems that your engineering team can easily translate to code."}
        ]
    },
    "web-development": {
        "icon": "🌐", "color": "#13547a",
        "tech_stack": ["Next.js", "React", "Tailwind CSS", "Vercel", "Stripe"],
        "use_cases": ["Corporate Websites", "Headless E-Commerce", "Web Applications"],
        "extra_features": [
            {"icon": "⚡", "color": "#80d0c7", "title": "Core Web Vitals", "desc": "Guaranteed 90+ Lighthouse scores with sub-second page loads and optimized asset delivery."}
        ]
    },
    "workflow-automation": {
        "icon": "⚡", "color": "#fccb90",
        "tech_stack": ["n8n", "Zapier", "Make", "Airtable", "Python"],
        "use_cases": ["CRM Data Syncing", "Invoice Processing", "Onboarding Automation"],
        "extra_features": [
            {"icon": "🤖", "color": "#d57eeb", "title": "Error-Proof Logic", "desc": "Complex branching logic, error handling, and webhooks that never drop a single payload."}
        ]
    }
}

final_data = {}

for svc, ext in extracted.items():
    enh = enhancements.get(svc, {})
    
    # Base extraction
    hero = ext.get("hero", {})
    features = ext.get("features", [])
    process = ext.get("process", [])
    
    # Ensure at least 4 features
    if len(features) < 4 and "extra_features" in enh:
        for extra in enh["extra_features"]:
            features.append({
                "icon": extra["icon"],
                "color": extra["color"],
                "title": extra["title"],
                "desc": extra["desc"]
            })
            
    # Add filler feature if still < 4
    if len(features) < 4:
        features.append({
            "icon": "✅",
            "color": "#cccccc",
            "title": "Dedicated Support",
            "desc": "Ongoing maintenance and support to ensure your system runs flawlessly."
        })
        
    final_data[svc] = {
        "title": hero.get("title", ""),
        "badge": hero.get("badge", ""),
        "subtitle": hero.get("subtitle", ""),
        "icon": enh.get("icon", "✨"),
        "color": enh.get("color", "#4facfe"),
        "features": features,
        "process": process,
        "tech_stack": enh.get("tech_stack", ["React", "Node.js", "AWS", "Python"]),
        "use_cases": enh.get("use_cases", ["Enterprise Transformation", "Operational Efficiency"]),
        "cta": {
            "title": "Ready to build something exceptional?",
            "description": "Stop settling for mediocre agencies. Let's discuss your product roadmap and engineer a solution that accelerates your growth.",
            "button_text": "Book a Consultation"
        }
    }

with open("data/services.json", "w", encoding="utf-8") as f:
    json.dump(final_data, f, indent=2)

print("Created data/services.json successfully.")
