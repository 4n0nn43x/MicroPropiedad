import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          100: '#CCE0FF',
          500: '#0066CC',
          600: '#0052A3',
          700: '#003D7A',
        },
        secondary: {
          500: '#FFB800',
        },
        success: '#00CC66',
        danger: '#CC0033',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
