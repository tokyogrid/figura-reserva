with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

idx = content.find(b'No se encontrados figuras para')
if idx >= 0:
    for i, b in enumerate(content[idx:idx+60]):
        ch = chr(b) if 32 <= b < 127 else '?'
        print(f'{i}: {b:02x} {ch}')