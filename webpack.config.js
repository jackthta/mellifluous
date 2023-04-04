// Core Node modules
import path from "path";
import { fileURLToPath } from "url";

// Workaround for using `__dirname` inside an ESM
// Source: https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use ESM import/export syntax for webpack.config.js
// Source: https://stackoverflow.com/questions/72318969/how-to-export-the-configuration-of-webpack-config-js-using-pure-esm
export default {
  mode: "production",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(tsx|ts|jsx|js)$/,
        exclude: "/node_modules/",
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              // Transpile JavaScript to be compatible with
              // the least qualified target environment; polyfilling
              // missing API functionality with `core-js`.
              [
                "@babel/preset-env",
                {
                  targets: "> 0.25%, not dead",
                  useBuiltIns: "usage",
                  corejs: "3.30.0",
                },
              ],

              // Transpile JSX to JavaScript
              [
                "@babel/preset-react",
                {
                  // Use the new transform so JSX/TSX files
                  // don't have to manually import the React library.
                  // Source: https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
                  runtime: "automatic",
                },
              ],

              // Transpile TypeScript to JavaScript
              "@babel/preset-typescript",
            ],

            // Source: https://webpack.js.org/loaders/babel-loader/#exclude-libraries-that-should-not-be-transpiled
            exclude: [
              // \\ for Windows, / for macOS and Linux
              /node_modules[\\/]core-js/,
              /node_modules[\\/]webpack[\\/]buildin/,
            ],
            // Source: https://stackoverflow.com/a/68352125
            sourceType: "unambiguous",
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".jsx", ".ts", ".js"],
  },
  output: {
    filename: "main.bundle.js",
    path: path.resolve(__dirname, "build"),
  },
};
