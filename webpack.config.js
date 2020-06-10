const path = require('path');

module.exports = {
	target: "web",
	entry: {
		app: ["./src/qr.js"]
	},
	output: {
		path: path.resolve(__dirname, "./build"),
		filename: "bundle-browser.js",
	},
	resolve: {
		alias: {
			'./canvas-node': path.resolve(__dirname, 'src/canvas-browser.js')
		}
	}
}
