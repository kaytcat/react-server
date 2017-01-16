
var manifest = undefined;
function unwrapEs6Module(module) { return module.__esModule ? module.default : module }
var coreJsMiddleware = require('/Users/karlhorky/projects/kaytcat-react-server/packages/react-server-cli/node_modules/react-server-core-middleware/index.js').coreJsMiddleware;
var coreCssMiddleware = require('/Users/karlhorky/projects/kaytcat-react-server/packages/react-server-cli/node_modules/react-server-core-middleware/index.js').coreCssMiddleware;
module.exports = {
	middleware:[
		coreJsMiddleware(null, manifest),
		coreCssMiddleware(null, manifest),
		
	],
	routes:{
	}
};