/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hacker-green': '#00ff00',
        'hacker-dark': '#0a0a0a',
        'hacker-matrix': '#00ff41',
        'hacker-red': '#ff0040',
        'hacker-blue': '#0040ff',
      },
      fontFamily: {
        'hacker': ['Hacker', 'monospace'],
        'mono': ['Courier New', 'monospace'],
      },
      animation: {
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
        'pulse-green': 'pulse-green 2s ease-in-out infinite',
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glitch': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-2px)' },
          '40%': { transform: 'translateX(2px)' },
          '60%': { transform: 'translateX(-1px)' },
          '80%': { transform: 'translateX(1px)' },
        },
        'pulse-green': {
          '0%, 100%': { boxShadow: '0 0 5px #00ff00' },
          '50%': { boxShadow: '0 0 20px #00ff00, 0 0 30px #00ff00' },
        },
      },
    },
  },
  plugins: [],
}