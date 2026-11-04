const fs = require('fs');
const filePath = 'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\catalog\\[slug]\\components\\ProductDetailContent.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const gt = String.fromCharCode(38, 103, 116, 59); // >
const fixed = content.replace('>100€', gt + '100€');
fs.writeFileSync(filePath, fixed);
console.log('Done');