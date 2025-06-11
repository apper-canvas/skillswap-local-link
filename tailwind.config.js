/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4E8C',
        secondary: '#E8B931',
        accent: '#4ECDC4',
        surface: '#F7F3E9',
        background: '#FCFAF7',
        surface: {
          50: '#FCFAF7',   
          100: '#F7F3E9',
          200: '#F0E8D6',
          300: '#E8DDC3',
          400: '#DFD2B0',
          500: '#D6C79D',
          600: '#C8B584',
          700: '#B5A26B',
          800: '#A18F52',
          900: '#8E7C39'
        }
      },
      fontFamily: { 
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'], 
        heading: ['Fredoka One', 'cursive'],
        display: ['Fredoka One', 'cursive']
      },
    },
  },
  plugins: [],
}