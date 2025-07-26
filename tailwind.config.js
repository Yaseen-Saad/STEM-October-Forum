/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        /* Exact colors from the gradient palette image */
        'gradient-light-pink-start': '#FFE5F1',
        'gradient-light-pink-end': '#F042FF',
        'gradient-purple-start': '#FFE5F1',
        'gradient-purple-mid': '#F042FF',
        'gradient-purple-end': '#7226FF',
        'gradient-blue-start': '#B7F5F5',
        'gradient-blue-end': '#FFE5F1',
        'gradient-dark-purple-start': '#7226FF',
        'gradient-dark-purple-mid': '#160078',
        'gradient-dark-purple-end': '#010030',
        'text-light': '#F0F0F0',
        'text-dark-contrast': '#0A0A0A',
        'background-dark': '#1A0030',
      },
      animation: {
        'subtle-bounce': 'subtleBounce 2s ease-in-out infinite',
        'breathe': 'breathe 40s ease-in-out infinite',
        'gentle-float': 'gentleFloat 6s ease-in-out infinite',
        'pulse-gradient': 'pulseGradient 4s ease-in-out infinite',
      },
      backgroundImage: {
        /* Vertical gradients as shown in the image */
        'gradient-pink': 'linear-gradient(to bottom, #FFE5F1, #F042FF)',
        'gradient-purple': 'linear-gradient(to bottom, #FFE5F1, #F042FF, #7226FF)',
        'gradient-blue': 'linear-gradient(to bottom, #B7F5F5, #FFE5F1, #F042FF)',
        'gradient-dark': 'linear-gradient(to bottom, #7226FF, #160078, #010030)',
        
        /* Horizontal variants for flexibility in design */
        'gradient-pink-horizontal': 'linear-gradient(to right, #FFE5F1, #F042FF)',
        'gradient-purple-horizontal': 'linear-gradient(to right, #FFE5F1, #F042FF, #7226FF)',
        'gradient-blue-horizontal': 'linear-gradient(to right, #B7F5F5, #FFE5F1, #F042FF)',
        'gradient-dark-horizontal': 'linear-gradient(to right, #7226FF, #160078, #010030)',
        
        /* Diagonal variants for more dynamic elements */
        'gradient-pink-diagonal': 'linear-gradient(to bottom right, #FFE5F1, #F042FF)',
        'gradient-purple-diagonal': 'linear-gradient(to bottom right, #FFE5F1, #F042FF, #7226FF)',
        'gradient-blue-diagonal': 'linear-gradient(to bottom right, #B7F5F5, #FFE5F1, #F042FF)',
        'gradient-dark-diagonal': 'linear-gradient(to bottom right, #7226FF, #160078, #010030)',
        
        /* For compatibility with existing code */
        'gradient-primary': 'linear-gradient(to bottom, #FFE5F1, #F042FF, #7226FF)',
        'gradient-secondary': 'linear-gradient(to bottom, #B7F5F5, #FFE5F1, #F042FF)',
        'gradient-tertiary': 'linear-gradient(to bottom, #7226FF, #160078, #010030)',
      },
      keyframes: {
        subtleBounce: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)' },
          '50%': { transform: 'scale(1.05) rotate(5deg)' },
        },
        gentleFloat: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%': { transform: 'translateY(-10px) translateX(5px)' },
          '66%': { transform: 'translateY(5px) translateX(-5px)' },
        },
        pulseGradient: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
      boxShadow: {
        'dark': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.9)',
      },
    },
  },
  plugins: [],
}
