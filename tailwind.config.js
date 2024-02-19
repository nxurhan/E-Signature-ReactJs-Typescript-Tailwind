/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: '#595ED3'
      },
    },
    screens: {
      xs: '400px',
      sm: '480px',
      mmd: '620px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  },
  plugins: [],
}