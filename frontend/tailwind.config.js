/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 10px 40px -18px rgba(0,0,0,0.45)",
        glow: "0 20px 60px -30px rgba(59,130,246,0.55)",
      },
      colors: {
        "ios-surface": "rgba(255,255,255,0.65)",
        "ios-border": "rgba(255,255,255,0.35)",
        "ios-dark-surface": "rgba(30,41,59,0.7)",
      },
    },
  },
  plugins: [],
};

