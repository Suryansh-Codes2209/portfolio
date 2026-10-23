const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./video/**/*.{ts,tsx}",
		"./content/**/*.mdx",
	],

	theme: {
		extend: {
			colors: {
				bg: {
					DEFAULT: "var(--bg)",
					2: "var(--bg-2)",
				},
				surface: {
					DEFAULT: "var(--surface)",
					2: "var(--surface-2)",
				},
				line: {
					DEFAULT: "var(--line)",
					strong: "var(--line-strong)",
				},
				fg: {
					DEFAULT: "var(--fg)",
					muted: "var(--fg-muted)",
					subtle: "var(--fg-subtle)",
					faint: "var(--fg-faint)",
				},
				accent: {
					DEFAULT: "var(--accent)",
					text: "var(--accent-text)",
					soft: "var(--accent-soft)",
					fg: "var(--accent-fg)",
				},
				highlight: {
					DEFAULT: "var(--highlight)",
					ink: "var(--highlight-ink)",
				},
				tape: "var(--tape)",
				sticker: "var(--sticker)",
				claude: {
					50:  "#FCF3EE",
					100: "#F8E3D7",
					200: "#F2C7AF",
					300: "#EBA687",
					400: "#E28968",
					500: "#D97757",
					600: "#C15F3C",
					700: "#9E4B2E",
					800: "#793826",
					900: "#52261B",
				},
			},
			typography: {
				DEFAULT: {
					css: {
						"code::before": {
							content: '""',
						},
						"code::after": {
							content: '""',
						},
					},
				},
				quoteless: {
					css: {
						"blockquote p:first-of-type::before": { content: "none" },
						"blockquote p:first-of-type::after": { content: "none" },
					},
				},
			},
			fontFamily: {
				sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
				display: ["var(--font-calsans)"],
				serif: ["var(--font-serif)", ...defaultTheme.fontFamily.serif],
				mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
			},
			backgroundImage: {
				"gradient-radial":
					"radial-gradient(50% 50% at 50% 50%, var(--tw-gradient-stops))",
			},
			boxShadow: {
				paper: "var(--shadow-paper)",
			},
			animation: {
				marquee: "marquee var(--duration) linear infinite",
				"marquee-vertical": "marquee-vertical var(--duration) linear infinite",
				"fade-in": "fade-in 3s ease-in-out forwards",
				title: "title 3s ease-out forwards",
				"fade-left": "fade-left 3s ease-in-out forwards",
				"fade-right": "fade-right 3s ease-in-out forwards",
			},
			keyframes: {
				marquee: {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(calc(-100% - var(--gap)))" },
				},
				"marquee-vertical": {
					from: { transform: "translateY(0)" },
					to: { transform: "translateY(calc(-100% - var(--gap)))" },
				},
				"fade-in": {
					"0%": {
						opacity: "0%",
					},
					"75%": {
						opacity: "0%",
					},
					"100%": {
						opacity: "100%",
					},
				},
				"fade-left": {
					"0%": {
						transform: "translateX(100%)",
						opacity: "0%",
					},

					"30%": {
						transform: "translateX(0%)",
						opacity: "100%",
					},
					"100%": {
						opacity: "0%",
					},
				},
				"fade-right": {
					"0%": {
						transform: "translateX(-100%)",
						opacity: "0%",
					},

					"30%": {
						transform: "translateX(0%)",
						opacity: "100%",
					},
					"100%": {
						opacity: "0%",
					},
				},
				title: {
					"0%": {
						"line-height": "0%",
						"letter-spacing": "0.25em",
						opacity: "0",
					},
					"25%": {
						"line-height": "0%",
						opacity: "0%",
					},
					"80%": {
						opacity: "100%",
					},

					"100%": {
						"line-height": "100%",
						opacity: "100%",
					},
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-debug-screens"),
		require("tailwindcss-animate"),
	],
};
