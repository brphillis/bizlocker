import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      montserrat: ["Montserrat", "sans-serif"],
      ptsans: ["PT Sans", "sans-serif"],
      notosans: ["Noto Sans", "sans-serif"],
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      // prettier-ignore
      {
        "brand-theme": {
          "primary": "#3B82F6",
          "primary-focus": "#2563EB",
          "primary-content": "#FFFFFF",
          "secondary": "#A78BFA",
          "secondary-content": "#FFFFFF",
          "accent": "#8B5CF6",
          "accent-content": "#FFFFFF",
          "neutral": "#6B7280",
          "neutral-focus": "#4B5563",
          "neutral-content": "#1F2937",
          "base-100": "#191A1D",
          "base-200": "#151518",
          "base-300": "#09090A",
          "base-content": "#c2c2c2",
        },
      },
      "dark",
      "cupcake",
      "bumblebee",
      "night",
      "pastel",
      "black",
      "coffee",
    ],
  },
} satisfies Config;
