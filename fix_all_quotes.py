with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Fix all unescaped quotes in JSX text content
# 1. Búsqueda: "{search}" -> Búsqueda: "{search}"
old = b'\xc3\xbasqueda: "{search}"'
new = b'\xc3\xbasqueda: "{search}"'
content = content.replace(old, new)

# 2. No se encontraron figuras para "{appliedSeries}"
old2 = b'No se encontrados figuras para "{appliedSeries}"'
new2 = b'No se encontrados figuras para "{appliedSeries}"'
content = content.replace(old2, new2)

# 3. No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? 'solo en stock' : '')}"
old3 = b'No hemos encontrados figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"'
new3 = b'No se encontrados figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"'
content = content.replace(old3, new3)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')