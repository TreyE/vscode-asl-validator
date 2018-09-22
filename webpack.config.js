const path = require('path');

module.exports = {
	mode: "production",
	entry: "./dist/extension",
	output: {
		path: path.resolve(__dirname, "out"),
		filename: "extension.js",
		library: 'vscode-asl-validator',
    libraryTarget: 'commonjs2'
	},
	resolve: {
		alias: {
      jsonpath : path.resolve(__dirname, "node_modules/jsonpath/jsonpath.js")
		},
		modules: [
			"node_modules"
		]},
		externals: {
		"vscode": {
			"commonjs" : "vscode",
			"commonjs2" : "vscode"
		}
	},
	target: "node"
}