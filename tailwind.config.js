/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  theme: {
    extend: {
      colors: {
        muted: "#f5f5f4",
        thinborder: "#e2e5e9",
        primary: {
          brand: "#6200ff"
        }
      }
    }
  },
  plugins: []
}
