/* eslint-env node */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-hooks", "jsx-a11y", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "next/core-web-vitals",
    "prettier"
  ],
  settings: {
    react: { version: "detect" }
  },
  parserOptions: {
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "react/react-in-jsx-scope": "off",
    "import/order": [
      "error",
      { "newlines-between": "always", alphabetize: { order: "asc" } }
    ],
    "@typescript-eslint/no-explicit-any": "error"
  }
};
