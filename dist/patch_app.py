import re

with open('js/app.js', 'r') as f:
    content = f.read()

# Replace: <div class="bento-card" style="border-top: 4px solid ${f.color};">
# With: <div class="bento-card" ${f.id ? 'id="' + f.id + '" style="scroll-margin-top: 100px; border-top: 4px solid ' + f.color + ';"' : 'style="border-top: 4px solid ' + f.color + ';"'}>

replacement = """<div class="bento-card" ${f.id ? 'id="' + f.id + '" style="scroll-margin-top: 100px; border-top: 4px solid ' + f.color + ';"' : 'style="border-top: 4px solid ' + f.color + ';"'}>"""

content = content.replace('<div class="bento-card" style="border-top: 4px solid ${f.color};">', replacement)

with open('js/app.js', 'w') as f:
    f.write(content)

