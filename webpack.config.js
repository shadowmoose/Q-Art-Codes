const path = require('path');

module.exports = {
	target: "web",
	entry: {
		app: ["./src/qr.js"]
	},
	output: {
		path: path.resolve(__dirname, "./bundle"),
		filename: "browser.js",
		library: 'qartCode'
	},
	resolve: {
		alias: {
			'./canvas-node': path.resolve(__dirname, 'src/canvas-browser.js')
		}
	}
}
