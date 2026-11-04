const fs = require('fs');
const filePath = 'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\admin\\vinted\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const idx = content.indexOf('Click "Refresh');
console.log('Index:', idx);
if (idx >= 0) {
  console.log(content.substring(idx, idx + 60));
}