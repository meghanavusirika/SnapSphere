/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ff',
          100: '#fdeeff',
          200: '#fbdfff',
          300: '#f8bfff',
          400: '#f493ff',
          500: '#ed5aff',
          600: '#d926da',
          700: '#b91cbb',
          800: '#9a1a9b',
          900: '#7e1a7f',
        },
        aesthetic: {
          vintage: '#8B7355',
          grunge: '#2F2F2F',
          pastel: '#FFB3BA',
          moody: '#4A5568',
          nature: '#68D391',
          urban: '#F7FAFC',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
} 