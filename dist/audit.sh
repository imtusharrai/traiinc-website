#!/bin/bash
cd /Volumes/MacCard/StudioProjects/trai-inc-website/traiinc-website

echo "=== Internal links ==="
grep -roh 'href="[^"]*\.html"' --include="*.html" --include="*.js" --include="*.json" . \
  | sort -u | sed 's/href="//;s/"//' | while read link; do
  file=$(basename "$link")
  if [ ! -f "$file" ] && [ "$file" != "#" ]; then
    echo "BROKEN: $link"
  fi
done

echo "=== External links (list only) ==="
grep -roh 'href="https://[^"]*"' --include="*.html" --include="*.js" . | sort -u | head -30

echo "=== Image references ==="
grep -roh 'src="[^"]*"' --include="*.html" --include="*.js" --include="*.json" . \
  | sort -u | sed 's/src="//;s/"//' | while read src; do
  if [[ "$src" != http* ]] && [ ! -f "$src" ]; then
    echo "MISSING: $src"
  fi
done

echo "=== Asset files on disk ==="
find assets/ -type f -exec ls -lh {} \; 2>/dev/null

echo "=== Pages missing canonical ==="
for f in *.html; do
  if ! grep -q "canonical" "$f"; then echo "NO CANONICAL: $f"; fi
done

echo "=== Pages missing og:title ==="
for f in *.html; do
  if ! grep -q "og:title" "$f"; then echo "NO OG: $f"; fi
done

echo "=== Pages missing meta description ==="
for f in *.html; do
  if ! grep -q 'name="description"' "$f"; then echo "NO META DESC: $f"; fi
done

echo "=== Sitemap exists? ==="
ls -la sitemap.xml 2>/dev/null || echo "NO SITEMAP"

echo "=== robots.txt exists? ==="
ls -la robots.txt 2>/dev/null || echo "NO ROBOTS.TXT"

echo "=== GA4/GTM IDs ==="
grep -rn "G-XXXXXXXXXX\|GTM-XXXXXXX\|XXXXXXXXX" --include="*.html" --include="*.js" . | head -10

echo "=== Meta Pixel ==="
grep -rn "fbq\|facebook.*pixel" --include="*.html" --include="*.js" . | head -5

echo "=== Form actions ==="
grep -rn "formsubmit\|action=\|form.*submit\|newsletter" --include="*.html" --include="*.js" . | head -10

echo "=== Calendar links ==="
grep -rn "calendar.app.google\|calendly" --include="*.html" --include="*.js" --include="*.json" . | head -10

echo "=== Viewport meta ==="
for f in *.html; do
  if ! grep -q "viewport" "$f"; then echo "NO VIEWPORT: $f"; fi
done

echo "=== Favicon in all pages ==="
for f in *.html; do
  if ! grep -q "favicon" "$f"; then echo "NO FAVICON: $f"; fi
done

echo "=== Large files (>500KB) ==="
find . -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.js" -o -name "*.css" \) \
  ! -path "*/node_modules/*" ! -path "*/dist/*" -size +500k -exec ls -lh {} \;

echo "=== CSS file size ==="
wc -c css/style.css

echo "=== JS file sizes ==="
wc -c js/app.js js/nav.js js/animations.js

echo "=== Total page weight (estimate) ==="
find . -type f \( -name "*.html" -o -name "*.css" -o -name "*.js" -o -name "*.json" \) \
  ! -path "*/node_modules/*" ! -path "*/dist/*" -exec cat {} + | wc -c

echo "=== Pages NOT loading app.js ==="
for f in *.html; do
  if ! grep -q "app.js" "$f"; then echo "NO APP.JS: $f"; fi
done

echo "=== Phone number consistency ==="
grep -rn "7905495478\|tel:\|wa.me" --include="*.js" --include="*.json" . | head -10

echo "=== Copyright year ==="
grep -rn "© 20\|Copyright" --include="*.js" . | head -5

echo "=== Any remaining placeholder IDs ==="
grep -rn "XXXXXXX\|PLACEHOLDER\|YOUR_ID\|REPLACE_ME" --include="*.html" --include="*.js" --include="*.json" . | head -10

echo "=== Custom 404 page ==="
ls -la 404.html 2>/dev/null || echo "NO 404 PAGE"

echo "=== build.js exists ==="
cat build.js 2>/dev/null | head -20 || echo "NO BUILD.JS"

echo "=== dist/ status ==="
ls -la dist/ 2>/dev/null | head -10 || echo "NO DIST FOLDER"
