with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Fix unescaped quotes in JSX text content - replace " with "
# No se encontraron figuras para "{appliedSeries}"
old = b'No se encontrados figuras para "{appliedSeries}"'
new = b'No se encontrados figuras para "{appliedSeries}"'
content = content.replace(old, new)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')