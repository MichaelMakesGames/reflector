const colors = require("./src/data/colors.json");

module.exports = {
  purge: false,
  theme: {
    colors: {
      ...colors,
      // ...palette,
    },
    extend: {},
  },
  variants: [
    "responsive",
    "group-hover",
    "group-focus",
    "focus-within",
    "first",
    "last",
    "odd",
    "even",
    "hover",
    "focus",
    "active",
    "visited",
    "disabled",
  ],
  plugins: [],
};
