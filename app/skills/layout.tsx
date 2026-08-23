import type { Metadata } from "next";
import { ID, SITE_URL } from "../data/site";
import { SKILL_GROUPS } from "./skills-data";

const URL = `${SITE_URL}/skills`;

const title = "Skills & tech stack — LangGraph, Python, Next.js, Swift";
const description =
	"The tools Suryansh Chaudhary builds with and what he has actually shipped with each: LangGraph and LangChain agents, agentic RAG on Vertex AI, FastAPI and Python backends, React and Next.js frontends, Postgres/Redis, Docker and Google Cloud Run, and SwiftUI on macOS.";

export const metadata: Metadata = {
	title,
	description,
	keywords: [
		"Suryansh Chaudhary skills",
		"full stack AI engineer skills",
		"LangGraph developer",
		"LangChain developer",
		"agentic RAG engineer",
		"hire LangGraph engineer",
		"Python FastAPI developer",
		"Next.js TypeScript developer",
		"SwiftUI macOS developer",
		"Google Cloud Run Docker",
	],
	alternates: { canonical: URL },
	openGraph: {
		title,
		description,
		url: URL,
		type: "website",
		images: [{ url: "/og.png", width: 1920, height: 1080, alt: "Skills & tech stack — Suryansh Chaudhary" }],
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: ["/og.png"],
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebPage",
			"@id": `${URL}#page`,
			url: URL,
			name: title,
			description,
			isPartOf: { "@id": ID.website },
			about: { "@id": ID.person },
			inLanguage: "en-US",
		},
		{
			// Restates every skill as machine-readable data. `knowsAbout` on the
			// Person is what an answer engine reads when asked what he can do.
			"@type": "Person",
			"@id": ID.person,
			name: "Suryansh Chaudhary",
			knowsAbout: SKILL_GROUPS.flatMap((g) => g.skills.map((s) => s.name)),
		},
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
				{ "@type": "ListItem", position: 2, name: "Skills", item: URL },
			],
		},
	],
};

export default function SkillsLayout({ children }: { children: React.ReactNode }) {
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
