module.exports = {
  env: {
    browser: false,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["standard"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "comma-dangle": ["error", "never"],
    "space-before-function-paren": ["error", "never"],
    semi: ["error", "always"],
  },
}
