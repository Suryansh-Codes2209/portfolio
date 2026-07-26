import type { Metadata } from "next";

const URL = "https://suryansh.work/contact";

const description =
	"Get in touch with Suryansh Chaudhary — Full-Stack AI Engineer building LangGraph agents and open-source macOS tools. Available for collaborations, freelance work, and bug reports.";

export const metadata: Metadata = {
	title: "Contact",
	description,
	keywords: [
		"contact Suryansh Chaudhary",
		"hire full stack AI engineer",
		"LangGraph developer for hire",
		"MacGet support",
	],
	alternates: { canonical: URL },
	openGraph: {
		title: "Contact Suryansh Chaudhary",
		description,
		url: URL,
		type: "website",
		images: [{ url: "/og.png", width: 1920, height: 1080, alt: "Contact Suryansh Chaudhary" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "Contact Suryansh Chaudhary",
		description,
		images: ["/og.png"],
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: [
		{ "@type": "ListItem", position: 1, name: "Home", item: "https://suryansh.work" },
		{ "@type": "ListItem", position: 2, name: "Contact", item: URL },
	],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
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
