with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Fix unescaped quotes in JSX text content - replace " with "
# 1. Búsqueda: "{search}" -> Búsqueda: "{search}"
old = b'Búsqueda: "{search}"'
new = b'Búsqueda: "{search}"'
content = content.replace(old, new)

# 2. No se encontraron figuras para "{appliedSeries}"
old2 = b'No se encontrados figuras para "{appliedSeries}"'
new2 = b'No se encontrados figuras para "{appliedSeries}"'
content = content.replace(old2, new2)

# 3. No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? 'solo en stock' : '')}"
old3 = b'No hemos encontrados figuras que coincidan con "{search || category || (inStockOnly ?'
new3 = b'No hemos encontrados figuras que coincidan con "{search || category || (inStockOnly ?'
content = content.replace(old3, new3)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')