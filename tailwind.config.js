/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 1. Police Montserrat
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
      },
      // 2. Couleurs personnalisées
      colors: {
        primary: "#1E3A8A",
        secondary: "#3B82F6",
        accent: "#FBBF24",
        text: "#111827",
        neutral: "#F9FAFB",
      },
    },
  },
  plugins: [],
};
