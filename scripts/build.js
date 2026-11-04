const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function build({ env = process.env, run = spawnSync, args = process.argv.slice(2) } = {}) {
	const result = run(process.execPath, [require.resolve('@craco/craco/dist/bin/craco.js'), 'build', ...args], {
		stdio: 'inherit',
		env,
	});
	if (result.error) throw result.error;
	if (result.status !== 0) return result.status || 1;

	// Apply the public key only after a successful compiler run. Neither source
	// manifest is rewritten, including when compilation fails.
	const manifestPath = path.resolve(env.BUILD_PATH || 'build', 'manifest.json');
	const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
	if (manifest.manifest_version === 3 && env.REACT_APP_PUBLIC_KEY !== undefined) {
		if (env.REACT_APP_PUBLIC_KEY) manifest.key = env.REACT_APP_PUBLIC_KEY;
		else delete manifest.key;
		fs.writeFileSync(manifestPath, JSON.stringify(manifest));
	}
	return 0;
}

if (require.main === module) process.exitCode = build();
module.exports = { build };
