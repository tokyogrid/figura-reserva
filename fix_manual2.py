with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Find the exact byte sequence: Búsqueda: "{search}"\r\n
# This is: \xc3\xbasqueda: "{search}"\r\n
# 20 bytes total
old = b'\xc3\xbasqueda: "{search}"\r\n'
new = b'\xc3\xbasqueda: "{search}"\r\n'

print(f'Old length: {len(old)}')
print(f'New length: {len(new)}')

content = content.replace(old, new)

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')