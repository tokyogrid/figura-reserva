with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Fix the broken line - there's a stray " on the next line
old = b'\xc3\xbasqueda: "{search}"\r\n "'
new = b'\xc3\xbasqueda: "{search}"\r\n                <button'
content = content.replace(old, new)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')