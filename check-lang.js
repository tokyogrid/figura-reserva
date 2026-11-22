const https = require('https');
https.get('https://tokyogridstore.com', (res) => { 
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<html[^>]*lang=["']([^"']+)["']/i);
    console.log('html lang:', match ? match[1] : 'NOT FOUND');
  });
}).on('error', console.error);