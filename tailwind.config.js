/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}", // optional, if using `pages/`
    "./app/**/*.{js,ts,jsx,tsx}",   // if using `app/` directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
