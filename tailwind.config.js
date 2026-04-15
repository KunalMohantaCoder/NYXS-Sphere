/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './server/**/*.js'],
  theme: {
    extend: {
      colors: {
        nx: {
          bg: '#0B0713',
          surface: '#140E20',
          card: 'rgb(26 17 40 / <alpha-value>)',
          cardHover: '#211535',
          border: '#2D1F45',
          borderLight: '#3D2A5C',
          purple: 'rgb(124 58 237 / <alpha-value>)',
          purpleLight: 'rgb(168 85 247 / <alpha-value>)',
          pink: 'rgb(236 72 153 / <alpha-value>)',
          orange: 'rgb(249 115 22 / <alpha-value>)',
          text: '#F5F0FF',
          textSec: '#C4B5FD',
          textMuted: '#7C6D9E',
        }
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};