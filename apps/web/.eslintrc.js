/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "next/no-server-export": "off",
  },
  overrides: [
    {
      files: ["src/utils/sendEmail.tsx"],
      rules: {
        // Add any rules you want to override or disable for this file
        // Example: "no-unused-vars": "off"
      },
    },
  ],
};
