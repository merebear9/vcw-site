import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vcw: {
          black: "#0a0a0a",
          charcoal: "#1a1a1a",
          charcoal2: "#232323",
          red: "#cc0000",
          redDark: "#990000",
          redLight: "#ff3333",
          white: "#ffffff",
          gray: "#999999",
          border: "#2a2a2a",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Oswald", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
        serif: ["Georgia", "'Times New Roman'", "serif"],
      },
      maxWidth: {
        article: "720px",
      },
      backgroundImage: {
        "red-gradient": "linear-gradient(135deg, #cc0000 0%, #990000 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
