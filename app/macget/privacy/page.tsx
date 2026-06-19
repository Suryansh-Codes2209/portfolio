import { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Macget — Privacy Policy",
	description:
		"Privacy policy for the Macget browser extension. It sends data only to the Macget app on your own Mac — nothing is collected, transmitted, or shared.",
};

export default function MacgetPrivacyPage() {
	return (
		<div className="bg-black text-zinc-100 min-h-screen">
			<header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b border-claude-500/10 bg-black/80">
				<div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
					<Link
						href="/macget"
						className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						Macget
					</Link>
					<span className="text-xs text-zinc-600">Privacy</span>
				</div>
			</header>

			<main className="max-w-3xl mx-auto px-5 pt-28 pb-24">
				<h1 className="text-3xl sm:text-4xl font-display mb-2">Privacy Policy</h1>
				<p className="text-sm text-zinc-500 mb-10">
					Macget browser extension · Last updated June 19, 2026
				</p>

				<div className="space-y-8 text-[15px] text-zinc-400 leading-relaxed">
					<section>
						<p className="rounded-xl border border-claude-500/20 bg-claude-500/[0.06] px-5 py-4 text-zinc-300">
							<strong className="text-zinc-100">The short version:</strong> the Macget
							extension sends data only to the Macget app running on your own computer.
							It does not send anything to us, to any server, or to any third party.
							No analytics, no tracking, no accounts.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-medium text-zinc-200 mb-2">Overview</h2>
						<p>
							The Macget browser extension is a companion to the Macget download
							manager for macOS. Its only function is to hand downloads you start in
							your browser — files and videos — to the Macget desktop app, which
							performs the download. This policy explains what the extension accesses
							and what it does (and does not) do with it.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-medium text-zinc-200 mb-2">What the extension accesses</h2>
						<ul className="list-disc pl-5 space-y-1.5">
							<li>
								The URL, filename, and referrer of downloads you start, and of video
								pages where you click the Macget button.
							</li>
							<li>
								Cookies and request headers for those URLs — so downloads that require
								you to be signed in work correctly.
							</li>
							<li>
								Basic tab information (such as whether a tab was opened by another
								tab) to filter out automatic popunder / “jumplink” downloads.
							</li>
							<li>
								Video stream (HLS / DASH) manifest URLs detected on the current page.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-lg font-medium text-zinc-200 mb-2">How it is used</h2>
						<p>
							All of the above is passed to the Macget app installed on the same Mac,
							via Chrome’s Native Messaging, so the app can perform the download. That
							is the extension’s entire purpose — the data is used for nothing else.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-medium text-zinc-200 mb-2">What we do not do</h2>
						<ul className="list-disc pl-5 space-y-1.5">
							<li>We do not transmit any data off your device.</li>
							<li>We do not collect, remotely store, sell, or share your data with anyone.</li>
							<li>No advertising, analytics, fingerprinting, or tracking of any kind.</li>
						</ul>
					</section>

					<section>
						<h2 className="text-lg font-medium text-zinc-200 mb-2">Local settings</h2>
						<p>
							Your preferences — capture on/off, the domain denylist, the minimum
							file-size filter, and the jumplink-filter toggle — are saved locally in
							your browser’s extension storage. They never leave your device.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-medium text-zinc-200 mb-2">Remote code & third-party tools</h2>
						<p>
							The extension does not download or execute any remote code; all of its
							logic ships inside the package. Downloading itself is performed by the
							Macget desktop app, which uses the open-source tools yt-dlp and ffmpeg
							locally on your Mac.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-medium text-zinc-200 mb-2">Changes</h2>
						<p>
							If this policy changes, the “Last updated” date above will be revised.
						</p>
					</section>

					<section>
						<h2 className="text-lg font-medium text-zinc-200 mb-2">Contact</h2>
						<p>
							Questions? Email{" "}
							<a
								href="mailto:suryansh.codes2001@gmail.com"
								className="text-claude-300 hover:text-claude-200 transition-colors"
							>
								suryansh.codes2001@gmail.com
							</a>{" "}
							or open an issue on{" "}
							<a
								href="https://github.com/Suryansh-Codes2209/Macget"
								target="_blank"
								rel="noopener noreferrer"
								className="text-claude-300 hover:text-claude-200 transition-colors"
							>
								GitHub
							</a>
							.
						</p>
					</section>
				</div>
			</main>
		</div>
	);
}
