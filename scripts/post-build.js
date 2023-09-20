const fs = require('fs');

const manifest = fs.readFileSync('public/manifest.json', 'utf-8');
const manifestObj = JSON.parse(manifest);

manifestObj['key'] = '$CRX_KEY';
fs.writeFileSync('public/manifest.json', JSON.stringify(manifestObj));
