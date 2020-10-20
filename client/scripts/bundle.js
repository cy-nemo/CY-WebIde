var path = require("path")
var pkgPath = path.resolve(__dirname, "../package.json")
require("@sap-webide/webide-client-tools")
	.bundling.bundleFeature(pkgPath)
	// bundleFeature is async and returns a promise, in case of an error we want to exit the process with
	// an error code and terminate any future steps
	.catch(e => {
		console.log(e)
		process.exit(1)
	})