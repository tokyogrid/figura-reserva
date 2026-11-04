const fs = require('fs');
const filePath = 'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\admin\\vinted\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const fixed = content
  .replace(/Click "Refresh Data"/g, 'Click "Refresh Data"')
  .replace(/"N\/A"/g, '"N/A"');
fs.writeFileSync(filePath, fixed);
console.log('Done');