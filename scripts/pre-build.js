const fs = require('fs');
require('dotenv').config();

const publicKey = process.env.REACT_APP_PUBLIC_KEY;
const manifest = fs.readFileSync('public/manifest.json', 'utf-8');
const manifestObj = JSON.parse(manifest);

manifestObj['key'] = publicKey;
fs.writeFileSync('public/manifest.json', JSON.stringify(manifestObj), 'utf8');
