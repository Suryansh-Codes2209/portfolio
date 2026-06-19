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
	{
		title: "SaaS Analytics Dashboard",
		description:
			"Full-featured analytics dashboard for a B2B startup. Real-time charts, user management, role-based access control, and Stripe billing integration.",
		url: undefined,
		github: undefined,
		tags: ["React", "Node.js", "PostgreSQL", "Stripe", "Redis"],
		date: "2023",
	},
	{
		title: "E-Commerce REST API",
		description:
			"Scalable REST API powering an e-commerce platform — product catalogue, cart, orders, payments, and fulfilment webhooks. Handles 10k+ requests per day.",
		url: undefined,
		github: "https://github.com/Suryansh-Codes2209",
		tags: ["Node.js", "Express", "MongoDB", "JWT", "Docker"],
		date: "2023",
	},
	{
		title: "Real-time Chat App",
		description:
			"WebSocket-based chat application with rooms, typing indicators, read receipts, file sharing, and end-to-end message persistence.",
		url: undefined,
		github: "https://github.com/Suryansh-Codes2209",
		tags: ["React", "Socket.io", "Node.js", "PostgreSQL"],
		date: "2023",
	},
	{
		title: "AI Content Generator",
		description:
			"SaaS tool that uses the OpenAI API to generate marketing copy, blog posts, and product descriptions. Built with a credits-based billing model.",
		url: undefined,
		github: undefined,
		tags: ["Next.js", "OpenAI API", "Prisma", "Stripe", "TypeScript"],
		date: "2024",
	},
	{
		title: "DevOps CI/CD Pipeline",
		description:
			"Automated CI/CD pipeline using GitHub Actions, Docker, and AWS ECS. Zero-downtime blue-green deployments with automated testing gates.",
		url: undefined,
		github: "https://github.com/Suryansh-Codes2209",
		tags: ["GitHub Actions", "Docker", "AWS ECS", "Terraform"],
		date: "2024",
	},
];
