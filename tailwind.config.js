/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sara Dolls brand palette (carried over from the prototype)
        "pastel-pink": "#F4C2C2",
        "soft-rose": "#E88A9A",
        "rose-glow": "rgba(232, 138, 154, 0.25)",
        cream: "#FFF8F5",
        "warm-mocha": "#5C3A21",
        "mocha-light": "#8B5A2B",
        // semantic aliases
        brand: {
          DEFAULT: "#E88A9A",
          light: "#F4C2C2",
          dark: "#D06B7C",
        },
      },
      fontFamily: {
        sans: ["var(--font-cairo)", "Cairo", "Tajawal", "sans-serif"],
        display: ["var(--font-cairo)", "Cairo", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(232, 138, 154, 0.35)",
        "soft-sm": "0 4px 14px -6px rgba(232, 138, 154, 0.30)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "float-slow": "float 5s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
