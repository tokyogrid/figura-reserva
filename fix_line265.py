with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Exact bytes: Búsqueda: "{search}"\r\n
# The quotes are at positions 10 and 18 (0x22)
old = b'\xc3\xbasqueda: "{search}"\r\n'
new = b'\xc3\xbasqueda: "{search}"\r\n'
content = content.replace(old, new)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')