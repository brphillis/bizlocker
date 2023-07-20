import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
      ptsans: ["PT Sans", "sans-serif"],
      notosans: ["Noto Sans", "sans-serif"],
    },
    extend: {
      colors: {
        "brand-black": "#232227",
        "brand-white": "#F0F0F0",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      // prettier-ignore
      {
        "brand-light": {
          "primary": "#3B82F6",
          "primary-focus": "#2563EB",
          "primary-content": "#F0F0F0",
          "secondary": "#A78BFA",
          "secondary-content": "#FFFFFF",
          "base-100": "#F0F0F0",
          "base-200": "#e0e0e0",
          "base-300": "#DAD7CD",
          "base-content": "#232227",
          "--brand-black": "#232227",
          "--brand-white": "#F0F0F0",
        },
      },
    ],
  },
} satisfies Config;
