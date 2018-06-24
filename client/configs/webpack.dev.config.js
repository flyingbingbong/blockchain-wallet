var webpack = require("webpack");
var paths = require("./paths");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	mode: "development",
	entry: paths.clientDir + "/src/index.js",
	output: {
		path: "/",
		publicPath: "/",
		filename: "bundle.js"
	},
	resolve: {
		extensions: [ ".js", ".jsx", ".ts", ".tsx" ]
	},
	devServer: {
		contentBase: paths.clientDir + "/public",
		port: 3333,
		historyApiFallback: true
	},
	module: {
		rules: [
			{
				test: /.jsx?$/,
				loader: "babel-loader",
				exclude: paths.rootDir + "/node_modules/",
				query: Object.assign({ cacheDirectory: true }, paths.babelConfig)
			},
			{
				test: /.tsx?$/,
				exclude: paths.rootDir + "/node_modules/",
				use: [
					{
						loader: "babel-loader",
						query: Object.assign({ cacheDirectory: true }, paths.babelConfig)
					},
					{
						loader: "awesome-typescript-loader",
						query: {
							configFileName: paths.clientDir + "/configs/tsconfig.json"
						}
					}
				]
			},
			{
                test: /.css$/,
                exclude: paths.rootDir + "/node_modules/",
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            localIdentName: "[path][name]__[local]__[hash:base64:5]"
                        }
                    }
                ]
            }
		]
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: paths.clientDir + "/public/index.html"
		}),
		new webpack.DefinePlugin({
            "process.env": require("./env.dev")
        })
	]
}
