const Configuration = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "header-max-length": [0, "never", 0],
  },
  helpUrl:
    "https://kapeli.com/cheat_sheets/Conventional_Commits.docset/Contents/Resources/Documents/index",
};

module.exports = Configuration;
