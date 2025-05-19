/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3a86ff',
        secondary: '#8338ec',
        accent: '#ff006e',
        dark: '#1a1a2e',
        light: '#f8f9fa'
      },
    },
  },
  plugins: [],
}