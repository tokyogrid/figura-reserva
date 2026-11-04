const fs = require('fs');
const filePath = 'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\admin\\vinted\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');

// Fix the N/A - it should be regular quotes since it's in a JS expression
const fixed = content.replace(/"N\/A"/g, '"N/A"');
fs.writeFileSync(filePath, fixed);
console.log('Done');