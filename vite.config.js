/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'amado': {
          primary: '#fbb710',
          dark: '#131212',
          text: '#6d6d6d',
          bg: '#f5f7fa',
          white: '#ffffff',
          'border-light': '#ebebeb',
        }
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      spacing: {
        'sidebar': '320px',
        'sidebar-md': '280px',
      }
    },
  },
  plugins: [],
}