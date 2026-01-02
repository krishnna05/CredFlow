/** @type {import('tailwindcss').Config} */
export default {
  // 1. Point to your template files so Tailwind can tree-shake unused styles
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}" // Added ts/tsx for future proofing
  ],
  theme: {
    extend: {
      // 2. Add your custom font families here
      fontFamily: {
        // Inter for standard UI text (body, labels, buttons)
        sans: ['Inter', 'sans-serif'],
        // Manrope for Headings & Financial Numbers (KPIs, Currency)
        display: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}