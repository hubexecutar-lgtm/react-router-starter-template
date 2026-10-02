import tsParser from "@typescript-eslint/parser";
import importsPlugin from "eslint-plugin-import";

export default [
  {
    // Generated output and vendored files
    ignores: ["build/**", ".react-router/**", "test-results/**", "playwright-report/**", "worker-configuration.d.ts"],
  },
  {
    // Apply to all files
    files: ["**/*.{js,mjs,ts,tsx}"],
    ignores: [
      "node_modules/**/*",
      "build/**/*",
      ".react-router/**/*",
      "worker-configuration.d.ts",
      "public/**/*",
      "tools/**/*",
      "test-results/**/*",
      "**/src/components/ui/**",
      "**/components/ui/**",
    ],
    plugins: {
      import: importsPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            ["internal", "parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "next/**",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    // Apply to TypeScript files
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: "module",
      },
    },
  },
];
