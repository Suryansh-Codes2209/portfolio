import type { Metadata } from "next";

const URL = "https://suryansh.work/blog";

const description =
	"Build logs and engineering notes by Suryansh Chaudhary — LangGraph agent architecture, prompt-injection defence, Swift concurrency in MacGet, and shipping AI systems to production.";

// Applies to /blog. Post pages override title/description/canonical in
// `[slug]/generateMetadata`, so this only ever describes the index.
export const metadata: Metadata = {
	title: "Blog — build logs on AI agents & macOS engineering",
	description,
	keywords: [
		"LangGraph tutorial",
		"AI agent architecture",
		"build in public blog",
		"Swift concurrency",
		"prompt injection defence",
		"engineering build log",
	],
	alternates: {
		canonical: URL,
		types: { "application/rss+xml": "https://suryansh.work/rss.xml" },
	},
	openGraph: {
		title: "Blog — build logs on AI agents & macOS engineering",
		description,
		url: URL,
		type: "website",
		images: [{ url: "/og.png", width: 1920, height: 1080, alt: "Blog by Suryansh Chaudhary" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Blog — build logs on AI agents & macOS engineering",
		description,
		images: ["/og.png"],
	},
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
