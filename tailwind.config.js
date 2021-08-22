const colors = require("./src/data/colors.json");

module.exports = {
  mode: "jit",
  purge: ["./src/index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    colors: {
      ...colors,
    },
  },
  plugins: [],
};
