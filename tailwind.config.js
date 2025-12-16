/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#05080a',
        'cyber-accent': '#6fffe9',
        'accent-gold': '#d4b778',
        'cyber-text': '#8a9a9a',
      },
      fontFamily: {
        'serif': ['Noto Serif SC', 'serif'],
        'sans': ['Noto Sans SC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
