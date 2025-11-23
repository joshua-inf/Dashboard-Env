import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				// Base colors
				current: "currentColor",
				transparent: "transparent",
				white: "#FFFFFF",
				black: "#1C2434",
				
				// UI colors
				stroke: "#E2E8F0",
				strokedark: "#2E3A47",
				boxdark: "#24303F",
				"boxdark-2": "#1A222C",
				"form-strokedark": "#3d4d60",
				"form-input": "#1d2a39",

				// Text colors
				body: "#64748B",
				bodydark: "#AEB7C0",
				bodydark1: "#DEE4EE",
				bodydark2: "#8A99AF",

				// Meta colors
				meta: {
					1: "#DC3545",
					2: "#EFF2F7",
					3: "#10B981",
					4: "#313D4A",
					5: "#259AE6",
					6: "#FFBA00",
					7: "#FF6766",
					8: "#F0950C",
					9: "#E5E7EB",
					10: "#0FADCF"
				},

				// Status colors
				primary: "#3C50E0",
				secondary: "#80CAEE",
				success: "#219653",
				danger: "#D34053",
				warning: "#FFA70B",
			},
			zIndex: {
				'999': '999',
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],

};

export default config;
  
  