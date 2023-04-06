// Core Node modules
import path from "path";
import { fileURLToPath } from "url";

// Webpack Plugins
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

// Workaround for using `__dirname` inside an ESM
// Source: https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildOutDirectory = path.join(__dirname, "build");
const isDevelopment = process.env.NODE_ENV !== "production";
const browserTargets = "> 0.25%, not dead";

// Use ESM import/export syntax for webpack.config.js
// Source: https://stackoverflow.com/questions/72318969/how-to-export-the-configuration-of-webpack-config-js-using-pure-esm
export default {
  mode: isDevelopment ? "development" : "production",
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
                  targets: browserTargets,
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

      {
        test: /\.css$/,
        use: [
          // It's recommended to use `style-loader` for development
          // since it's quicker.
          // Source: https://webpack.js.org/plugins/mini-css-extract-plugin/#recommended
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              // Source: https://webpack.js.org/loaders/css-loader/#importloaders
              importLoaders: 1,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      // Source: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#features
                      features: {
                        // Native CSS Nesting is still in Stage 1
                        // as of April 01, 2023; enable to transpile
                        // into universally supported syntax.
                        // Source: https://cssdb.org/#nesting-rules
                        // Note: this uses the `postcss-nesting`
                        // plugin.
                        "nesting-rules": true,
                      },
                    },
                  ],
                  "postcss-advanced-variables",
                ],
              },
            },
          },
        ],
      },
    ],
  },

  optimization: {
    // [Webpack 5] The "..." syntax extends OOTB
    // included minimizers (e.g. `terser-webpack-plugin`)
    minimizer: ["...", new CssMinimizerPlugin()],
  },

  plugins: [
    new HtmlWebpackPlugin({
      // Pass in your own `index.html` where
      // webpack will automatically inject the
      // bundled assets into.
      template: "index.html",
    }),
    !isDevelopment && new MiniCssExtractPlugin(),
  ].filter(Boolean),

  resolve: {
    extensions: [".tsx", ".jsx", ".ts", ".js"],
  },

  output: {
    filename: "main.bundle.js",
    path: buildOutDirectory,
  },

  devServer: {
    static: buildOutDirectory,
    client: {
      overlay: {
        errors: true,
        // Don't show full-screen overlay in browser
        // when there are compiler warnings.
        warnings: false,
      },
    },
    hot: true,
    compress: true,
    port: 8080,
  },
};
