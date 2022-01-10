const colors = require("./src/data/colors.json");

module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    colors: {
      ...colors,
    },
  },
  plugins: [],
};
