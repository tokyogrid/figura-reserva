with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'rb') as f:
    content = f.read()

idx = content.find(b'gratis ')
if idx >= 0:
    snippet = content[idx:idx+30]
    for i, b in enumerate(snippet):
        ch = chr(b) if 32 <= b < 127 else '?'
        print(f'{i}: {b:02x} {ch}')