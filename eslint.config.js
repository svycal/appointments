import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import prettier from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  // Base ESLint recommended config
  js.configs.recommended,

  // Global ignores
  globalIgnores([
    "**/dist/",
    "**/vendor/",
    "**/deps/",
    "**/priv/",
    "**/.elixir_ls",
    "**/_build",
    "components/react/src/routeTree.gen.ts",
    "packages/core/src/schema.d.ts"
  ]),

  // Configuration for all JavaScript/TypeScript files
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      prettier,
    },
    rules: {
      // TypeScript ESLint recommended rules
      ...typescript.configs.recommended.rules,

      // Prettier rules (run Prettier as an ESLint rule)
      "prettier/prettier": "error",

      // Add any custom rules here
      // You can uncomment and customize these as needed:
      // "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      // "@typescript-eslint/explicit-module-boundary-types": "off",
      // "@typescript-eslint/no-explicit-any": "warn",
    },
  },

  // React-specific configuration for components/react
  {
    files: ["components/react/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
      },
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      prettier,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // TypeScript ESLint recommended rules
      ...typescript.configs.recommended.rules,

      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Prettier rules
      "prettier/prettier": "error",

      // React Refresh rules (for HMR)
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },

  perfectionist.configs["recommended-alphabetical"],
  // Prettier config should be last to override other formatting rules
  prettierConfig,
]);
