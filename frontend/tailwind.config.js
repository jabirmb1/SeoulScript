/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#0b132b",
          800: "#0f1a3a",
          700: "#121e48"
        },
        silver: "#e0e0e0",
        neon: {
          blue: "#6ee7ff",
          purple: "#a78bfa"
        }
      },
      backgroundImage: {
        'sky-gradient': "radial-gradient(1000px 600px at 10% 10%, rgba(111,231,255,0.08), transparent), radial-gradient(800px 400px at 80% 20%, rgba(167,139,250,0.08), transparent)"
      },
      boxShadow: {
        glow: "0 0 30px rgba(167,139,250,0.25)"
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: 0.2 },
          '50%': { opacity: 1 }
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' }
        }
      },
      animation: {
        twinkle: 'twinkle 2.4s ease-in-out infinite',
        shimmer: 'shimmer 3.5s linear infinite'
      },
      fontFamily: {
        display: ['Georgia', 'ui-serif', 'serif'],
        script: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace']
      }
    }
  },
  plugins: [
  ],
};
