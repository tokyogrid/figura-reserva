with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'rb') as f:
    content = f.read()

# The exact bytes: "gratis >100€)"
old = b'gratis >100\xe2\x82\xac'
new = b'gratis >100\xe2\x82\xac'
content = content.replace(old, new)

with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'wb') as f:
    f.write(content)

print('Done')