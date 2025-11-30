/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Dark slate to deep navy gradient
                slate: {
                    850: '#1a1f2e',
                    900: '#0f1419',
                    950: '#0a0e17',
                },
                navy: {
                    900: '#0c1222',
                    950: '#070b14',
                },
                // Electric blue and cyan accents
                electric: {
                    blue: '#2563EB',
                    cyan: '#00FFFF',
                },
                // Teal glow
                teal: {
                    glow: '#14B8A6',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'gradient-dark': 'linear-gradient(135deg, #0a0e17 0%, #0c1222 50%, #1a1f2e 100%)',
            },
            boxShadow: {
                'glow-blue': '0 0 20px rgba(37, 99, 235, 0.5)',
                'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
                'glow-teal': '0 0 20px rgba(20, 184, 166, 0.5)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 3s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(37, 99, 235, 0.5), 0 0 10px rgba(37, 99, 235, 0.3)' },
                    '100%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.8), 0 0 30px rgba(37, 99, 235, 0.5)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
        },
    },
    plugins: [],
}
