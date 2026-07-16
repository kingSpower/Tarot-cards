/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mystic: {
          900: '#0b0717',
          800: '#150d2b',
          700: '#1f1442',
          600: '#2d1d5c',
          gold: '#e8c977',
          purple: '#8b5cf6',
          glow: '#c4a7ff',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(196, 167, 255, 0.35)',
        gold: '0 0 20px rgba(232, 201, 119, 0.4)',
      },
      keyframes: {
        floatStars: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        floatStars: 'floatStars 6s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
