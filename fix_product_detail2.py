with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'rb') as f:
    content = f.read()

# Fix > to > in JSX text content
old = b'Env\xc3\xado 4,99\xe2\x82\xac (gratis >100\xe2\x82\xac)'
new = b'Env\xc3\xado 4,99\xe2\x82\xac (gratis >100\xe2\x82\xac)'
content = content.replace(old, new)

with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'wb') as f:
    f.write(content)

print('Done')