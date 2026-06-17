/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            cyber: {
                bg: '#06021c', // Background gelap pekat solid
                bgLight: '#0d0735',
                accent: '#ff007f', // hot pink solid
                neonBlue: '#00f0ff', // cyan solid
                gold: '#ffb800', // bintang emas
                purpleGlow: '#6c22ff',
                orangeSolid: '#ff7b1a' // Orange tombol solid
            }
        },
        fontFamily: {
            sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            brush: ['Caveat Brush', 'Caveat', 'cursive'],
        },
        animation: {
            'float': 'float 6s ease-in-out infinite',
            'float-delayed': 'floatSlow 8s ease-in-out infinite',
            'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            'spin-slow': 'spin 20s linear infinite',
            'spin-reverse': 'spinReverse 25s linear infinite',
            'radar-sweep': 'radarSweep 4s linear infinite',
            'soft-shadow': 'softShadow 4s ease-in-out infinite',
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
            fadeInUp: {
                '0%': { opacity: '0', transform: 'translateY(20px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            },
            spinReverse: {
                '0%': { transform: 'rotate(360deg)' },
                '100%': { transform: 'rotate(0deg)' }
            },
            radarSweep: {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
            },
            softShadow: {
                '0%, 100%': { boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' },
                '50%': { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }
            }
        }
    }
  },
  plugins: [],
}
