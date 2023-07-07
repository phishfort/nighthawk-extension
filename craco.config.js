module.exports = {
	webpack: {
		configure: (webpackConfig, {env, paths}) => {
			if (process.env.REACT_APP_MANIFEST_VERSION_V2) {
				paths.appPublic = paths.appPath + '/public-v2';
			}
			return {
				...webpackConfig,
				entry: {
					main: [env === 'development' &&
					require.resolve('react-dev-utils/webpackHotDevClient'),paths.appIndexJs].filter(Boolean),
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
