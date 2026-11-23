with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Find the exact JSX text with unescaped quotes
idx = content.find(b'No se encontrados figuras para "{appliedSeries}"')
if idx >= 0:
    print('Found at:', idx)
    print(content[idx:idx+80])
else:
    print('Not found - checking with different encoding')
    # Try with the actual bytes
    idx2 = content.find(b'appliedSeries}')
    if idx2 >= 0:
        print('Found appliedSeries at:', idx2)
        print(content[idx2-50:idx2+50])