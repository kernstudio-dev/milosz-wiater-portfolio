import re
import urllib.request
import os

filepath = r'C:\Users\grall\.gemini\antigravity-ide\brain\3a35e69b-8cef-4df8-8648-ff6533ce291d\.system_generated\steps\9\content.md'
with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

scripts = re.findall(r'src="(/_next/static/chunks/[^"]+)"', text)
print("Scripts found:", len(scripts), scripts[:8])

sections = re.findall(r'id="([^"]+-section)"', text)
print("Sections found:", sections)

bubble_targets = re.findall(r'data-bubble-target="true"[^>]*data-section="([^"]+)"', text)
print("Bubble targets:", bubble_targets)

# Also search for GSAP or ScrollTrigger references
print("Has scrollTrigger?", "ScrollTrigger" in text)
print("Has lenis?", "lenis" in text.lower())
