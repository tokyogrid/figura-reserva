with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'rb') as f:
    content = f.read()

# The exact bytes: "gratis >100€)" - replace > (0x3e) with > (0x26 0x67 0x74 0x3b)
# Old: 67 72 61 74 69 73 20 3e 31 30 30 e2 82 ac 29
# New: 67 72 61 74 69 73 20 26 67 74 3b 31 30 30 e2 82 ac 29
old = b'gratis >100\xe2\x82\xac'
new = b'gratis >100\xe2\x82\xac'
content = content.replace(old, new)

with open('src/app/catalog/[slug]/components/ProductDetailContent.tsx', 'wb') as f:
    f.write(content)

print('Done')