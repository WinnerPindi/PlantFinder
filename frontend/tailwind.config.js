/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      colors:{
        'E5F1CF': '#E5F1CF',
        '17201b': '#17201b'
      },
    },
  },
  plugins: [],
};
