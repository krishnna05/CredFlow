/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Fintra" Palette
        primary: "#111827", // Gray-900 (Text/Dark backgrounds)
        secondary: "#6B7280", // Gray-500 (Subtitles)
        accent: "#D1F34B", // The "Indigo" active state (Lime Green as per hex provided)
        surface: "#FFFFFF", // Card backgrounds
        background: "#F3F4F6", // Gray-100 (Main App Background)
        
        // Risk Levels
        risk: {
          low: "#10B981", // Emerald-500
          medium: "#F59E0B", // Amber-500
          high: "#EF4444", // Red-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'pill': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}