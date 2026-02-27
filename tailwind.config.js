/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        telugu:  ['"Noto Sans Telugu"', '"DM Sans"', 'sans-serif'],
      },
      screens: {
        xs:   '375px',
        '3xl':'1920px',
        '4xl':'2560px',
      },
      letterSpacing: {
        widest2: '0.18em',
      },
    },
  },
  plugins: [],
}
