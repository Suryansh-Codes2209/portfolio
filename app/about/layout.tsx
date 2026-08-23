import type { Metadata } from "next";
import { ID, SAME_AS, SITE_URL } from "../data/site";

const URL = `${SITE_URL}/about`;

const title = "About Suryansh Chaudhary — Full-Stack AI Engineer & creator of MacGet";
const description =
	"Who Suryansh Chaudhary is: a Full-Stack AI Engineer at Spiral Kite Labs building LangGraph research agents in production, and the creator of MacGet, Oratora and Signal Boy. Background, current work, and how he builds.";

export const metadata: Metadata = {
	title,
	description,
	keywords: [
		"Suryansh Chaudhary",
		"who is Suryansh Chaudhary",
		"Suryansh Chaudhary AI engineer",
		"creator of MacGet",
		"Full-Stack AI Engineer",
		"LangGraph engineer",
		"LangChain developer",
		"AI agent engineer portfolio",
		"Spiral Kite Labs",
		"Oratora",
	],
	// Without its own canonical this route inherits the root layout's, which
	// points at the homepage — and Google drops the page as a duplicate.
	alternates: { canonical: URL },
	openGraph: {
		title,
		description,
		url: URL,
		type: "profile",
		images: [{ url: "/og.png", width: 1920, height: 1080, alt: "About Suryansh Chaudhary" }],
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
			"@type": "AboutPage",
			"@id": `${URL}#page`,
			url: URL,
			name: title,
			description,
			isPartOf: { "@id": ID.website },
			// The page is *about* the person — this is the statement that makes
			// /about the entity home rather than just another bio page.
			mainEntity: { "@id": ID.person },
			about: { "@id": ID.person },
			inLanguage: "en-US",
		},
		{
			"@type": "Person",
			"@id": ID.person,
			name: "Suryansh Chaudhary",
			sameAs: SAME_AS,
		},
		{
			"@type": "BreadcrumbList",
			itemListElement: [
				{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
				{ "@type": "ListItem", position: 2, name: "About", item: URL },
			],
		},
	],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
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
