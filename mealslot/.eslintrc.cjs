/* eslint-env node */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  ignorePatterns: [
    "next.config.js",
    "postcss.config.js",
    "ws-server/**",
    "**/*.cjs"
  ],
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
  rules: {
    "react/react-in-jsx-scope": "off",
    "import/order": [
      "error",
      { "newlines-between": "always", alphabetize: { order: "asc" } }
    ],
    "@typescript-eslint/no-explicit-any": "error"
  }
  ,
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
        createDefaultProgram: true
      }
    },
    {
      files: ["tests/**", "**/*.test.*", "**/*.spec.*"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/require-await": "off"
      }
    },
    {
      files: ["ws-server/**", "ws-server/**/*", "ws-server/**.*"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-return": "off"
      }
    }
  ]
};
