import type { Config } from "tailwindcss"
import { heroui } from "@heroui/react"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lightgray: "#505050",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      prefix: "heroui", // prefix for themes variables
      addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
      defaultTheme: "light", // default theme from the themes object
      defaultExtendTheme: "light", // default theme to extend on custom themes
      layout: {}, // common layout tokens (applied to all themes)
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          colors: {
            "default": {
              "foreground": "#1f1f1f",
              "DEFAULT": "#d9d9d9",
              // "50": "#f3f3f3",
              "100":"#e0e0e0",
            },
            "primary": {
              "foreground": "#1f1f1f",
              "DEFAULT": "#c1d3e5"
            },
          }, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            "default": {
              "foreground": "#1f1f1f",
              "DEFAULT": "#e5e5e5",
            },
            "primary": {
              "foreground": "#1f1f1f",
              "DEFAULT": "#c1d3e5"
            },
          }, // dark theme colors
        },
       
      },
    })
  ],
};
export default config;

