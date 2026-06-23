import re

solutions_data = [
    {
        "id": "cloud-devops",
        "title": "Cloud & DevOps Solutions",
        "badge": "☁️ Core Engineering",
        "headline": "Scalable Infrastructure.<br>Zero <span class='gradient-word'>Downtime.</span>",
        "subtext": "AWS, Azure, and GCP migrations. We build resilient, auto-scaling cloud architectures and CI/CD pipelines that let your team ship code faster.",
        "meta": "Cloud & DevOps services for AWS, Azure, GCP migrations and CI/CD automation.",
        "bento_heading": "Infrastructure Expertise",
        "bento_sub": "CLOUD & PLATFORM",
        "bento_items": [
            {"icon": "☁️", "title": "Cloud Migrations", "desc": "Seamless lift-and-shift or refactoring to AWS, Azure, or GCP. We handle the complexity so you experience zero downtime.", "color": "#00f2fe"},
            {"icon": "⚡", "title": "CI/CD Pipelines", "desc": "Automate your testing and deployment. We set up GitHub Actions, GitLab CI, and Jenkins to ensure reliable and rapid releases.", "color": "#4facfe"},
            {"icon": "🛡️", "title": "Infrastructure as Code", "desc": "Manage your entire stack with Terraform and Ansible. Version-controlled, reproducible, and secure cloud environments.", "color": "#38f9d7"}
        ],
        "methodology": [
            {"title": "Infrastructure Audit", "desc": "We analyze your current stack, identify bottlenecks, and map out a highly available architecture."},
            {"title": "Automated Provisioning", "desc": "We write Terraform scripts to build your new environment, ensuring it's secure, scalable, and reproducible."},
            {"title": "Migration & CI/CD", "desc": "We migrate your workloads, set up automated deployment pipelines, and hand over the keys to your team."}
        ]
    },
    {
        "id": "ai-automation",
        "title": "AI & Automation",
        "badge": "🤖 Core Engineering",
        "headline": "Smarter operations.<br>Automated <span class='gradient-word'>growth.</span>",
        "subtext": "Leverage LLMs, custom agents, and intelligent workflows to automate redundant tasks and scale your business without scaling your headcount.",
        "meta": "Custom AI & Automation solutions using LLMs and agentic workflows.",
        "bento_heading": "AI Capabilities",
        "bento_sub": "INTELLIGENCE",
        "bento_items": [
            {"icon": "🧠", "title": "Custom LLM Integration", "desc": "Connect GPT-4 or Claude to your proprietary data. We build secure RAG (Retrieval-Augmented Generation) systems.", "color": "#f093fb"},
            {"icon": "⚙️", "title": "Process Automation", "desc": "Automate data entry, customer support, and document parsing using AI-driven workflows.", "color": "#f5576c"},
            {"icon": "🤖", "title": "Autonomous Agents", "desc": "Deploy specialized AI agents that can research, email, and make decisions 24/7 without human intervention.", "color": "#fa709a"}
        ],
        "methodology": [
            {"title": "Process Mapping", "desc": "We identify repetitive tasks and data silos in your operations that are ripe for AI disruption."},
            {"title": "Model Selection & RAG", "desc": "We select the right LLMs and connect them securely to your company knowledge base."},
            {"title": "Deployment & Training", "desc": "We deploy the AI tools to your team and train them on how to leverage their new digital workforce."}
        ]
    },
    {
        "id": "custom-software",
        "title": "Custom Software Engineering",
        "badge": "🏗️ Core Engineering",
        "headline": "Build products, not<br>technical <span class='gradient-word'>debt.</span>",
        "subtext": "Full-cycle product engineering. We architect and build premium software solutions designed for growth, avoiding bloated teams and unnecessary overhead.",
        "meta": "Full-cycle custom software engineering and product development.",
        "bento_heading": "Engineering Excellence",
        "bento_sub": "DEVELOPMENT",
        "bento_items": [
            {"icon": "🌐", "title": "Scalable Architectures", "desc": "We build microservices and serverless architectures designed to handle millions of users.", "color": "#00f2fe"},
            {"icon": "🛡️", "title": "Enterprise Security", "desc": "SOC2-compliant development lifecycle with built-in encryption, role-based access, and vulnerability scanning.", "color": "#4facfe"},
            {"icon": "🚀", "title": "High Performance", "desc": "Blazing fast APIs and optimized databases. We focus on low latency and high throughput for core systems.", "color": "#43e97b"}
        ],
        "methodology": [
            {"title": "Discovery & Scoping", "desc": "We strip away the noise. We analyze your core business problem and propose a lean, high-impact technical architecture."},
            {"title": "Agile Build", "desc": "We build in rapid sprints. You get weekly video updates, staging links, and complete transparency into the codebase."},
            {"title": "Deployment & Handoff", "desc": "We deploy to production, setup analytics, and provide full documentation. You own 100% of the IP."}
        ]
    },
    {
        "id": "mobile-apps",
        "title": "Mobile App Development",
        "badge": "📱 Core Engineering",
        "headline": "Native performance.<br>Cross-platform <span class='gradient-word'>speed.</span>",
        "subtext": "High-performance iOS and Android applications built with Flutter, React Native, or Swift. Beautiful UI combined with rock-solid backends.",
        "meta": "Mobile app development services for iOS and Android using Flutter.",
        "bento_heading": "Mobile Expertise",
        "bento_sub": "APP DEVELOPMENT",
        "bento_items": [
            {"icon": "📱", "title": "Cross-Platform", "desc": "Flutter and React Native development for deploying to both iOS and Android from a single codebase.", "color": "#38f9d7"},
            {"icon": "🍎", "title": "Native iOS & Android", "desc": "Swift and Kotlin development for applications requiring deep OS integration and maximum performance.", "color": "#43e97b"},
            {"icon": "🎨", "title": "Premium UI/UX", "desc": "Fluid animations, gesture controls, and pixel-perfect interfaces that feel native to the device.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Prototyping & UX", "desc": "We design high-fidelity Figma prototypes and map out the entire user journey before writing a line of code."},
            {"title": "Sprint Development", "desc": "We build the app features incrementally, providing TestFlight and APK builds weekly for your review."},
            {"title": "App Store Launch", "desc": "We handle the rigorous Apple App Store and Google Play Store review processes for a smooth launch."}
        ]
    },
    {
        "id": "cybersecurity",
        "title": "Cybersecurity Solutions",
        "badge": "🔒 Core Engineering",
        "headline": "Zero trust.<br>Total <span class='gradient-word'>protection.</span>",
        "subtext": "SOC2 and GDPR compliant architectures. We secure your infrastructure, audit codebases, and implement enterprise-grade security protocols.",
        "meta": "Enterprise cybersecurity, SOC2 compliance, and zero-trust architectures.",
        "bento_heading": "Security Solutions",
        "bento_sub": "PROTECTION",
        "bento_items": [
            {"icon": "🛡️", "title": "Security Audits", "desc": "Comprehensive penetration testing and vulnerability assessments of your web and mobile applications.", "color": "#a18cd1"},
            {"icon": "📜", "title": "Compliance Prep", "desc": "We architect your systems to be ready for SOC2, HIPAA, or GDPR compliance audits.", "color": "#fbc2eb"},
            {"icon": "🔐", "title": "Zero-Trust Architecture", "desc": "Implementing strict access controls, multi-factor authentication, and end-to-end encryption.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Vulnerability Assessment", "desc": "We scan your infrastructure and codebase to identify critical security flaws and misconfigurations."},
            {"title": "Hardening & Patching", "desc": "We implement zero-trust policies, patch vulnerabilities, and secure your database endpoints."},
            {"title": "Continuous Monitoring", "desc": "We set up automated alerts and SIEM tools to detect and respond to threats in real-time."}
        ]
    },
    {
        "id": "data-analytics",
        "title": "Data & Analytics",
        "badge": "📊 Data & Intelligence",
        "headline": "Turn data into<br>actionable <span class='gradient-word'>insight.</span>",
        "subtext": "Data pipelines, real-time dashboards, and Business Intelligence setups that help you make informed decisions instantly.",
        "meta": "Data analytics, ETL pipelines, and BI dashboard solutions.",
        "bento_heading": "Data Engineering",
        "bento_sub": "INTELLIGENCE",
        "bento_items": [
            {"icon": "🔄", "title": "ETL Pipelines", "desc": "Automated data extraction, transformation, and loading from multiple sources into a centralized data warehouse.", "color": "#fa709a"},
            {"icon": "📈", "title": "BI Dashboards", "desc": "Real-time visualizations using Tableau, PowerBI, or custom React dashboards tailored to your KPIs.", "color": "#fee140"},
            {"icon": "🔮", "title": "Predictive Analytics", "desc": "Machine learning models that forecast sales trends, customer churn, and inventory requirements.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Data Auditing", "desc": "We evaluate your current data sources and identify the key metrics that drive your business."},
            {"title": "Pipeline Construction", "desc": "We build robust ETL pipelines using tools like dbt and Snowflake to unify your data."},
            {"title": "Dashboard Delivery", "desc": "We deliver intuitive, real-time dashboards so your leadership can make data-driven decisions."}
        ]
    },
    {
        "id": "ai-agents",
        "title": "AI Agents",
        "badge": "🧠 Data & Intelligence",
        "headline": "Autonomous teams.<br>Infinite <span class='gradient-word'>scale.</span>",
        "subtext": "LangChain and custom conversational agents that act autonomously, process data, and serve your customers 24/7.",
        "meta": "Custom AI Agents built with LangChain for autonomous operations.",
        "bento_heading": "Agentic AI",
        "bento_sub": "AUTONOMY",
        "bento_items": [
            {"icon": "💬", "title": "Customer Support Agents", "desc": "AI agents that resolve complex customer tickets 24/7, reading your internal documentation to provide accurate answers.", "color": "#d299c2"},
            {"icon": "🕵️", "title": "Research Agents", "desc": "Agents that scrape the web, summarize competitor pricing, and generate weekly market reports autonomously.", "color": "#fef9d7"},
            {"icon": "🛠️", "title": "LangChain & Multi-Agent", "desc": "Complex orchestration where multiple AI agents collaborate to solve multi-step problems.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Workflow Analysis", "desc": "We identify which operational workflows are repetitive and can be entirely delegated to an AI agent."},
            {"title": "Agent Prompt Engineering", "desc": "We build custom tools (APIs) and refine the system prompts so the agent behaves exactly like a human employee."},
            {"title": "Testing & Deployment", "desc": "We run the agent in a sandbox, verify its decision-making, and deploy it to Slack, WhatsApp, or your web app."}
        ]
    },
    {
        "id": "enterprise-platforms",
        "title": "Enterprise Platforms",
        "badge": "⚙️ Data & Intelligence",
        "headline": "Complex workflows.<br>Unified <span class='gradient-word'>systems.</span>",
        "subtext": "Custom CRM, ERP, and HRMS solutions tailored exactly to your operational needs without the SaaS subscription bloat.",
        "meta": "Custom enterprise platforms, CRM, ERP, and HRMS development.",
        "bento_heading": "Enterprise Systems",
        "bento_sub": "PLATFORMS",
        "bento_items": [
            {"icon": "🏢", "title": "Custom ERP/CRM", "desc": "Stop forcing your business into rigid SaaS tools. We build systems that match your exact operational workflows.", "color": "#ffecd2"},
            {"icon": "🔗", "title": "API Integrations", "desc": "Connecting legacy systems with modern cloud infrastructure to eliminate manual data entry and silos.", "color": "#fcb69f"},
            {"icon": "👥", "title": "Role-Based Access", "desc": "Complex organizational hierarchies, permission sets, and audit logs built-in from day one.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Process Mapping", "desc": "We spend time with your stakeholders to map out every single operational workflow and bottleneck."},
            {"title": "Modular Build", "desc": "We develop the platform in modules (e.g., HR, Sales, Inventory) so you can start using it faster."},
            {"title": "Data Migration & Training", "desc": "We migrate your historical data from legacy systems and train your staff on the new platform."}
        ]
    },
    {
        "id": "web-development",
        "title": "Web Development",
        "badge": "💻 Data & Intelligence",
        "headline": "Blazing fast.<br>Highly <span class='gradient-word'>scalable.</span>",
        "subtext": "React, Next.js, and full-stack web platforms built for speed, SEO, and flawless user experiences.",
        "meta": "Full-stack web development with React and Next.js.",
        "bento_heading": "Web Technologies",
        "bento_sub": "FRONTEND & BACKEND",
        "bento_items": [
            {"icon": "⚡", "title": "Next.js & React", "desc": "Server-side rendered web applications that provide instantaneous load times and perfect SEO scores.", "color": "#30cfd0"},
            {"icon": "🖥️", "title": "Node.js & Python", "desc": "Robust backend APIs built with Express, Django, or FastAPI to power your frontend experiences securely.", "color": "#667eea"},
            {"icon": "📱", "title": "Responsive Design", "desc": "Flawless layouts across desktop, tablet, and mobile devices using modern CSS architecture.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Architecture Design", "desc": "We select the optimal tech stack and database schema for your specific web application requirements."},
            {"title": "Component Development", "desc": "We build reusable UI components and integrate them with secure backend APIs in rapid iterations."},
            {"title": "Optimization & Launch", "desc": "We optimize images, minify code, configure CDN caching, and launch the site for maximum performance."}
        ]
    },
    {
        "id": "lead-gen-scraping",
        "title": "Lead Gen & Scraping",
        "badge": "🕷️ Data & Intelligence",
        "headline": "Automated growth.<br>Targeted <span class='gradient-word'>leads.</span>",
        "subtext": "Automated data extraction and CRM population systems that fill your sales pipeline with high-quality prospects.",
        "meta": "Automated lead generation and data scraping services.",
        "bento_heading": "Data Extraction",
        "bento_sub": "GROWTH",
        "bento_items": [
            {"icon": "🕷️", "title": "Custom Web Scrapers", "desc": "Extract competitor pricing, real estate listings, or directory data at scale using headless browsers.", "color": "#96fbc4"},
            {"icon": "🎯", "title": "Lead Enrichment", "desc": "Automatically enrich basic email lists with LinkedIn profiles, company size, and revenue metrics.", "color": "#f9f586"},
            {"icon": "🔄", "title": "CRM Automation", "desc": "Push newly scraped and enriched leads directly into HubSpot or Salesforce without manual entry.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Target Identification", "desc": "We define your ideal customer profile and identify the best data sources and directories to scrape."},
            {"title": "Script Development", "desc": "We write resilient Python scrapers that bypass anti-bot protections and extract structured data."},
            {"title": "Delivery & Automation", "desc": "We provide the data in CSV format or set up a daily cron job that pushes new leads to your CRM."}
        ]
    },
    {
        "id": "ui-ux-design",
        "title": "UI/UX Design",
        "badge": "🎨 Creative & Growth",
        "headline": "Experiences that<br>drive <span class='gradient-word'>conversion.</span>",
        "subtext": "Figma prototypes, branding, and user-centric interfaces designed to look premium and perform flawlessly.",
        "meta": "Premium UI/UX design, Figma prototyping, and branding services.",
        "bento_heading": "Design Services",
        "bento_sub": "CREATIVE",
        "bento_items": [
            {"icon": "🖋️", "title": "Wireframing & Prototyping", "desc": "Interactive Figma prototypes that let you click through the product before engineering begins.", "color": "#f6d365"},
            {"icon": "🎨", "title": "Design Systems", "desc": "Comprehensive component libraries, typography rules, and color palettes for consistent branding.", "color": "#fda085"},
            {"icon": "🖱️", "title": "Conversion Optimization", "desc": "UX audits and redesigns focused specifically on reducing friction and increasing conversion rates.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "User Research", "desc": "We analyze your target audience, competitors, and core user journeys to inform our design strategy."},
            {"title": "Wireframing", "desc": "We create low-fidelity wireframes to nail the layout, hierarchy, and navigation structure first."},
            {"title": "High-Fidelity Design", "desc": "We apply colors, typography, and micro-interactions, delivering a pixel-perfect Figma file ready for dev."}
        ]
    },
    {
        "id": "digital-marketing",
        "title": "Digital Marketing",
        "badge": "📈 Creative & Growth",
        "headline": "Data-driven ROI.<br>Predictable <span class='gradient-word'>revenue.</span>",
        "subtext": "SEO, PPC, and social media campaigns engineered for measurable returns. We turn traffic into actual business.",
        "meta": "Digital marketing, SEO, and PPC services for scalable growth.",
        "bento_heading": "Marketing Channels",
        "bento_sub": "GROWTH",
        "bento_items": [
            {"icon": "🔍", "title": "SEO & Content", "desc": "Technical SEO and high-quality content marketing that compounds traffic over time without ad spend.", "color": "#96fbc4"},
            {"icon": "💰", "title": "Performance Marketing", "desc": "Highly targeted Google Ads and Meta Ads campaigns focused strictly on lowering your Cost Per Acquisition.", "color": "#f9f586"},
            {"icon": "📧", "title": "Email & WhatsApp", "desc": "Automated retention sequences that turn one-time buyers into loyal, repeat customers.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Funnel Audit", "desc": "We audit your current traffic sources, conversion rates, and tracking pixels to find the leaky buckets."},
            {"title": "Campaign Launch", "desc": "We develop ad creatives, write copy, set up A/B tests, and launch targeted campaigns."},
            {"title": "Scale & Optimize", "desc": "We monitor the data daily, killing underperforming ads and scaling the winners to maximize ROAS."}
        ]
    },
    {
        "id": "motion-video",
        "title": "Motion & Video",
        "badge": "🎬 Creative & Growth",
        "headline": "Explainers that<br>actually <span class='gradient-word'>explain.</span>",
        "subtext": "High-quality animations and video content that break down complex products into digestible, engaging stories.",
        "meta": "Motion graphics and explainer video production.",
        "bento_heading": "Video Services",
        "bento_sub": "CREATIVE",
        "bento_items": [
            {"icon": "🎥", "title": "Product Explainers", "desc": "Sleek 2D and 3D animations that explain your complex B2B SaaS product in under 60 seconds.", "color": "#fbc7d4"},
            {"icon": "📱", "title": "Social Short-Form", "desc": "High-retention Reels, TikToks, and Shorts optimized for algorithmic reach and engagement.", "color": "#9796f0"},
            {"icon": "🎬", "title": "Corporate Video", "desc": "Professional brand anthems and testimonial videos that build trust and authority.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Script & Storyboard", "desc": "We write a compelling script and draw a scene-by-scene storyboard to align on the visual direction."},
            {"title": "Voiceover & Animation", "desc": "We record professional voiceovers and animate the graphics with smooth, dynamic motion."},
            {"title": "Sound Design & Delivery", "desc": "We add sound effects and music, delivering the final video optimized for web and social media."}
        ]
    },
    {
        "id": "ai-voice-agents",
        "title": "AI Voice Agents",
        "badge": "🎙️ Creative & Growth",
        "headline": "Conversational AI.<br>Human <span class='gradient-word'>voice.</span>",
        "subtext": "Inbound and outbound voice AI systems that sound natural, qualify leads, and handle customer support.",
        "meta": "AI voice agents for inbound and outbound customer calls.",
        "bento_heading": "Voice Intelligence",
        "bento_sub": "AI CALLING",
        "bento_items": [
            {"icon": "📞", "title": "Inbound Support", "desc": "AI receptionists that answer calls instantly, answer FAQs, and route complex queries to human agents.", "color": "#a1c4fd"},
            {"icon": "🎯", "title": "Outbound Lead Gen", "desc": "AI agents that call your lead lists, qualify prospects based on your script, and book meetings on your calendar.", "color": "#c2e9fb"},
            {"icon": "🗣️", "title": "Natural Synthesis", "desc": "Ultra-realistic voice models with less than 500ms latency, complete with conversational interruptions.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Script Engineering", "desc": "We design the conversational tree, define the agent's persona, and write the qualification logic."},
            {"title": "System Integration", "desc": "We integrate the voice agent with your CRM (HubSpot/Salesforce) and calendar scheduling tools."},
            {"title": "Live Testing", "desc": "We conduct extensive role-play testing to ensure the AI handles objections naturally before going live."}
        ]
    },
    {
        "id": "workflow-automation",
        "title": "Workflow Automation",
        "badge": "⚡ Creative & Growth",
        "headline": "Connect everything.<br>Automate <span class='gradient-word'>anything.</span>",
        "subtext": "n8n, Zapier, and Make integrations that tie your software stack together to eliminate manual data entry forever.",
        "meta": "Workflow automation services using n8n, Zapier, and Make.",
        "bento_heading": "Process Automation",
        "bento_sub": "EFFICIENCY",
        "bento_items": [
            {"icon": "🔗", "title": "API Integrations", "desc": "We connect your CRM, accounting software, and marketing tools so data flows seamlessly between them.", "color": "#fddb92"},
            {"icon": "⚡", "title": "n8n & Zapier", "desc": "We build complex, multi-step automated workflows to replace hours of manual data entry.", "color": "#d1fdff"},
            {"icon": "🤖", "title": "AI Enhancements", "desc": "Add AI steps into your workflows to automatically summarize emails, categorize leads, or draft responses.", "color": "#00f2fe"}
        ],
        "methodology": [
            {"title": "Process Audit", "desc": "We identify repetitive manual tasks like copying data from emails to spreadsheets to your CRM."},
            {"title": "Workflow Architecture", "desc": "We design the automation logic, mapping out triggers, conditions, and actions across your apps."},
            {"title": "Testing & Monitoring", "desc": "We build the automation, test edge cases, and set up error alerts so you know it's always running."}
        ]
    }
]


def generate_pages():
    with open('solutions.html', 'r') as f:
        template = f.read()

    # We will build the page manually to ensure clean HTML without relying on stripping styles that break layout.
    head_match = re.search(r'(<!DOCTYPE html>[\s\S]*?<nav id="navbar"></nav>)', template)
    footer_match = re.search(r'(<!-- GRAND CTA -->[\s\S]*?</html>)', template)
    
    if not head_match or not footer_match:
        print("Template structure not recognized.")
        return
        
    head = head_match.group(1)
    footer = footer_match.group(1)
    
    for sol in solutions_data:
        # Update title and meta in head
        sol_head = head
        sol_head = re.sub(r'<title>.*?</title>', f'<title>{sol["title"]} | TRAI Inc</title>', sol_head)
        sol_head = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{sol["title"]} | TRAI Inc">', sol_head)
        sol_head = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{sol["meta"]}">', sol_head)
        
        # Build HERO
        hero_html = f"""
    <!-- ════════ HERO ════════ -->
    <main>
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
        
        # Build BENTO (Core Expertise)
        bento_cards = ""
        for i, b in enumerate(sol["bento_items"]):
            is_wide = "wide" if i == 0 else ""
            bento_cards += f"""
            <div class="bento-card {is_wide}" style="border-top: 4px solid {b['color']};">
                <div class="bento-icon" style="color: {b['color']}; font-size: 2rem; margin-bottom: 20px;">{b['icon']}</div>
                <h3 class="bento-title">{b['title']}</h3>
                <p class="bento-desc">{b['desc']}</p>
            </div>
            """
            
        bento_html = f"""
    <!-- CORE SOLUTIONS -->
    <section class="bento-section fade-in content-section">
        <div class="section-header center" style="margin-bottom: 50px; text-align: center;">
            <h4 class="mini-title" style="color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; font-size: 0.85rem; margin-bottom: 10px;">{sol["bento_sub"]}</h4>
            <h2 style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800;">{sol["bento_heading"]}</h2>
        </div>
        <div class="bento-grid">
            {bento_cards}
        </div>
    </section>
        """
        
        # Build METHODOLOGY using proper process-grid classes
        method_cards = ""
        for i, m in enumerate(sol["methodology"]):
            num = f"0{i+1}"
            method_cards += f"""
            <div class="process-card">
                <div class="process-number">{num}</div>
                <h3>{m['title']}</h3>
                <p>{m['desc']}</p>
            </div>
            """
            
        methodology_html = f"""
    <!-- DELIVERY PROCESS -->
    <section class="compare-section fade-in content-section">
        <div class="container">
            <div class="section-header center" style="text-align: center; margin-bottom: 50px;">
                <h4 class="mini-title" style="color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; font-size: 0.85rem; margin-bottom: 10px;">THE METHODOLOGY</h4>
                <h2 style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800;">How We Deliver Quality</h2>
            </div>
            <div class="process-grid">
                {method_cards}
            </div>
        </div>
    </section>
    </main>
        """
        
        final_html = sol_head + hero_html + bento_html + methodology_html + footer
        
        with open(f'{sol["id"]}.html', 'w') as f:
            f.write(final_html)
            
    print(f"Regenerated {len(solutions_data)} specific solution pages with unique content and fixed layouts.")

if __name__ == '__main__':
    generate_pages()
