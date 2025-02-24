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
  }
};
