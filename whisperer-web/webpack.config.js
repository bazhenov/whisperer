const path = require('path');

module.exports = {
	entry: './src/main/js/app.jsx',
	output: {
		path: __dirname,
		filename: './src/main/resources/static/built/bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					cacheDirectory: true,
					presets: ['es2015', 'react']
				}
			}
		]
	}
};