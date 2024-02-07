/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#535c69",
        light_blue: "rgba(47,198,246,0.1)",
        dusky_rose: "#BB616A"
      },
      boxShadow: {
        white: "0px 0px 8px white",
      }
    },
  },
  plugins: [],
}

