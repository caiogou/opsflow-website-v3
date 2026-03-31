/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f2a4a',
          deep: '#0a1f38',
          mid: '#1a3a5c',
        },
        teal: {
          DEFAULT: '#1a9e8f',
          light: '#4ab8ae',
          pale: '#e8f7f4',
          muted: '#9fd8d0',
        },
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
