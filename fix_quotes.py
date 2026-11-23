with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Find the exact line
idx = content.find('Búsqueda'.encode('utf-8'))
if idx >= 0:
    print(content[idx:idx+60])