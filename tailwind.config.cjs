/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./index.html",
    "./src/App.vue",
    "./src/pages/**/*.{vue,ts}",
    "./src/components/**/*.{vue,ts}",
    "./src/layout/**/*.{vue,ts}",
  ],
  theme: {
    extend: {
      width: {
        "1200px": "1200px",
        "446px": "446px",
        "586px": "586px",
        "300px" : "300px",
        "320px" : "320px"
      },
      height: {
        "500px": "500px",
        "700px": "700px",
        "69px":"69px"
      },
      colors: {
        primary: colors.blue["600"],
        success: colors.green["600"],
        warning: colors.amber["500"],
        danger: colors.red["500"],
        done: colors.violet["600"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
