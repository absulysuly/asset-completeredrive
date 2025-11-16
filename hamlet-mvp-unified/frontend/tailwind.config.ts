import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './index.html',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './compass/**/*.{js,ts,jsx,tsx}',
    './services/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'sans-serif'],
      },
      colors: {
        primary: '#6C2BD9',
        'primary-glass': 'rgba(108, 43, 217, 0.15)',
        'primary-glow': 'rgba(108, 43, 217, 0.4)',
        secondary: '#00D9FF',
        'secondary-glass': 'rgba(0, 217, 255, 0.12)',
        'secondary-glow': 'rgba(0, 217, 255, 0.4)',
        accent: '#FF2E97',
        'accent-glass': 'rgba(255, 46, 151, 0.12)',
        'accent-glow': 'rgba(255, 46, 151, 0.4)',
        'dark-bg': '#0A0E27',
        'glass-surface': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(108, 43, 217, 0.4)',
        'glow-secondary': '0 0 20px rgba(0, 217, 255, 0.4)',
        'glow-accent': '0 0 20px rgba(255, 46, 151, 0.4)',
      },
    },
  },
  plugins: [],
};
export default config;
