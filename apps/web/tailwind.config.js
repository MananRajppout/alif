/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./videoComponents/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: ["media", "class"], // or 'media' or 'class'
  mode: "jit",
  theme: {
  	fontFamily: {
  		body: [
  			'Jost',
  			'serif'
  		]
  	},
  	extend: {
  		container: {
  			center: true
  		},
  		colors: {
  			themePrimary: '#416bb4',
  			themeLighterAlt: '#f7f8fa',
  			themeLighter: '#B8B9BB',
  			themeLight: '#6B7280',
  			themeTertiary: '#8F9CA9',
  			themeSecondary: '#a6b2cc',
  			themeDarkAlt: '#66737F',
  			themeDark: '#36414C',
  			themeDarker: '#2d3748',
  			themeDarkerAlt: '#1a202c',
  			body: '#f2f5f8',
  			black1: '#000',
  			white: '#fff',
  			prm: '#8e9cce',
  			arsenic: '#36414C',
  			black: '#13161C',
  			gray: '#D5DDE5',
  			deep: '#66737F',
  			light: '#F2F5F8',
  			grayLight: '#8F9CA9',
  			greenLight: '#87CEEB',
  			greenLight2: '#BEE4F4',
  			whiteLight: '#B8B9BB',
  			yellowLight: '#FFF6E9'
  		},
  		fontSize: {
  			xsss: '12px',
  			xss: '13px',
  			xss1: '14px',
  			xs: '16px',
  			xxs: '18px',
  			lg2: '20px',
  			lg: '24px',
  			xl: '32px',
  			xxl2: '40px',
  			xxl: '45px',
  			xxxl: '64px'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	},
  	variants: {
  		extend: {
  			display: [
  				'group-hover'
  			],
  			visibility: [
  				'group-hover'
  			],
  			transform: [
  				'group-hover'
  			],
  			scale: [
  				'group-hover'
  			],
  			width: [
  				'group-hover'
  			]
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
