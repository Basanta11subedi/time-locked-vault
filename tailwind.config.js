/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          900: '#1e1b4b',
          800: '#3730a3',
        },
        purple: {
          800: '#6b21a8',
        },
      },
    },
  },
  plugins: [],
}