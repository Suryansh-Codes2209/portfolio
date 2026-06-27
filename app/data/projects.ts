export type Project = {
	title: string;
	description: string;
	url?: string;
	github?: string;
	tags: string[];
	date: string;
};

// ─── Update these with your real projects ────────────────────────────────────
export const projects: Project[] = [
	{
		title: "Macget — macOS Download Manager",
		description:
			"Multi-threaded macOS download manager: chunked HTTP downloads, browser-extension capture, and YouTube/HLS video via bundled yt-dlp. SwiftUI + an actor-based download engine.",
		url: "/macget",
		github: "https://github.com/Suryansh-Codes2209/Macget",
		tags: ["SwiftUI", "macOS", "Swift", "yt-dlp"],
		date: "2026",
	},
	{
		title: "Portfolio Website",
		description:
			"Personal developer portfolio built with Next.js 14, Tailwind CSS, and Framer Motion. Features smooth scroll animations, a particle hero, and a clean dark aesthetic.",
		url: "https://suryansh.work",
		github: "https://github.com/Suryansh-Codes2209/portfolio",
		tags: ["Next.js", "Tailwind CSS", "Framer Motion", "TypeScript"],
		date: "2024",
	},
];
