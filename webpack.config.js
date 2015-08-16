module.exports = {
  entry: {
    demo: './demo/Demo.js'
  },
  output: {
    path: __dirname,
    filename: 'demo/build.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel'}
    ]
  }
};
