const fs = require('fs');
const content = fs.readFileSync('src/app/admin/vinted/page.tsx', 'utf8');
let fixed = content;

// Fix line 363: replace " with "
fixed = fixed.replace(
  /<p className="text-gray-500 dark:text-gray-400">Haz clic en "Actualizar datos" para sincronizar pedidos de Vinted<\/p>/g,
  '<p className="text-gray-500 dark:text-gray-400">Haz clic en "Actualizar datos" para sincronizar pedidos de Vinted</p>'
);

// Fix line 424: replace " with "
fixed = fixed.replace(
  /<p className="text-gray-500 dark:text-gray-400">Haz clic en "Actualizar datos" para sincronizar reseñas de Vinted<\/p>/g,
  '<p className="text-gray-500 dark:text-gray-400">Haz clic en "Actualizar datos" para sincronizar reseñas de Vinted</p>'
);

// Fix line 470: replace " with "
fixed = fixed.replace(
  /<p className="text-gray-500 dark:text-gray-400">Haz clic en "Actualizar datos" para sincronizar anuncios de Vinted<\/p>/g,
  '<p className="text-gray-500 dark:text-gray-400">Haz clic en "Actualizar datos" para sincronizar anuncios de Vinted</p>'
);

// Fix other unescaped entities
fixed = fixed.replace(/Click "Refresh Data"/g, 'Click "Refresh Data"');
fixed = fixed.replace(/No listings synced/g, 'No listings synced');
fixed = fixed.replace(/View on Vinted/g, 'View on Vinted');

fs.writeFileSync('src/app/admin/vinted/page.tsx', fixed);
console.log('Done');