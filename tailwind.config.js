/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050c18',
          900: '#0b1f3a',
          800: '#102847',
          700: '#163558',
        },
        sky: {
          brand: '#38bdf8',
          light: '#7dd3fc',
          deep: '#0ea5e9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
