with open('src/app/catalog/CatalogContent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix unescaped quotes in JSX text content
# Line 265: Búsqueda: "{search}" -> Búsqueda: "{search}"
content = content.replace('Búsqueda: "{search}"', 'Búsqueda: "{search}"')

# Line 342: No se encontraron figuras para "{appliedSeries}" -> No se encontrados figuras para "{appliedSeries}"
content = content.replace('No se encontraron figuras para "{appliedSeries}"', 'No se encontrados figuras para "{appliedSeries}"')

# Line 361: No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? 'solo en stock' : '')}" -> ...
content = content.replace(
    'No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"',
    'No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"'
)

with open('src/app/catalog/CatalogContent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')