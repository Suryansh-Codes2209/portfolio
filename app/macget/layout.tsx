import { Metadata } from "next";

const MACGET_URL = "https://suryansh.work/macget";
const DMG_URL =
	"https://github.com/Suryansh-Codes2209/Macget/releases/latest/download/Macget.dmg";
const REPO_URL = "https://github.com/Suryansh-Codes2209/Macget";

const description =
	"MacGet is a free, open-source, multi-threaded download manager for macOS. Chunked HTTP downloads, browser-extension capture, and YouTube/HLS video downloads via bundled yt-dlp.";

export const metadata: Metadata = {
	title: "MacGet — open-source macOS download manager",
	description,
	keywords: [
		"MacGet",
		"macOS download manager",
		"open source download manager Mac",
		"free IDM alternative Mac",
		"yt-dlp GUI Mac",
		"multi-threaded download manager macOS",
	],
	alternates: { canonical: MACGET_URL },
	openGraph: {
		title: "MacGet — open-source macOS download manager",
		description,
		url: MACGET_URL,
		type: "website",
		images: [
			{
				url: "/macget-og.png",
				width: 1200,
				height: 630,
				alt: "MacGet — open-source macOS download manager",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "MacGet — open-source macOS download manager",
		description,
		images: ["/macget-og.png"],
		creator: "@Suryansh_2001",
	},
};

export default function MacgetLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: "MacGet",
						applicationCategory: "UtilitiesApplication",
						operatingSystem: "macOS 26+",
						description,
						url: MACGET_URL,
						downloadUrl: DMG_URL,
						softwareHelp: REPO_URL,
						isAccessibleForFree: true,
						offers: {
							"@type": "Offer",
							price: "0",
							priceCurrency: "USD",
						},
						author: {
							"@type": "Person",
							name: "Suryansh Chaudhary",
							url: "https://suryansh.work",
						},
					}),
				}}
			/>
			{children}
		</>
	);
}
