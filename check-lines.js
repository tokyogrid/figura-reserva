const fs = require('fs');
const content = fs.readFileSync('src/app/admin/vinted/page.tsx', 'utf8');
const lines = content.split('\n');

lines.forEach((line, i) => {
  if (i >= 359 && i <= 369) console.log(i+1 + ': ' + line);
  if (i >= 420 && i <= 430) console.log(i+1 + ': ' + line);
  if (i >= 468 && i <= 478) console.log(i+1 + ': ' + line);
});