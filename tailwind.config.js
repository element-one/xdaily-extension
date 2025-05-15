/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: ["./**/*.tsx"],
  theme: {
    // borderRadius: {
    //   "card-s": "8px"
    // },
    extend: {
      colors: {
        orange: "#FF9500",
        muted: {
          DEFAULT: "#f5f5f4",
          foreground: "#78716c",
          light: "#fafafa"
        },
        thinborder: "#e2e5e9",
        primary: {
          brand: "#FFE600",
          assist: "#E7D959",
          foreground: "#fafaf9"
        },
        fill: {
          bg: {
            light: "#151717",
            input: "#FFFFFF1A",
            deep: "#0D0D0D"
          },
          layer: {
            layer: "#4F5254"
          }
        },
        text: {
          default: {
            primary: "#fff",
            regular: "#FFFFFFCC",
            secondary: "#FFFFFF80"
          },
          inverse: {
            primary: "#000"
          }
        },
        border: {
          regular: "#FFFFFF33"
        }
      }
    }
  },
  plugins: []
}
