const fs = require('fs');
const content = fs.readFileSync('src/app/admin/vinted/page.tsx', 'utf8');
let fixed = content;

// Fix line 363 - replace " with "
fixed = fixed.replace(
  'Haz clic en "Actualizar datos" para sincronizar pedidos de Vinted',
  'Haz clic en "Actualizar datos" para sincronizar pedidos de Vinted'
);

// Fix line 424
fixed = fixed.replace(
  'Haz clic en "Actualizar datos" para sincronizar reseñas de Vinted',
  'Haz clic en "Actualizar datos" para sincronizar reseñas de Vinted'
);

// Fix line 470
fixed = fixed.replace(
  'Haz clic en "Actualizar datos" para sincronizar anuncios de Vinted',
  'Haz clic en "Actualizar datos" para sincronizar anuncios de Vinted'
);

fs.writeFileSync('src/app/admin/vinted/page.tsx', fixed);
console.log('Done');