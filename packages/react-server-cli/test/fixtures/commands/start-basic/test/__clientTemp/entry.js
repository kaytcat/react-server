
		if (typeof window !== "undefined") {
			window.__setReactServerBase = function(path) {
				// according to http://webpack.github.io/docs/configuration.html#output-publicpath
				// we should never set __webpack_public_path__ when hot module replacement is on.
				if (!module.hot) {
					__webpack_public_path__ = path;
				}
				window.__reactServerBase = path;
			}
		}
		var reactServer = require("react-server");
		window.rfBootstrap = function() {
			reactServer.logging.setLevel('main',  "debug");
			reactServer.logging.setLevel('time',  "fast");
			reactServer.logging.setLevel('gauge', "ok");
			new reactServer.ClientController({routes: require("./routes_client")}).init();
		}