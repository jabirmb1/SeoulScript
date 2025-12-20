/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#0b1020",
          800: "#0f1530",
          700: "#151a3a",
        },
        violet: {
          400: "#7c6ee6",
          500: "#8b80f9",
        }
      },
      backgroundImage: {
        'stars-gradient': "radial-gradient(1200px 600px at 10% 10%, rgba(124,110,230,0.15), rgba(0,0,0,0)), radial-gradient(800px 400px at 90% 20%, rgba(139,128,249,0.12), rgba(0,0,0,0))",
      },
      boxShadow: {
        glow: "0 0 25px rgba(139,128,249,0.25)",
      }
    },
  },
  plugins: [],
};
