/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 needs "class" to allow a manual color scheme (colorScheme.set()).
  // With the default "media" it only follows the OS and throws on manual changes.
  darkMode: 'class',
  content: [
    './App.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './core/**/*.{ts,tsx}',
    './modules/**/*.{ts,tsx}',
  ],
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
          900: '#172554',
        },
        accent: {
          aqua: '#d9f2ff',
          mint: '#dff7e8',
          amber: '#fff1cc',
          rose: '#ffe0e6',
        },
        surface: {
          DEFAULT: '#f3f6fb',
          soft: '#fafcff',
          strong: '#e9eef8',
        },
        ink: '#10203a',
        muted: '#60708a',
        border: '#d7dfeb',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
        // Dark palette. Must live inside `colors` so Tailwind can generate
        // classes like `dark:bg-dark-surface` or `text-dark-ink`.
        dark: {
          DEFAULT: '#1a1d21',
          surface: {
            DEFAULT: '#1a1d21',
            soft: '#242730',
            strong: '#2a2e38',
          },
          ink: '#f5f5f5',
          muted: '#9ca3af',
          border: '#374151',
        },
      },
      boxShadow: {
        card: '0 10px 30px rgba(16, 32, 58, 0.08)',
        lift: '0 14px 36px rgba(29, 78, 216, 0.14)',
        'dark-card': '0 10px 30px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
