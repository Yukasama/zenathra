/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  darkMode: "class",
  mode: "jit",
  theme: {
    screens: {
      sm: "768px",
      md: "976px",
      lg: "1080px",
      xl: "1440px",
    },
    extend: {
      colors: {
        moon: {
          100: "#273252",
          200: "#202942",
          300: "#1a2238",
          400: "#141b2d",
          500: "#141a29",
          600: "#101624",
          700: "#0c101b",
          800: "#080b12",
          900: "#040509",
        },
      },
      keyframes: {
        "appear-up": {
          "100%": { transform: 0, opacity: 1 },
          "0%": { transform: "translateY(4px)", opacity: 0.5 },
        },
        "appear-down": {
          "100%": { transform: 0, opacity: 1 },
          "0%": { transform: "translateY(-4px)", opacity: 0.5 },
        },
        "appear-left": {
          "100%": { transform: 0, opacity: 1 },
          "0%": { transform: "translateX(-10px)", opacity: 0.5 },
        },
      },
      animation: {
        "appear-up": "appear-up 0.3s ease-in-out",
        "appear-down": "appear-down 0.3s ease-in-out",
        "appear-left": "appear-left 0.3s ease-in-out",
      },
      transitionProperty: {
        width: "width",
        border: "border",
        z: "z-index",
      },
    },
  },
  plugins: [],
};
