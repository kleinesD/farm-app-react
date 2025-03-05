const path = require('path');

module.exports = {
  entry: './client/src/index.tsx', // Path to your React entry file (now .tsx)
  output: {
    path: path.resolve(__dirname, 'client/dist'), // Output directory for bundled files
    filename: 'bundle.js', // Output bundled JS
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'], // Resolve .ts, .tsx, .js, .json files
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
          },
        },
      },
      {
        test: /\.css$/, // For CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i, // For Sass/SCSS files
        include: path.resolve(__dirname, 'client/src/style'), // Only include files in your style directory
        use: ['style-loader', 'css-loader', 'sass-loader'], // Loaders for Sass files
      },
    ],
  },
  target: 'electron-renderer', // Target Electron's renderer process
  devtool: 'source-map', // Optional: Useful for debugging, you can remove in production
  stats: {
    warnings: false, // Suppress all warnings
  }, // REMOVE AFTER FIXING SASS
};