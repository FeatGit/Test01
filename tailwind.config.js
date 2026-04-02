/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        highlight: {
          '0%': { backgroundColor: '#fef08a' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'highlight': 'highlight 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
