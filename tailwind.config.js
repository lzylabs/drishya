/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display:    ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:       ['"DM Sans"', 'sans-serif'],
        telugu:     ['"Noto Sans Telugu"', '"DM Sans"', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', '"DM Sans"', 'sans-serif'],
      },
      fontSize: {
        /* +20% over Tailwind defaults — xs: 0.75→0.9rem, sm: 0.875→1.05rem */
        'xs': ['0.9rem',  { lineHeight: '1.5'  }],
        'sm': ['1.05rem', { lineHeight: '1.65' }],
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
