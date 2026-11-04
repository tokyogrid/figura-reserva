const fs = require('fs');
const apos = String.fromCharCode(38, 97, 112, 111, 115, 59); // '

function fixFile(filePath, replacements) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fixed = content;
  for (const [search, replace] of replacements) {
    fixed = fixed.replace(search, replace);
  }
  fs.writeFileSync(filePath, fixed);
  console.log(`Fixed: ${filePath}`);
}

// Fix ProductDetailContent.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\catalog\\[slug]\\components\\ProductDetailContent.tsx',
  [
    ["can't get the figure", 'can' + apos + 't get the figure'],
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
    ["Can't Find Your Figure?", 'Can' + apos + 't Find Your Figure?'],
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

console.log('All fixes applied!');