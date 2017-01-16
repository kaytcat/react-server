
var manifest = {"jsChunksByName":{"common":"common.bundle.js"},"jsChunksById":{"0":"common.bundle.js"},"cssChunksByName":{},"hash":"d8bf2572a3f704ae8f83"};
function unwrapEs6Module(module) { return module.__esModule ? module.default : module }
var coreJsMiddleware = require('/Users/karlhorky/projects/kaytcat-react-server/packages/react-server-cli/node_modules/react-server-core-middleware/index.js').coreJsMiddleware;
var coreCssMiddleware = require('/Users/karlhorky/projects/kaytcat-react-server/packages/react-server-cli/node_modules/react-server-core-middleware/index.js').coreCssMiddleware;
module.exports = {
	middleware:[
		coreJsMiddleware("http://localhost:3001/", manifest),
		coreCssMiddleware("http://localhost:3001/", manifest),
		
	],
	routes:{
	}
};