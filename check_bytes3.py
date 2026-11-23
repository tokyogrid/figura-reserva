with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

idx = content.find(b'encontrados')
if idx >= 0:
    print('Found at:', idx)
    for i, b in enumerate(content[idx-20:idx+60]):
        ch = chr(b) if 32 <= b < 127 else '?'
        print(f'{i}: {b:02x} {ch}')