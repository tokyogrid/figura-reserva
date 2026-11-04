const fs = require('fs');
const filePath = 'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\admin\\vinted\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');

// Build the HTML entity string programmatically
const quot = String.fromCharCode(38, 113, 117, 111, 116, 59); // "

// Replace the three instances of Click "Refresh Data" in the empty state messages
const fixed = content
  .replace(/Click "Refresh Data" to sync orders from Vinted/g, 'Click ' + quot + 'Refresh Data' + quot + ' to sync orders from Vinted')
  .replace(/Click "Refresh Data" to sync reviews from Vinted/g, 'Click ' + quot + 'Refresh Data' + quot + ' to sync reviews from Vinted')
  .replace(/Click "Refresh Data" to sync listings from Vinted/g, 'Click ' + quot + 'Refresh Data' + quot + ' to sync listings from Vinted')
  .replace(/"N\/A"/g, quot + 'N/A' + quot);

fs.writeFileSync(filePath, fixed);
console.log('Done');