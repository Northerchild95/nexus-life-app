/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{ts,tsx}', './core/**/*.{ts,tsx}', './modules/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d8e7ff',
          200: '#b7d1ff',
          300: '#86b0ff',
          400: '#5289f6',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1d356f',
        },
        accent: {
          aqua: '#d9f2ff',
          mint: '#dff7e8',
          amber: '#fff1cc',
          rose: '#ffe0e6',
        },
        surface: '#f3f6fb',
        surfaceSoft: '#fafcff',
        surfaceStrong: '#e9eef8',
        ink: '#10203a',
        muted: '#60708a',
        border: '#d7dfeb',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
      },
      boxShadow: {
        card: '0 10px 30px rgba(16, 32, 58, 0.08)',
        lift: '0 14px 36px rgba(29, 78, 216, 0.14)',
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
