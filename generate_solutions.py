import re

solutions = [
    {
        "id": "cloud-devops",
        "title": "Cloud & DevOps Solutions",
        "badge": "☁️ Core Engineering",
        "headline": "Scalable Infrastructure.<br>Zero <span class='gradient-word'>Downtime.</span>",
        "subtext": "AWS, Azure, and GCP migrations. We build resilient, auto-scaling cloud architectures and CI/CD pipelines that let your team ship code faster.",
        "meta": "Cloud & DevOps services for AWS, Azure, GCP migrations and CI/CD automation."
    },
    {
        "id": "ai-automation",
        "title": "AI & Automation",
        "badge": "🤖 Core Engineering",
        "headline": "Smarter operations.<br>Automated <span class='gradient-word'>growth.</span>",
        "subtext": "Leverage LLMs, custom agents, and intelligent workflows to automate redundant tasks and scale your business without scaling your headcount.",
        "meta": "Custom AI & Automation solutions using LLMs and agentic workflows."
    },
    {
        "id": "custom-software",
        "title": "Custom Software Engineering",
        "badge": "🏗️ Core Engineering",
        "headline": "Build products, not<br>technical <span class='gradient-word'>debt.</span>",
        "subtext": "Full-cycle product engineering. We architect and build premium software solutions designed for growth, avoiding bloated teams and unnecessary overhead.",
        "meta": "Full-cycle custom software engineering and product development."
    },
    {
        "id": "mobile-apps",
        "title": "Mobile App Development",
        "badge": "📱 Core Engineering",
        "headline": "Native performance.<br>Cross-platform <span class='gradient-word'>speed.</span>",
        "subtext": "High-performance iOS and Android applications built with Flutter, React Native, or Swift. Beautiful UI combined with rock-solid backends.",
        "meta": "Mobile app development services for iOS and Android using Flutter."
    },
    {
        "id": "cybersecurity",
        "title": "Cybersecurity Solutions",
        "badge": "🔒 Core Engineering",
        "headline": "Zero trust.<br>Total <span class='gradient-word'>protection.</span>",
        "subtext": "SOC2 and GDPR compliant architectures. We secure your infrastructure, audit codebases, and implement enterprise-grade security protocols.",
        "meta": "Enterprise cybersecurity, SOC2 compliance, and zero-trust architectures."
    },
    {
        "id": "data-analytics",
        "title": "Data & Analytics",
        "badge": "📊 Data & Intelligence",
        "headline": "Turn data into<br>actionable <span class='gradient-word'>insight.</span>",
        "subtext": "Data pipelines, real-time dashboards, and Business Intelligence setups that help you make informed decisions instantly.",
        "meta": "Data analytics, ETL pipelines, and BI dashboard solutions."
    },
    {
        "id": "ai-agents",
        "title": "AI Agents",
        "badge": "🧠 Data & Intelligence",
        "headline": "Autonomous teams.<br>Infinite <span class='gradient-word'>scale.</span>",
        "subtext": "LangChain and custom conversational agents that act autonomously, process data, and serve your customers 24/7.",
        "meta": "Custom AI Agents built with LangChain for autonomous operations."
    },
    {
        "id": "enterprise-platforms",
        "title": "Enterprise Platforms",
        "badge": "⚙️ Data & Intelligence",
        "headline": "Complex workflows.<br>Unified <span class='gradient-word'>systems.</span>",
        "subtext": "Custom CRM, ERP, and HRMS solutions tailored exactly to your operational needs without the SaaS subscription bloat.",
        "meta": "Custom enterprise platforms, CRM, ERP, and HRMS development."
    },
    {
        "id": "web-development",
        "title": "Web Development",
        "badge": "💻 Data & Intelligence",
        "headline": "Blazing fast.<br>Highly <span class='gradient-word'>scalable.</span>",
        "subtext": "React, Next.js, and full-stack web platforms built for speed, SEO, and flawless user experiences.",
        "meta": "Full-stack web development with React and Next.js."
    },
    {
        "id": "lead-gen-scraping",
        "title": "Lead Gen & Scraping",
        "badge": "🕷️ Data & Intelligence",
        "headline": "Automated growth.<br>Targeted <span class='gradient-word'>leads.</span>",
        "subtext": "Automated data extraction and CRM population systems that fill your sales pipeline with high-quality prospects.",
        "meta": "Automated lead generation and data scraping services."
    },
    {
        "id": "ui-ux-design",
        "title": "UI/UX Design",
        "badge": "🎨 Creative & Growth",
        "headline": "Experiences that<br>drive <span class='gradient-word'>conversion.</span>",
        "subtext": "Figma prototypes, branding, and user-centric interfaces designed to look premium and perform flawlessly.",
        "meta": "Premium UI/UX design, Figma prototyping, and branding services."
    },
    {
        "id": "digital-marketing",
        "title": "Digital Marketing",
        "badge": "📈 Creative & Growth",
        "headline": "Data-driven ROI.<br>Predictable <span class='gradient-word'>revenue.</span>",
        "subtext": "SEO, PPC, and social media campaigns engineered for measurable returns. We turn traffic into actual business.",
        "meta": "Digital marketing, SEO, and PPC services for scalable growth."
    },
    {
        "id": "motion-video",
        "title": "Motion & Video",
        "badge": "🎬 Creative & Growth",
        "headline": "Explainers that<br>actually <span class='gradient-word'>explain.</span>",
        "subtext": "High-quality animations and video content that break down complex products into digestible, engaging stories.",
        "meta": "Motion graphics and explainer video production."
    },
    {
        "id": "ai-voice-agents",
        "title": "AI Voice Agents",
        "badge": "🎙️ Creative & Growth",
        "headline": "Conversational AI.<br>Human <span class='gradient-word'>voice.</span>",
        "subtext": "Inbound and outbound voice AI systems that sound natural, qualify leads, and handle customer support.",
        "meta": "AI voice agents for inbound and outbound customer calls."
    },
    {
        "id": "workflow-automation",
        "title": "Workflow Automation",
        "badge": "⚡ Creative & Growth",
        "headline": "Connect everything.<br>Automate <span class='gradient-word'>anything.</span>",
        "subtext": "n8n, Zapier, and Make integrations that tie your software stack together to eliminate manual data entry forever.",
        "meta": "Workflow automation services using n8n, Zapier, and Make."
    }
]

