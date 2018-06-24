var paths = require("./paths");
const webpack = require("webpack");

module.exports = {
	target: "node",
	entry: paths.rootDir + "/app/server.ts",
	output: {
		publicPath: "/",
		path: paths.rootDir + "/build",
		filename: "server.js"
	},
	resolve: {
		extensions: [ ".js", ".ts" ]
	},
	module: {
		rules: [
			{
				test: /.js$/,
				loader: "babel-loader",
				exclude: paths.rootDir + "/node_modules/",
				query: Object.assign({ cacheDirectory: true }, paths.babelConfig)
			},
			{
				test: /.ts$/,
				exclude: paths.rootDir + "/node_modules/",
				use: [
					{
						loader: "babel-loader",
						query: Object.assign({ cacheDirectory: true }, paths.babelConfig)
					},
					{
						loader: "awesome-typescript-loader",
						query: {
							configFileName: paths.rootDir + "/configs/tsconfig.json"
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	]
}
