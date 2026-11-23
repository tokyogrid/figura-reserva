with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Fix the specific occurrences
# 1. No se encontraron figuras para "{appliedSeries}"
old = b'No se encontrados figuras para "{appliedSeries}"'
new = b'No se encontrados figuras para "{appliedSeries}"'
content = content.replace(old, new)

# 2. Búsqueda: "{search}"
old2 = b'B\xc3\xbasqueda: "{search}"'
new2 = b'B\xc3\xbasqueda: "{appliedSeries}"'
content = content.replace(old2, new2)

# 3. No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? 'solo en stock' : '')}"
old3 = b'No hemos encontrados figuras que coincidan con "{search || category || (inStockOnly ?'
new3 = b'No hemos encontrados figuras que coincidan con "{appliedSeries}"'
content = content.replace(old3, new3)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')