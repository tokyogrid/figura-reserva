const fs = require('fs');
const apos = String.fromCharCode(38, 97, 112, 111, 115, 59); // '

function fixFile(filePath, replacements) {
  const content = fs.readFileSync(filePath, 'utf8');
  let fixed = content;
  for (const [search, replace] of replacements) {
    if (!fixed.includes(search)) {
      console.log(`WARNING: "${search}" not found in ${filePath}`);
    }
    fixed = fixed.replace(search, replace);
  }
  fs.writeFileSync(filePath, fixed);
  console.log(`Fixed: ${filePath}`);
}

// Fix checkout/page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\checkout\\page.tsx',
  [
    ["Choose how you'd like to receive your figure", 'Choose how you' + apos + 'd like to receive your figure'],
    ["We'll ship your figures safely to this address", 'We' + apos + 'll ship your figures safely to this address'],
    ["Auto-refund if we can't get it", 'Auto-refund if we can' + apos + 't get it'],
  ]
);

// Fix contact/page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\contact\\page.tsx',
  [
    ["Forgot your password? Need help with your account? Fill out the form below and we'll get back to you via email.", 'Forgot your password? Need help with your account? Fill out the form below and we' + apos + 'll get back to you via email.'],
  ]
);

// Fix how-it-works/HowItWorksContent.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\how-it-works\\HowItWorksContent.tsx',
  [
    ["Browse the catalog or request it if you can't find it. No commitment, no risk.", 'Browse the catalog or request it if you can' + apos + 't find it. No commitment, no risk.'],
  ]
);

// Fix order/[id]/OrderTrackingContent.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\order\\[id]\\OrderTrackingContent.tsx',
  [
    ["Your package is on the way. You'll receive the tracking number by email.", 'Your package is on the way. You' + apos + 'll receive the tracking number by email.'],
  ]
);

// Fix page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\page.tsx',
  [
    ["Request it and we'll search our Japan suppliers. If found, you get priority to reserve.", 'Request it and we' + apos + 'll search our Japan suppliers. If found, you get priority to reserve.'],
  ]
);

// Fix request/page.tsx
fixFile(
  'C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\request\\page.tsx',
  [
    ["Request it and we'll search our Japan suppliers. If found, you get priority to reserve.", 'Request it and we' + apos + 'll search our Japan suppliers. If found, you get priority to reserve.'],
  ]
);

console.log('All fixes applied!');