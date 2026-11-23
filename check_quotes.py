with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = f.read()

# Check for other unescaped quotes
for pattern in [b'"{appliedSeries}"', b'"{search', b'"{category', b'"{series']:
    idx = content.find(pattern)
    if idx >= 0:
        print(f'Found {pattern} at {idx}:')
        print(content[idx:idx+100])
        print('---')