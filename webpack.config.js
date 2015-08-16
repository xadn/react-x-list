module.exports = {
  entry: {
    demo: './demo/index.js'
  },
  output: {
    path: __dirname,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'babel'}
    ]
  }
};

// module.exports = {
//   entry: {
//     app: ["./app/main.js"]
//   },
//   output: {
//     path: "./build",
//     publicPath: "/assets/",
//     filename: "bundle.js"
//   }
// };