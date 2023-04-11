module.exports = {
  env: {
    browser: true,
    es2022: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],

  plugins: ["@typescript-eslint"],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",

    project: true,
    tsconfigRootDir: "../",
  },

  root: true,

  settings: {
    react: {
      version: "detect",
    },
  },
};
