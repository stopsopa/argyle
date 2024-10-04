import js from "@eslint/js";
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";

export default tseslint.config(
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ["build", "vite/dist", "coverage", ".github"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["server/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },

  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["vite/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
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
  {
    files: ["**/*.test.{ts,tsx}"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off", // standard from https://github.com/jest-community/eslint-plugin-jest?tab=readme-ov-file#running-rules-only-on-test-related-files
      "@typescript-eslint/ban-ts-comment": "off", // Allow @ts-ignore in test files
      "jest/no-done-callback": "off",
      "jest/no-conditional-expect": "off",
    },
  },
);
