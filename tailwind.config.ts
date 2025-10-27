import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        gtnh: {
          purple: '#6b4dff',
          green: '#4dff88',
          orange: '#ff8b4d',
          dark: '#1a1a2e',
          darker: '#0f0f1e',
          blue: '#3b82f6',
          steel: '#6b7280',
        }
      },
      boxShadow: {
        'gtnh': '0 0 20px rgba(107, 77, 255, 0.4)',
        'gtnh-lg': '0 0 40px rgba(107, 77, 255, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(107, 77, 255, 0.5), 0 0 10px rgba(107, 77, 255, 0.3)' },
          '100%': { boxShadow: '0 0 10px rgba(107, 77, 255, 0.8), 0 0 20px rgba(107, 77, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
