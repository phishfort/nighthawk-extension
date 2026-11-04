const path = require('path');
const configureDevServer = require('./scripts/dev-server-config');

module.exports = {
	paths: (paths) => {
		if (process.env.REACT_APP_MANIFEST_VERSION_V2) {
			paths.appPublic = path.join(paths.appPath, 'public-v2');
			paths.appHtml = path.join(paths.appPublic, 'index.html');
		}
		return paths;
	},
	devServer: configureDevServer,
	webpack: {
		configure: (webpackConfig, {paths}) => {
			return {
				...webpackConfig,
				entry: {
					main: paths.appIndexJs,
					content: './src/content/index.tsx',
					event: './src/event/index.ts',
				},
				output: {
					...webpackConfig.output,
					filename: 'static/js/[name].js',
				},
				optimization: {
					...webpackConfig.optimization,
					runtimeChunk: false,
				}
			}
		},
	}
}
