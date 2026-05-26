
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.08)',
        primary: '#14b8a6', // teal 500
        accent: '#0ea5e9', // sky 500
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
