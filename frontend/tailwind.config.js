/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        college: {
          navy: '#0f2942',
          dark: '#0a192f',
          blue: '#1a56db',
          light: '#f4f7fb',
          slate: '#334155',
          gold: '#b45309',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
