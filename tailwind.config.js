/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          shell: '#0A0B10',       // Dark Brand Shell Background
          shellCard: '#12141F',   // Elevated shell surface
          shellBorder: '#1E2235', // Subtle dark border
          canvas: '#F8FAFC',      // Off-white light analysis canvas
          card: '#FFFFFF',        // Pure white report cards
          blue: '#0094ea',        // Primary action / links / active focus (never for scores)
          magenta: '#cf41b2',     // AI Interpretation marker (never for decoration)
          cyan: '#00e5ff',        // Dark shell highlight (never on white canvas)
          violet: '#7c3aed',      // Secondary gradient partner for logo CTA
        },
        status: {
          critical: '#dc2626',    // Finding severity / Score band 0-49
          needsWork: '#d97706',   // Score band 50-69
          solid: '#2563eb',       // Score band 70-84
          strong: '#16a34a',      // Score band 85-100
        },
        cyber: {
          bg: '#06021c',
          bgLight: '#0d0735',
          accent: '#ff007f',
          neonBlue: '#00f0ff',
          gold: '#ffb800',
          purpleGlow: '#6c22ff',
          orangeSolid: '#ff7b1a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
        brush: ['Caveat Brush', 'Caveat', 'cursive'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'floatSlow 8s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '50%': { transform: 'translate(10px, -15px) rotate(3deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    }
  },
  plugins: [],
}
