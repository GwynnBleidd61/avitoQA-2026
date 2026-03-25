import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "no-console": "warn",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "playwright-report/**",
      "test-results/**"
    ],
  },
];