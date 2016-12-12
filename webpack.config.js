var path = require('path');
var webpack = require('webpack');

var cssIdentifier = '[path][name]---[local]';
var cssLoader = ['style-loader', 'css-loader?localIdentName=' + cssIdentifier];

module.exports = {
  context: path.join(__dirname, 'src'), // исходная директория
  entry: './index', // файл для сборки, если несколько - указываем hash (entry name => filename)
  output: {
    path: path.join(__dirname, 'assets') // выходная директория
  },
  module: {
    loaders: [
      {test: /\.css$/, loader: 'style-loader!css-loader'},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.hbs$/, loader: 'handlebars-loader'},
      {test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }

}
