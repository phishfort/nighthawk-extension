function configureDevServer(config, { paths }) {
	const {
		https,
		onBeforeSetupMiddleware,
		onAfterSetupMiddleware,
		headers,
		...serverConfig
	} = config;

	return {
		...serverConfig,
		allowedHosts: 'auto',
		// CRA's wildcard CORS headers opt out of webpack-dev-server's source
		// protection. Keep the server's own same-origin checks and headers.
		headers: {},
		server: https ? { type: 'https', options: https === true ? {} : https } : 'http',
		setupMiddlewares(middlewares, devServer) {
			if (!devServer) throw new Error('Development server is unavailable');
			const redirectServedPath = require('react-dev-utils/redirectServedPathMiddleware');
			const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
			// Register through the middleware list so webpack-dev-server's Host,
			// Origin and Fetch Metadata guards execute before these endpoints.
			const compilerIndex = middlewares.findIndex(({ name }) => name === 'webpack-dev-middleware');
			if (compilerIndex < 0) throw new Error('Development server middleware order is unsupported');
			middlewares.splice(compilerIndex, 0,
				{ name: 'same-origin-check', middleware: requireSameOrigin },
				{ name: 'cra-source-map', middleware: createSourceMapMiddleware(devServer) }
			);
			middlewares.push(
				{ name: 'cra-served-path', middleware: redirectServedPath(paths.publicUrlOrPath) },
				{ name: 'cra-noop-service-worker', middleware: noopServiceWorkerMiddleware(paths.publicUrlOrPath) }
			);
			return middlewares;
		},
	};
}

function createSourceMapMiddleware(devServer) {
	// CRA's middleware predates webpack-dev-server 5 and reads `_stats`.
	const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')({
		get _stats() { return devServer.stats; },
	});
	return (req, res, next) => {
		if (req.url.startsWith('/__get-internal-source')) {
			const fileName = req.query.fileName;
			const match = typeof fileName === 'string' && fileName.match(/^webpack-internal:\/\/\/(.+)$/);
			const compilation = devServer.stats && devServer.stats.compilation;
			if (!match || !compilation) return next();
			const sourceModule = Array.from(compilation.modules).find(
				(module) => String(compilation.chunkGraph.getModuleId(module)) === match[1]
			);
			if (!sourceModule || !sourceModule.originalSource()) return next();
		}
		return evalSourceMapMiddleware(req, res, next);
	};
}

function requireSameOrigin(req, res, next) {
	if (req.headers.origin) {
		let expectedOrigin;
		let actualOrigin;
		try {
			expectedOrigin = new URL(`${req.socket.encrypted ? 'https' : 'http'}://${req.headers.host}`).origin;
			actualOrigin = new URL(req.headers.origin).origin;
		} catch {
			res.statusCode = 403;
			res.end('Invalid Origin header');
			return;
		}
		if (actualOrigin !== expectedOrigin) {
			res.statusCode = 403;
			res.end('Cross-Origin request blocked');
			return;
		}
	}
	next();
}

module.exports = configureDevServer;
