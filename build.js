var webpack = require('webpack');
var config = require('./webpack.config.js');

var compiler = webpack(config);
compiler.run(function (err, stats) {
	console.log(stats.toJson()); // по завершению, выводим всю статистику
});
