/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        archivo: ["'Archivo Black'", "sans-serif"],
        space: ["'Space Grotesk'", "sans-serif"],
      },
      colors: {
        retro: {
          yellow: "#FDE047",
          black: "#0A0A0A",
          white: "#FAFAFA",
          pink: "#F472B6",
          blue: "#60A5FA",
          green: "#4ADE80",
          orange: "#FB923C",
          purple: "#C084FC",
        },
      },
      boxShadow: {
        neo: "4px 4px 0px #0A0A0A",
        "neo-lg": "6px 6px 0px #0A0A0A",
        "neo-xl": "8px 8px 0px #0A0A0A",
        "neo-hover": "2px 2px 0px #0A0A0A",
      },
    },
  },
  plugins: [],
};
