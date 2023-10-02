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
        "brand-red": "#FF3A20",
      },
      scale: {
        "-100": "-1",
      },
    },
  },
  plugins: [require("daisyui"), require("tailwindcss-bg-patterns")],
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
          "base-300": "#c4c4c4",
          "base-content": "#232227",
          "--brand-black": "#232227",
          "--brand-white": "#F0F0F0",
        },
      },
    ],
  },
} satisfies Config;
