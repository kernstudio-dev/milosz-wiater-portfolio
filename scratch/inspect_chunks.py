import urllib.request
import re

filepath = r'C:\Users\grall\.gemini\antigravity-ide\brain\3a35e69b-8cef-4df8-8648-ff6533ce291d\.system_generated\steps\9\content.md'
with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

scripts = re.findall(r'src="(/_next/static/chunks/[^"]+)"', text)
print(f"Total scripts: {len(scripts)}")

headers = {'User-Agent': 'Mozilla/5.0'}
for s in scripts:
    url = 'https://vanlent.dev' + s
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode('utf-8', errors='ignore')
            if 'bubble' in content.lower():
                print(f"Found bubble in: {s} (len: {len(content)})")
                # Find some context around bubble
                matches = [m.start() for m in re.finditer(r'bubble', content, re.IGNORECASE)]
                for m in matches[:5]:
                    snippet = content[max(0, m-80):min(len(content), m+120)]
                    print("  Snippet:", snippet)
                    print("---")
            if 'scroll' in content.lower() and ('pin' in content.lower() or 'target' in content.lower()):
                print(f"Found scroll/pin in: {s}")
    except Exception as e:
        print(f"Err {s}: {e}")
