const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || '';
const content = `window.__env = ${JSON.stringify({ API_URL: apiUrl })};`;

const outDir = path.join(__dirname, '..', 'src', 'assets');
const outPath = path.join(outDir, 'env.js');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, content);
console.log(`Generated ${outPath} with API_URL=${apiUrl}`);
