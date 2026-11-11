const fs = require('fs');
const content = fs.readFileSync('src/app/admin/vinted/page.tsx', 'utf8');
const fixed = content.replace(/Haz clic en "Actualizar datos"/g, 'Haz clic en "Actualizar datos"');
fs.writeFileSync('src/app/admin/vinted/page.tsx', fixed);
console.log('Done');