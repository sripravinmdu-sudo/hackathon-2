/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#0d0d0f',
          50: '#1a1a1f',
          100: '#141418',
          200: '#1e1e24',
          300: '#252530',
          400: '#2d2d38',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          subtle: 'rgba(255,255,255,0.04)',
          strong: 'rgba(255,255,255,0.16)',
        },
        accent: {
          DEFAULT: '#6366f1',
          hover: '#7c3aed',
          dim: 'rgba(99,102,241,0.15)',
        },
        safe: {
          DEFAULT: '#10b981',
          dim: 'rgba(16,185,129,0.12)',
        },
        watch: {
          DEFAULT: '#f59e0b',
          dim: 'rgba(245,158,11,0.12)',
        },
        risk: {
          DEFAULT: '#f97316',
          dim: 'rgba(249,115,22,0.12)',
        },
        danger: {
          DEFAULT: '#ef4444',
          dim: 'rgba(239,68,68,0.12)',
        },
      },
      animation: {
        'count-up': 'countUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'draw': 'draw 1.5s ease-out forwards',
      },
      keyframes: {
        countUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
