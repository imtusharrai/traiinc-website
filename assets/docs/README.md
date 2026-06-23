# Trai Inc — Enterprise IT Solutions

> **Live:** [traiinc.com](https://traiinc.com) · Deployed on Cloudflare Pages

## Tech Stack

- **Frontend:** Static HTML, Vanilla CSS, Vanilla JS
- **Hosting:** Cloudflare Pages (global CDN)
- **Forms:** FormSubmit.co (free, no backend)
- **Fonts:** Google Fonts (Outfit + Inter)

## Project Structure

```
trai-inc-services/
│
├── index.html                 ← Homepage
├── about.html                 ← About Us
├── solutions.html             ← Services & Solutions
├── industries.html            ← Industries We Serve
├── clients.html               ← Client Portfolio & Marquee
├── contact.html               ← Contact Us + Booking
├── careers.html               ← Careers
├── incubation.html            ← Startup Incubation
├── partner.html               ← Partner Program
├── blog.html                  ← Blog
├── privacy.html               ← Privacy Policy
├── terms.html                 ← Terms of Service
├── enterprise.html            ← Enterprise Tier
├── smb.html                   ← SMB Tier
├── startups.html              ← Startups Tier
├── micro-business.html        ← Micro Business Tier
├── nonprofit.html             ← Non-Profit Tier
│
├── css/
│   └── style.css              ← Global stylesheet (design tokens, components)
│
├── js/
│   ├── app.js                 ← Core logic: footer, theme, animations, page renderers
│   └── nav.js                 ← Mega-menu navigation
│
├── data/                      ← JSON data (fetched client-side)
│   ├── home.json
│   ├── about.json
│   ├── contact.json
│   ├── solutions.json
│   ├── industries.json
│   ├── clients.json
│   ├── careers.json
│   ├── incubation.json
│   └── partner.json
│
├── assets/
│   ├── logos/                 ← Brand logos
│   └── images/                ← Page images
│
├── scripts/                   ← Build & migration utilities (not deployed)
│
├── .gitignore
├── package.json
└── README.md
```

## Local Development

```bash
npx http-server -p 8080 -c-1
```

Then open [http://localhost:8080](http://localhost:8080)

## Deploy

```bash
npx wrangler pages deploy . --project-name traiinc-website
```

## License

© 2025 Trai, Inc. All Rights Reserved.
