try {
  const middleware = require('next-intl/middleware');
  console.log('next-intl/middleware exports:', Object.keys(middleware));
} catch (e) {
  console.log('Error loading next-intl/middleware:', e.message);
}

try {
  const nextIntl = require('next-intl');
  console.log('next-intl exports:', Object.keys(nextIntl));
} catch (e) {
  console.log('Error loading next-intl:', e.message);
}