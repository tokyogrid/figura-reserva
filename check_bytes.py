with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

idx = content.find(b'\xc3\xbasqueda')
if idx >= 0:
    for i, b in enumerate(content[idx:idx+50]):
        ch = chr(b) if 32 <= b < 127 else '?'
        print(f'{i}: {b:02x} {ch}')