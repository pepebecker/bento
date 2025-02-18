/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  importOrderSeparation: false,
  importOrderSortSpecifiers: true,
  importOrder: [
    "^next(/.*)?$",
    "^react(/.*)?$",
    "^@tabler(/.*)?$",
    "^(?![./]|@/).*",
    "^[./](.*).css$",
    "^@/(.*)$",
    "^[./]",
  ],
  jsxSingleQuote: false,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  tailwindFunctions: ["cn"],
};

export default config;
