import type { Metadata } from "next";

const URL = "https://suryansh.work/projects";

const description =
	"Projects by Suryansh Chaudhary — MacGet (open-source macOS download manager), LangGraph financial research agents, and full-stack AI systems shipped to production.";

export const metadata: Metadata = {
	title: "Projects — MacGet, LangGraph agents & AI systems",
	description,
	keywords: [
		"Suryansh Chaudhary projects",
		"MacGet",
		"open source macOS apps",
		"LangGraph agent projects",
		"AI engineer portfolio projects",
	],
	alternates: { canonical: URL },
	openGraph: {
		title: "Projects — MacGet, LangGraph agents & AI systems",
		description,
		url: URL,
		type: "website",
		images: [{ url: "/og.png", width: 1920, height: 1080, alt: "Projects by Suryansh Chaudhary" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Projects — MacGet, LangGraph agents & AI systems",
		description,
		images: ["/og.png"],
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: [
		{ "@type": "ListItem", position: 1, name: "Home", item: "https://suryansh.work" },
		{ "@type": "ListItem", position: 2, name: "Projects", item: URL },
	],
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
			/>
			{children}
		</>
	);
}
