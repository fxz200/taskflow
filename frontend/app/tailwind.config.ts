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
              "50": "#f9f9f9",
              "100": "#e0e0e0",
              "200": "#eaeaea",
              "300": "#f3f3f3",
              "400": "#d0d0d0",
              "500": "#b0b0b0",
              "600": "#909090",
              "700": "#707070",
              "800": "#505050",
              "900": "#303030",
            },
            "primary": {
              "foreground": "#1f1f1f",
              "DEFAULT": "#c1d3e5",
              "50": "#F0F4F8",
              "100": "#DFE8F1",
              "200": "#CBDDF0",
              "300": "#96B8DA",
              "400": "#6A9AC8",
              "500": "#4A7FB6",
              "600": "#2F639E",
              "700": "#1E4A7D",
              "800": "#12335C",
              "900": "#0A1F3B",
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

