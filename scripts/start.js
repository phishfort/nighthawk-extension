// Set the default before CRA constructs its server options. An explicit HOST
// remains available for development through a trusted interface.
process.env.HOST = process.env.HOST || '127.0.0.1';
require('@craco/craco/dist/scripts/start');
