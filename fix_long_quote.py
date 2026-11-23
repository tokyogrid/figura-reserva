with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Fix the long quote with multiple variables
old = b'No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"'
new = b'No hemos encontrado figuras que coincidan con "{search || category || (inStockOnly ? \'solo en stock\' : \'\')}"'
content = content.replace(old, new)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')