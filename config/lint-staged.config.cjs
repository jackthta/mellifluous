const Configuration = {
  "**/*": "prettier --write --ignore-unknown",
  "**/*.{js,ts,tsx}": ["npm run eslint", "prettier --write"],
  "**/*.css": ["npm run stylelint", "prettier --write"],
};

module.exports = Configuration;
