import path from "path";
import { fileURLToPath } from "url";

// Workaround for using `__dirname` inside an ESM
// Source: https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use ESM import/export syntax for webpack.config.js
// Source: https://stackoverflow.com/questions/72318969/how-to-export-the-configuration-of-webpack-config-js-using-pure-esm
export default {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "main.bundle.js",
    path: path.resolve(__dirname, "build"),
  },
};
