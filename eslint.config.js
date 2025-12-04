import js from "@eslint/js";
import globals from "globals";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
// import perfectionist from "eslint-plugin-perfectionist";

export default defineConfig([
  // Base ESLint recommended config
  js.configs.recommended,

  // Global ignores
  {
    ignores: [
      "dist/**",
      "packages/*/dist/**",
      "playgrounds/*/vendor/**",
      "playgrounds/*/deps/**",
      "playgrounds/*/assets/node_modules/**",
    ],
  },

  // Configuration for all JavaScript/TypeScript files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      // perfectionist,
    },
    rules: {
      // TypeScript ESLint recommended rules
      ...typescript.configs.recommended.rules,

      // Add any custom rules here
      // You can uncomment and customize these as needed:
      // "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      // "@typescript-eslint/explicit-module-boundary-types": "off",
      // "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);
