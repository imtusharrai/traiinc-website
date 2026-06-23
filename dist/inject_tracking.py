import os
import glob

tracking_code = """
    <!-- Google Analytics (GA4) Placeholder -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    </script>

    <!-- Meta Pixel Placeholder -->
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', 'XXXXXXXXXXXXXXXX');
      fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=XXXXXXXXXXXXXXXX&ev=PageView&noscript=1"
    /></noscript>
"""

html_files = glob.glob("*.html")

for file in html_files:
    with open(file, 'r') as f:
        content = f.read()
    
    if "<!-- Google Analytics (GA4) Placeholder -->" in content:
        print(f"Skipping {file}, tracking already exists.")
        continue
        
    # Insert right before </head>
    if "</head>" in content:
        new_content = content.replace("</head>", tracking_code + "</head>")
        with open(file, 'w') as f:
            f.write(new_content)
        print(f"Injected tracking into {file}")
    else:
        print(f"Warning: </head> not found in {file}")

print("Done.")
