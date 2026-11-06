const fs = require('fs');
const content = fs.readFileSync('C:\\Users\\daniel\\Documents\\Default Project\\figura-reserva\\src\\app\\(site\\)\\[locale\\]\\page.tsx', 'utf8');

// Check if React is imported
console.log('Has React import:', content.includes('import React') || content.includes('from "react"'));

// Check for React namespace
console.log('Has React.Fragment:', content.includes('React.Fragment') || content.includes('<>'));

// Check for JSX pragma
console.log('Has JSX pragma:', content.includes('@jsx'));