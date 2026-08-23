/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: "#FBF8F2",
          100: "#F5F0E6",
          200: "#E9E0D2",
          300: "#DDD2C0",
        },
        charcoal: {
          700: "#393531",
          800: "#282522",
          900: "#181614",
          950: "#100E0D",
        },
        taupe: {
          300: "#CFC4B7",
          400: "#B4A697",
          500: "#958576",
        },
        coffee: {
          400: "#9B7557",
          500: "#7E5B42",
          600: "#624431",
        },
        burgundy: {
          500: "#6E4542",
          600: "#563533",
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'breathe': 'breathe 14s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
        'spin-slow': 'spin 60s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.95)' },
        },
      }
    },
  },
  plugins: [],
}
