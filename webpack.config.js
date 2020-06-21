const webpack = require("webpack");
const path = require("path");
require('dotenv').config();

const src = path.resolve(__dirname, 'html');

module.exports = () => ({
	mode: 'production',
	context: src,
	entry: ["@babel/polyfill", path.resolve(src, 'index.js')],
	output: {
		filename: 'bundle.js',
		path: src
	},
	module: {
	  rules: [
	    {
	      test: /\.m?js$/,
	      exclude: /(node_modules|bower_components)/,
	      use: {
		loader: 'babel-loader',
		options: {
		  presets: ['@babel/preset-env']
		}
	      }
	    }
	  ]
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env.API_BASE_URL": JSON.stringify(process.env.API_BASE_URL)
		})
	]
});
