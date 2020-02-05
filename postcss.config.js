/* eslint-disable import/no-extraneous-dependencies, global-require */
const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./src/**/*.html", "./src/**/*.tsx", "./src/**/*.ts"],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require("tailwindcss"),
    ...(process.env.NODE_ENV === "production" ? [purgecss] : []),
  ],
};
