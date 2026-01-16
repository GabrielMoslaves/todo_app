import js from "@eslint/js";
import globals from "globals";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  js.configs.recommended,

  {
    files: ["**/*.{js,mjs,cjs}"],

    plugins: {
      prettier: prettierPlugin,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },

    rules: {
      "no-unused-vars": "error",
      "no-console": "warn",
      "prettier/prettier": "error",
    },
  },
]);
