const fs = require('fs');
const filePath = 'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\admin\\vinted\\page.tsx';
const content = fs.readFileSync(filePath, 'utf8');

console.log('Original length:', content.length);

// Build the HTML entity string programmatically
const quot = String.fromCharCode(38, 113, 117, 111, 116, 59); // "

const search1 = 'Click "Refresh Data" to sync orders from Vinted';
const search2 = 'Click "Refresh Data" to sync reviews from Vinted';
const search3 = 'Click "Refresh Data" to sync listings from Vinted';
const search4 = '"N/A"';

console.log('Search1 found:', content.includes(search1));
console.log('Search2 found:', content.includes(search2));
console.log('Search3 found:', content.includes(search3));
console.log('Search4 found:', content.includes(search4));

let fixed = content;
fixed = fixed.replace(search1, 'Click ' + quot + 'Refresh Data' + quot + ' to sync orders from Vinted');
console.log('After replace 1:', fixed.length);
fixed = fixed.replace(search2, 'Click ' + quot + 'Refresh Data' + quot + ' to sync reviews from Vinted');
console.log('After replace 2:', fixed.length);
fixed = fixed.replace(search3, 'Click ' + quot + 'Refresh Data' + quot + ' to sync listings from Vinted');
console.log('After replace 3:', fixed.length);
fixed = fixed.replace(search4, quot + 'N/A' + quot);
console.log('After replace 4:', fixed.length);

fs.writeFileSync(filePath, fixed);
console.log('Done');