with open('solutions.html', 'r') as f:
    template = f.read()

# Strip inline styles globally to keep pages clean
template = re.sub(r' style="[^"]*"', '', template)

# Replace the old cf-hero-wrapper with a placeholder for the new msme-hero
old_hero_regex = r'<section class="cf-hero-wrapper"[\s\S]*?</section>'
template = re.sub(old_hero_regex, '<!-- HERO_PLACEHOLDER -->', template)

for sol in solutions:
    content = template
    
    # Update title and meta
    content = re.sub(r'<title>.*?</title>', f'<title>{sol["title"]} | TRAI Inc</title>', content)
    content = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{sol["title"]} | TRAI Inc">', content)
    content = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{sol["meta"]}">', content)
    
    # Construct the msme-hero replacement
    hero_html = f"""
    <!-- ════════ HERO ════════ -->
    <section class="msme-hero">
        <div class="msme-hero-inner">
            <div>
                <div class="msme-badge">{sol["badge"]}</div>
                <h1>{sol["headline"]}</h1>
                <p class="msme-hero-sub">{sol["subtext"]}</p>
                <div class="hero-cta-row">
                    <a href="contact.html" class="btn-primary large">📅 Discuss Your Project</a>
                </div>
            </div>
            <div class="hero-mockup">
                <div class="mockup-main">
                    <div class="mockup-bar"><span></span><span></span><span></span></div>
                    <div class="mockup-metrics">
                        <div class="mockup-metric">
                            <div class="mockup-metric-label">⚡ Deployment Speed</div>
                            <div class="mockup-metric-value green">2x Faster</div>
                        </div>
                        <div class="mockup-metric">
                            <div class="mockup-metric-label">🛡️ Reliability</div>
                            <div class="mockup-metric-value">99.9%</div>
                        </div>
                    </div>
                </div>
                <div class="float-card float-card-1">
                    <div class="fc-icon">🚀</div>
                    <div class="fc-label">Project Status</div>
                    <div class="fc-value fc-value-active">Deploying</div>
                </div>
            </div>
        </div>
    </section>
    """
    
    # Replace placeholder
    content = content.replace('<!-- HERO_PLACEHOLDER -->', hero_html)
    
    # Fix the generic "Explore all Solutions ->" in nav if we want, but nav is handled by nav.js
    
    # Write file
    with open(f'{sol["id"]}.html', 'w') as f:
        f.write(content)

print(f"Generated {len(solutions)} solution pages.")
