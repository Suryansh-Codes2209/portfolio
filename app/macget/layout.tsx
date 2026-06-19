import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Macget — macOS Download Manager",
	description:
		"A fast, multi-threaded download manager for macOS. Chunked HTTP downloads, browser-extension capture, and YouTube/HLS video downloads via bundled yt-dlp. Free and open source.",
	openGraph: {
		title: "Macget — macOS Download Manager",
		description:
			"Multi-threaded downloads, browser capture, and YouTube/video downloads. Free and open source for macOS.",
		url: "https://suryansh.work/macget",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Macget — macOS Download Manager",
		description:
			"Multi-threaded downloads, browser capture, and YouTube/video downloads. Free and open source for macOS.",
	},
};

export default function MacgetLayout({
	children,
}: { children: React.ReactNode }) {
	return children;
}
