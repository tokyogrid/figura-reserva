with open('src/app/catalog/CatalogContent.tsx', 'rb') as f:
    content = bytearray(f.read())

# Find "Búsqueda: "{search}"\r\n"
# The quotes are at specific positions
idx = content.find(b'\xc3\xbasqueda')
if idx >= 0:
    # Position 10 and 18 from the start of "Búsqueda" are the quotes (0x22)
    # Replace them with the HTML entity bytes
    # " = 0x22 -> " = 0x26 0x71 0x75 0x6f 0x74 0x3b
    # We need to replace byte at idx+10 and idx+18
    
    # First quote at idx+10
    content[idx+10:idx+11] = b'"'
    # Second quote was at idx+18, but after first replacement it shifts
    # Original second quote was at idx+18, after first replacement (6 bytes instead of 1) it's at idx+23
    content[idx+23:idx+24] = b'"'
    
    print(f'Replaced at idx {idx}')
else:
    print('Not found')

with open('src/app/catalog/CatalogContent.tsx', 'wb') as f:
    f.write(content)

print('Done')