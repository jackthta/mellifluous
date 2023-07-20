// Core Node modules
import path from "path";
import { fileURLToPath } from "url";

// Webpack Plugins
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import ReactRefreshBabelPlugin from "react-refresh/babel";
import DotEnvPlugin from "dotenv-webpack";

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
            // Source: https://github.com/pmmmwh/react-refresh-webpack-plugin#usage
            plugins: [isDevelopment && ReactRefreshBabelPlugin].filter(Boolean),
          },
        },
      },

      {
        test: /\.(css|scss)$/,
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
                      // Source: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env#browsers
                      browsers: browserTargets,
                    },
                  ],
                ],
              },
            },
          },
          "sass-loader",
        ],
      },

      // Use `asset/resource` module type to load
      // background pattern svgs.
      // "emits a separate file and exports the URL"
      // Source: https://webpack.js.org/guides/asset-modules/
      {
        test: /curve-line.*\.svg$/,
        type: "asset/resource",
      },

      // Use `asset/source` module type to load
      // flag svgs (need to inline flag svgs).
      // "exports the source code of the asset"
      // Source: https://webpack.js.org/guides/asset-modules/
      {
        test: /flags\/(\w{2})\.svg$/,
        type: "asset/source",
      },
    ],
  },

  optimization: {
    // [Webpack 5] The "..." syntax extends OOTB
    // included minimizers (e.g. `terser-webpack-plugin`)
    minimizer: ["...", new CssMinimizerPlugin()],
  },

  plugins: [
    new DotEnvPlugin(),

    new HtmlWebpackPlugin({
      // Pass in your own `index.html` where
      // webpack will automatically inject the
      // bundled assets into.
      template: "index.html",
    }),

    !isDevelopment && new MiniCssExtractPlugin(),

    // Source: https://github.com/pmmmwh/react-refresh-webpack-plugin#usage
    isDevelopment &&
      // Explicitly enable react-refresh's error overlay
      // NOTE: "wds" is the default value for `overlay.sockIntegration`,
      //  but wanted to include to make it clear that this is the source
      //  of the error overlay.
      // Source: https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/API.md#sockintegration
      new ReactRefreshPlugin({ overlay: { sockIntegration: "wds" } }),
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
      // Disable webpack-dev-server's default error overlay in favor of
      // react-refresh's
      // Source: https://webpack.js.org/configuration/dev-server/#overlay
      overlay: false,
    },
    hot: true,
    compress: true,
    port: 8080,
  },
};
