const fs = require('fs');
const filePath = 'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\admin\\vinted\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const quot = '"';
const fixed = content
  .replace(/Click "Refresh Data"/g, 'Click ' + quot + 'Refresh Data' + quot)
  .replace(/"N\/A"/g, quot + 'N/A' + quot);
fs.writeFileSync(filePath, fixed);
console.log('Done');