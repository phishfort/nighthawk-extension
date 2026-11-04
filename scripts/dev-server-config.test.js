const assert = require('node:assert/strict');
const { test } = require('node:test');
const configure = require('./dev-server-config');

test('CRA compatibility conversion preserves host protection and removes wildcard CORS', () => {
	const config = configure({
		allowedHosts: 'all', headers: { 'Access-Control-Allow-Origin': '*' }, https: false,
		onBeforeSetupMiddleware() {}, onAfterSetupMiddleware() {}, host: '127.0.0.1',
	}, { paths: {} });
	assert.equal(config.allowedHosts, 'auto');
	assert.deepEqual(config.headers, {});
	assert.equal(config.server, 'http');
	assert.equal(config.host, '127.0.0.1');
	assert.equal('https' in config, false);
	assert.equal('onBeforeSetupMiddleware' in config, false);
	assert.equal('onAfterSetupMiddleware' in config, false);
});

test('CRA HTTPS certificate options survive the v5 conversion', () => {
	const options = { key: 'development-key', cert: 'development-certificate' };
	assert.deepEqual(configure({ https: options }, { paths: {} }).server, { type: 'https', options });
});

test('source middleware stays behind server guards and rejects a hostile Origin', () => {
	const config = configure({}, { paths: { publicUrlOrPath: '/' } });
	const middlewares = config.setupMiddlewares([
		{ name: 'host-header-check' },
		{ name: 'cross-origin-header-check' },
		{ name: 'webpack-dev-middleware' },
	], {});
	assert.deepEqual(middlewares.slice(0, 5).map(({ name }) => name), [
		'host-header-check', 'cross-origin-header-check', 'same-origin-check',
		'cra-source-map', 'webpack-dev-middleware',
	]);
	const guard = middlewares.find(({ name }) => name === 'same-origin-check').middleware;
	let continued = false;
	const req = { headers: { host: '127.0.0.1:3000', origin: 'https://attacker.example' }, socket: {} };
	const res = { end() {} };
	guard(req, res, () => { continued = true; });
	assert.equal(res.statusCode, 403);
	assert.equal(continued, false);
	for (const origin of ['http://127.0.0.1:3000', undefined]) {
		continued = false;
		guard({ ...req, headers: { ...req.headers, origin } }, {}, () => { continued = true; });
		assert.equal(continued, true);
	}
});

test('CRA source maps use webpack-dev-server 5 stats and ignore malformed module names', () => {
	const config = configure({}, { paths: { publicUrlOrPath: '/' } });
	const sourceModule = { originalSource: () => ({ source: () => 'const source = true;', map: () => ({}) }) };
	const devServer = { stats: { compilation: {
		modules: [sourceModule], chunkGraph: { getModuleId: () => './src/index.tsx' },
	} } };
	const middlewares = config.setupMiddlewares([{ name: 'webpack-dev-middleware' }], devServer);
	const source = middlewares.find(({ name }) => name === 'cra-source-map').middleware;
	let result;
	source({ url: '/__get-internal-source', query: { fileName: 'webpack-internal:///./src/index.tsx' } },
		{ end(value) { result = value; } }, () => assert.fail('valid module should return its source'));
	assert.match(result, /^const source = true;/);
	for (const fileName of [undefined, 'malformed', 'webpack-internal:///missing']) {
		let continued = false;
		source({ url: '/__get-internal-source', query: { fileName } }, {}, () => { continued = true; });
		assert.equal(continued, true);
	}
});
