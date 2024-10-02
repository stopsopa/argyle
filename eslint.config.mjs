import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // this configuration seems to be ignoring .eslintignore
  // no matter if I have object below or not
  // seems we can ignore only in this object
  { ignores: ["build", "vite/dist", "coverage"] },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {},
    rules: {},
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off", // Allow @ts-ignore in test files
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Ignore variables starting with _
      // for notorious error:
      // 'data' is declared but its value is never read.ts(6133)
      // 'data' is defined but never used.eslint@typescript-eslint/no-unused-vars
      "@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      // Ignore variables starting with _
      // for notorious error:
      // 'data' is declared but its value is never read.ts(6133)
      // 'data' is defined but never used.eslint@typescript-eslint/no-unused-vars
      "no-unused-vars": ["error", { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }],
    },
  },
);
