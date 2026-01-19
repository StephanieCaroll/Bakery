/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bakery: {
          dark: '#b91c1c', 
          light: '#fbcbb0', 
          card: '#dc2626', 
        }
      }
    },
  },
  plugins: [],
}