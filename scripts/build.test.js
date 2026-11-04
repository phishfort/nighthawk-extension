const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { build } = require('./build');

function fixture(t, manifest) {
	const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'nighthawk-build-test-'));
	t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
	const manifestPath = path.join(directory, 'manifest.json');
	fs.writeFileSync(manifestPath, JSON.stringify(manifest));
	return { directory, manifestPath, read: () => JSON.parse(fs.readFileSync(manifestPath, 'utf8')) };
}

test('a successful MV3 build applies the configured public key to its output', (t) => {
	const output = fixture(t, { manifest_version: 3, key: 'original' });
	const env = { BUILD_PATH: output.directory, REACT_APP_PUBLIC_KEY: 'configured-public-key' };
	assert.equal(build({ env, run: () => ({ status: 0 }), args: [] }), 0);
	assert.equal(output.read().key, 'configured-public-key');
});

test('MV2 output and unconfigured MV3 keys remain unchanged', (t) => {
	for (const manifest of [{ manifest_version: 2 }, { manifest_version: 3, key: 'original' }]) {
		const output = fixture(t, manifest);
		const env = { BUILD_PATH: output.directory };
		if (manifest.manifest_version === 2) env.REACT_APP_PUBLIC_KEY = 'mv3-only';
		assert.equal(build({ env, run: () => ({ status: 0 }), args: [] }), 0);
		assert.deepEqual(output.read(), manifest);
	}
});

test('a failed compiler does not apply the configured public key and returns failure', (t) => {
	const manifest = { manifest_version: 3, key: 'original' };
	const output = fixture(t, manifest);
	assert.equal(build({
		env: { BUILD_PATH: output.directory, REACT_APP_PUBLIC_KEY: 'replacement' },
		run: () => ({ status: 2 }), args: [],
	}), 2);
	assert.deepEqual(output.read(), manifest);
});
