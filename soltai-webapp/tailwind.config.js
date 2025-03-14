/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
      colors: {
        'dark-bg': '#121212',
        'dark-surface': '#1E1E1E',
        'accent': '#10B981', // zöld
      },
      animation: {
        'spotlight': 'spotlight 5s ease-in-out infinite',
      },
      keyframes: {
        spotlight: {
          '0%, 100%': { transform: 'translate(5%, 5%)' },
          '50%': { transform: 'translate(95%, 95%)' },
        },
      },
    },
  },
  plugins: [],
} 