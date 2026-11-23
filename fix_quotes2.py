with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Replace literal " with " in JSX text content
# Búsqueda: "{search}" -> Búsqueda: "{search}"
old = b'B\xc3\xbasqueda: "{search}"'
new = b'B\xc3\xbasqueda: "{search}"'
content = content.replace(old, new)

# No se encontraron figuras para "{appliedSeries}"
old2 = b'No se encontraron figuras para "{appliedSeries}"'
new2 = b'No se encontraron figuras para "{appliedSeries}"'
content = content.replace(old2, new2)

# No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? 'solo en stock' : '')}"
old3 = b'No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ?'
new3 = b'No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ?'
content = content.replace(old3, new3)

# Close quote: solo en stock' : '')}"
old4 = b"solo en stock' : '')\""
new4 = b"solo en stock' : '')\""
content = content.replace(old4, new4)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')