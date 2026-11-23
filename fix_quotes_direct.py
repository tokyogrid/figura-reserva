with open('src/app/catalog/CatalogContent.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the problematic lines with escaped quotes
content = content.replace('No se encontraron figuras para "{appliedSeries}"', 'No se encontrados figuras para "{appliedSeries}"')
content = content.replace('Búsqueda: "{search}"', 'Búsqueda: "{search}"')
content = content.replace('No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"', 'No hemos encontrados figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"')

with open('src/app/catalog/CatalogContent.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')