import os
import glob
import re
from datetime import datetime

# Find all HTML files in the root directory
html_files = glob.glob('*.html')

# Standard GTM Codes
gtm_head = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->"""

gtm_body = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""

# LocalBusiness Schema (only for index and contact)
schema_code = """
    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Trai Inc.",
      "image": "https://traiinc.com/assets/logos/logo.png",
      "url": "https://traiinc.com/",
      "telephone": "",
      "email": "hello@traiinc.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "DLF MyPad",
        "addressLocality": "Lucknow",
        "postalCode": "226010",
        "addressCountry": "IN"
      },
      "founder": {
        "@type": "Person",
        "name": "Tushar Rai"
      }
    }
    </script>
"""

sitemap_urls = []
base_url = "https://traiinc.com"

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    filename = os.path.basename(file)
    url_path = "" if filename == "index.html" else filename
    full_url = f"{base_url}/{url_path}"
    
    # 1. Canonical Tag
    canonical_tag = f'<link rel="canonical" href="{full_url}">'
    if '<link rel="canonical"' in content:
        content = re.sub(r'<link rel="canonical" href="[^"]*">', canonical_tag, content)
    else:
        # insert before </head>
        content = content.replace('</head>', f'    {canonical_tag}\n</head>')
        
    # 2. Tracking Codes (Remove old GA4/Meta placeholders and insert GTM)
    content = re.sub(r'<!-- GA4 Placeholder -->.*?<\/script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<!-- Meta Pixel Placeholder -->.*?<\/noscript>', '', content, flags=re.DOTALL)
    
    # Insert GTM head before </head> if not exists
    if 'Google Tag Manager' not in content:
        content = content.replace('</head>', f'{gtm_head}\n</head>')
        # Insert GTM body after <body>
        content = re.sub(r'(<body[^>]*>)', r'\1\n' + gtm_body, content)
        
    # 3. Schema Markup (only for index.html)
    if filename == 'index.html':
        if 'application/ld+json' not in content:
            content = content.replace('</head>', f'{schema_code}\n</head>')
            
    # Write back
    with open(file, 'w') as f:
        f.write(content)
        
    # Add to sitemap
    priority = "1.0" if filename == "index.html" else "0.8"
    sitemap_urls.append(f"""  <url>
    <loc>{full_url}</loc>
    <lastmod>{datetime.today().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>{priority}</priority>
  </url>""")

# 4. Generate Sitemap.xml
sitemap_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(sitemap_urls)}
</urlset>"""

with open('sitemap.xml', 'w') as f:
    f.write(sitemap_content)

# 5. Generate Robots.txt
robots_content = f"""User-agent: *
Allow: /

Sitemap: {base_url}/sitemap.xml
"""

with open('robots.txt', 'w') as f:
    f.write(robots_content)

print(f"SEO enhancements applied to {len(html_files)} files. Sitemap and Robots.txt generated.")
