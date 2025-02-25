/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        'primary': 'var(--color-primary)',
        'bg': 'var(--color-bg)',
        'bg-hover': 'var( --color-bg-hover)',
        'border': 'var(--color-border)',
        'border-hover': 'var(--color-border-hover)',
      }
    }
  },
  plugins: [
    function ({ addUtilities }) {
      const gapUtilities = {};
      const spacingConfig = require('tailwindcss/defaultTheme').spacing;

      Object.entries(spacingConfig).forEach(([key, value]) => {
        // For flex-col
        gapUtilities[`.flex.flex-col.gap-${key} > *:not(:last-child)`] = {
          marginBottom: value
        };
        // For flex-row
        gapUtilities[`.flex-row.gap-${key} > *:not(:last-child)`] = {
          marginRight: value
        };
         // For flex-row
         gapUtilities[`.flex.gap-${key} > *:not(:last-child)`] = {
          marginRight: value
        };
      });

      addUtilities(gapUtilities);
    }
  ]
};
