/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "1.5rem",
        xl: "2rem",
      },
    },
    extend: {
      colors: {
        paper: "rgb(246 240 227 / <alpha-value>)",
        ink: "rgb(23 50 77 / <alpha-value>)",
        muted: "rgb(96 113 132 / <alpha-value>)",
        line: "rgb(202 212 216 / <alpha-value>)",
        science: "rgb(31 113 150 / <alpha-value>)",
        "science-dark": "rgb(21 83 111 / <alpha-value>)",
        action: "rgb(238 138 58 / <alpha-value>)",
        effort: "rgb(216 85 69 / <alpha-value>)",
        resistance: "rgb(40 122 104 / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        lifted: "var(--shadow-lifted)",
      },
      screens: {
        tablet: "720px",
        desktop: "1080px",
      },
    },
  },
  plugins: [],
};
