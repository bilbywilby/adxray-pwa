/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
			display: ['Barlow Condensed', 'system-ui', 'sans-serif'],
  			mono: ['IBM Plex Mono', 'monospace']
  		},
  		colors: {
  			background: '#0a0a0a',
        'lime-accent': '#c8f135',
        'dark-surface': '#141414',
  			foreground: '#ffffff',
  			primary: {
  				DEFAULT: '#c8f135',
  				foreground: '#000000'
  			},
  			border: '#222222',
  		},
  		animation: {
  			'blink': 'blink 1.5s step-end infinite',
        'scan-line': 'scan 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
  		},
  		keyframes: {
  			blink: {
  				'0%, 100%': { opacity: '1' },
  				'50%': { opacity: '0' }
  			},
        scan: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(400px)' }
        }
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
}