/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'panel': '#151d2c',
        'dark-bg': '#0b0f16',
        'accent-blue': '#0066ff',
        'risk-active': '#f59e0b',
        'black-3': '#1b2030',
        'tank-oil': '#0e141e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive'],
        rubik: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
}