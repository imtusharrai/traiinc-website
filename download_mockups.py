import urllib.request
import os

print("Downloading Figma placeholder...")
# Unsplash image for UI/UX design (Figma/Design)
figma_url = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop"
urllib.request.urlretrieve(figma_url, "assets/ui-mockups/mobile_ui_ux_figma.jpg")

print("Downloading Finance placeholder...")
# Unsplash image for finance/mobile app
finance_url = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"
urllib.request.urlretrieve(finance_url, "assets/ui-mockups/mobile_native_fintech_inr.jpg")

print("Done!")
