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
		url: "https://macget.suryansh.work",
		github: "https://github.com/Suryansh-Codes2209/Macget",
		tags: ["SwiftUI", "macOS", "Swift", "yt-dlp"],
		date: "2026",
	},
	{
		title: "Oratora — Live Audience Engagement",
		description:
			"Live audience engagement for talks, classes and events — polls, word clouds, Q&A and quizzes the room joins from a phone browser with a code, no app or account. Next.js modular monolith plus a separately-scaled Socket.IO + Redis realtime tier, load-tested at 1,000 simultaneous joins.",
		url: "https://oratora.live",
		tags: ["Next.js", "Socket.IO", "Redis", "Postgres"],
		date: "2026",
	},
	{
		title: "Signal Boy — WiFi Survey Tool",
		description:
			"Run npx signalboy and walk your house watching the dBm move on a Game Boy-style LCD. Kalman filter settles the reading, EWMA keeps the sparkline live; zero dependencies, per-OS backends for macOS/Windows/Linux, plus a native Android app that reads the phone's own radio.",
		url: "https://signalboy.suryansh.work",
		github: "https://github.com/Suryansh-Codes2209/Signal-Boy",
		tags: ["Node.js", "CLI", "Android", "RF"],
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
