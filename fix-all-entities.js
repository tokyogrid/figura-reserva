const fs = require('fs');

const apos = String.fromCharCode(38, 97, 112, 111, 115, 59); // '
const quot = String.fromCharCode(38, 113, 117, 111, 116, 59); // "

function fixFile(filePath, replacements) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fixed = content;
  for (const [search, replace] of replacements) {
    fixed = fixed.replace(search, replace);
  }
  fs.writeFileSync(filePath, fixed);
  console.log(`Fixed: ${filePath}`);
}

// Fix CatalogContent.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\catalog\\CatalogContent.tsx',
  [
    ['Search: "{search}"', 'Search: ' + quot + '{search}' + quot],
    ['No figures found for "{appliedSeries}"', 'No figures found for ' + quot + '{appliedSeries}' + quot],
    ["We don't have any figures from this series in our catalog yet.", 'We don' + apos + 't have any figures from this series in our catalog yet.'],
    ['We couldn\'t find any figures matching "{search || category || (inStockOnly ? \'in stock only\' : \'\')}".', 'We couldn' + apos + 't find any figures matching ' + quot + '{search || category || (inStockOnly ? \'in stock only\' : \'\')}' + quot + '.'],
  ]
);

// Fix checkout/page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\checkout\\page.tsx',
  [
    ["Don't have an account?", 'Don' + apos + 't have an account?'],
    ["We'll respond within 24-48 hours.", 'We' + apos + 'll respond within 24-48 hours.'],
    ["We'll notify you by email at each step.", 'We' + apos + 'll notify you by email at each step.'],
  ]
);

// Fix checkout/success/CheckoutSuccessContent.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\checkout\\success\\CheckoutSuccessContent.tsx',
  [
    ["We'll notify you by email at each step.", 'We' + apos + 'll notify you by email at each step.'],
  ]
);

// Fix contact/page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\contact\\page.tsx',
  [
    ["We'll respond within 24-48 hours.", 'We' + apos + 'll respond within 24-48 hours.'],
    ["We'll respond within 24-48 hours.", 'We' + apos + 'll respond within 24-48 hours.'],
  ]
);

// Fix how-it-works/HowItWorksContent.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\how-it-works\\HowItWorksContent.tsx',
  [
    ["No commitment, no risk.", 'No commitment, no risk.'], // This one might not have apostrophe
    ["Can't Find Your Figure?", 'Can' + apos + 't Find Your Figure?'],
  ]
);

// Fix login/page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\login\\page.tsx',
  [
    ["Don't have an account?", 'Don' + apos + 't have an account?'],
  ]
);

// Fix order/[id]/OrderTrackingContent.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\order\\[id]\\OrderTrackingContent.tsx',
  [
    ["We'll notify you by email at each step.", 'We' + apos + 'll notify you by email at each step.'],
  ]
);

// Fix page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\page.tsx',
  [
    ["Can't Find Your Figure?", 'Can' + apos + 't Find Your Figure?'],
    ["We'll notify you by email at each step.", 'We' + apos + 'll notify you by email at each step.'],
  ]
);

// Fix request/page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\request\\page.tsx',
  [
    ["Can't Find Your Figure?", 'Can' + apos + 't Find Your Figure?'],
    ["We'll notify you by email at each step.", 'We' + apos + 'll notify you by email at each step.'],
  ]
);

// Fix verify/page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\verify\\page.tsx',
  [
    ["Didn't receive the code?", 'Didn' + apos + 't receive the code?'],
    ["Didn't receive it?", 'Didn' + apos + 't receive it?'],
  ]
);

// Fix RequestDrawer.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\components\\RequestDrawer.tsx',
  [
    ['Haz clic en "Añadir imagen" o arrastra archivos', 'Haz clic en ' + quot + 'Añadir imagen' + quot + ' o arrastra archivos'],
    ['Haz clic en "Añadir imagen" o arrastra archivos', 'Haz clic en ' + quot + 'Añadir imagen' + quot + ' o arrastra archivos'],
  ]
);

console.log('All fixes applied!');