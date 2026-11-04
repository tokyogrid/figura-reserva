const fs = require('fs');
const filePath = 'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\admin\\vinted\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');
// Build the HTML entity string programmatically
const quot = String.fromCharCode(38, 113, 117, 111, 116, 59); // "
const fixed = content
  .replace(/Click "Refresh Data"/g, 'Click ' + quot + 'Refresh Data' + quot)
  .replace(/"N\/A"/g, quot + 'N/A' + quot);
fs.writeFileSync(filePath, fixed);
console.log('Done');