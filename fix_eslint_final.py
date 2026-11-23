# Fix CatalogContent.tsx - read as bytes and replace specific byte sequences
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

# Fix ProductDetailContent.tsx
with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'rb') as f:
    content2 = f.read()

# Fix > to > in JSX text content
old5 = b'Env\xc3\xado 4,99\xe2\x82\xac (gratis >100\xe2\x82\xac)'
new5 = b'Env\xc3\xado 4,99\xe2\x82\xac (gratis >100\xe2\x82\xac)'
content2 = content2.replace(old5, new5)

with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'wb') as f:
    f.write(content2)

print('Done')