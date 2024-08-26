/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			width: {
				"1px": "1px",
			},
			colors: {
				"o-6": "#dc3700",
				"o-5": "#87e3c0",
				"o-4": "#ff470a",
				"o-3": "#ff855c",
				"o-2": "#f7f7f7",
			},
		},
	},
	plugins: [],
}
