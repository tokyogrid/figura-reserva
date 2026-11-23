# Fix CatalogContent.tsx
with open('src/app/catalog/CatalogContent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix unescaped quotes in JSX text content
content = content.replace('Búsqueda: "{search}"', 'Búsqueda: "{search}"')
content = content.replace('No se encontraron figuras para "{appliedSeries}"', 'No se encontraron figuras para "{appliedSeries}"')
content = content.replace('No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"', 'No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"')

with open('src/app/catalog/CatalogContent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

# Fix ProductDetailContent.tsx
with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'r', encoding='utf-8') as f:
    content2 = f.read()

content2 = content2.replace('Envío 4,99€ (gratis >100€)', 'Envío 4,99€ (gratis >100€)')

with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'w', encoding='utf-8') as f:
    f.write(content2)

print('Done')