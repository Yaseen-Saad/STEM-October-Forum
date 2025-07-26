

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
        // Updated color palette based on the provided image
        'primary': {
          50: '#FFF5F8',
          100: '#FFE5F1',
          200: '#FFCCE3',
          300: '#FFB3D6',
          400: '#FF99C8',
          500: '#F042FF',
          600: '#E038E6',
          700: '#C62ECC',
          800: '#AC24B3',
          900: '#921A99',
        },
        'secondary': {
          50: '#F0FFFE',
          100: '#E1FFFD',
          200: '#C3FFFB',
          300: '#A5FFF9',
          400: '#87FFF7',
          500: '#B7F5F5',
          600: '#A5DDDD',
          700: '#93C5C5',
          800: '#81ADAD',
          900: '#6F9595',
        },
        'accent': {
          50: '#F5F0FF',
          100: '#EBE1FF',
          200: '#D7C3FF',
          300: '#C3A5FF',
          400: '#AF87FF',
          500: '#7226FF',
          600: '#6622E6',
          700: '#5A1ECC',
          800: '#4E1AB3',
          900: '#421699',
        },
        'dark': {
          50: '#E6E1FF',
          100: '#CCC3FF',
          200: '#9987FF',
          300: '#664BFF',
          400: '#330FFF',
          500: '#160078',
          600: '#14006B',
          700: '#12005E',
          800: '#100051',
          900: '#010030',
        },
        'surface': {
          light: '#FFFFFF',
          dark: '#0A0A0F',
          'dark-elevated': '#1A1A2E',
        },
        'text': {
          primary: '#0A0A0F',
          secondary: '#6B7280',
          inverse: '#F9FAFB',
          muted: '#9CA3AF',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FFE5F1 0%, #F042FF 50%, #7226FF 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #B7F5F5 0%, #FFE5F1 50%, #F042FF 100%)',
        'gradient-dark': 'linear-gradient(135deg, #7226FF 0%, #160078 50%, #010030 100%)',
        'gradient-forme': 'linear-gradient(289deg, #faf7f8 15%, #F042FF 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255, 229, 241, 0.05) 0%, rgba(240, 66, 255, 0.05) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #010030 0%, #160078 25%, #7226FF 50%, #F042FF 75%, #FFE5F1 100%)',
        'gradient-reverse-flow': 'linear-gradient(37deg, #010030 0%, #160078 25%, #7226FF 50%, #F042FF 75%, #FFE5F1 100%)',
        'gradient-surface': 'linear-gradient(131deg, #010030 0%, #160078 25%, #7226FF 50%, #F042FF 75%, #FFE5F1 100%)',
        'gradient-smooth-flow': 'linear-gradient(41deg, #010030 0%, #160078 25%, #7226FF 50%, #F042FF 75%, #FFE5F1 100%)',
        'gradient-contribute-to-footer': 'linear-gradient(90deg, #010031 0%, #09004a 25%, #1a0471 50%, #170079 75%, #270792 100%)',
        'gradient-icon-consistent': 'linear-gradient(135deg, #7226FF 0%, #F042FF 50%, #FFE5F1 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(240, 66, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(240, 66, 255, 0.6)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(240, 66, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(240, 66, 255, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}