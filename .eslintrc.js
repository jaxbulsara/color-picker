module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
    node: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
  plugins: ["html", "css"],
};
