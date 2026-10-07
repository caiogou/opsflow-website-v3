/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Legacy light palette: still used by /diagnostic and /platform (they carry their own navy containers).
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
        // Dark visual (approved prototypes, 07/10/2026). Same values as the CSS variables in app/globals.css (literal so opacity modifiers work).
        dk: {
          bg: '#04101c',
          bg2: '#06162a',
          panel: 'rgba(8,22,36,.78)',
          ink: '#eaf4f8',
          body: '#c6d5de',
          mute: '#8fa6b6',
          teal: '#2fd3bd',
          teal2: '#7ff5df',
          amber: '#ffb547',
          line: 'rgba(127,245,223,.16)',
          line2: 'rgba(127,245,223,.32)',
          on: '#032a26',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
