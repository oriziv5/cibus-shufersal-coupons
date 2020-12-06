const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => ({
  mode: argv.mode === 'production' ? 'production' : 'development',

  devtool: argv.mode === 'production' ? false : 'inline-source-map',

  entry: {
    main: './src/main.ts'
  },

  module: {
    rules: [
      // Converts TypeScript code to JavaScript
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },

      // Enables including CSS by doing "import './file.css'" in your TypeScript code
      {
        test: /\.c|s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      }
    ],
  },

  // Webpack tries these extensions for you if you omit the extension like "import './file'"
  resolve: { extensions: ['.ts', '.js'] },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'), // Compile into a folder called "dist"
  },
  plugins: [
    new CopyWebpackPlugin({
        patterns: [
            { from: './src/favicon', to: './' }
        ],
    })
    ]
})