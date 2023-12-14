import type { Config } from "tailwindcss";
const colors = require('./theme');

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
      ptsans: ["PT Sans", "sans-serif"],
      notosans: ["Noto Sans", "sans-serif"],
    },
    extend: {
      colors: colors,
      scale: {
        "-100": "-1",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-bg-patterns")],
  daisyui: {
    themes: [
      {
        "brand-light": colors,
      },
    ],
  },
} satisfies Config;
