"use client";

import { motion } from "framer-motion";
import {
	ArrowLeft,
	ArrowRight,
	Download,
	Gauge,
	Github,
	Globe,
	Package,
	PauseCircle,
	Puzzle,
	ShieldCheck,
	Youtube,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../components/card";
import Particles from "../components/particles";
import { ShineText } from "../components/shine-text";

const DMG_URL =
	"https://github.com/Suryansh-Codes2209/Macget/releases/latest/download/Macget.dmg";
const REPO_URL = "https://github.com/Suryansh-Codes2209/Macget";
const EXTENSION_URL =
	"https://chromewebstore.google.com/detail/ldmhmgglgemkoogpokfcgplbpfokcejl";

// ─── animation helper (mirrors app/page.tsx) ──────────────────────────────────
const fadeUp = (delay = 0) => ({
	initial: { opacity: 0, y: 20 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-60px" } as const,
	transition: { duration: 0.45, delay, ease: "easeOut" as const },
});

const features = [
	{
		icon: <Gauge className="w-4 h-4 text-claude-400" />,
		title: "Multi-threaded downloads",
		desc: "Splits each file into parallel HTTP-range chunks — up to 16 connections — for maximum speed on cooperative servers, with live per-chunk progress.",
	},
	{
		icon: <Youtube className="w-4 h-4 text-claude-300" />,
		title: "YouTube & video downloads",
		desc: "Capture a video page and pick the quality — Macget extracts it with bundled yt-dlp + ffmpeg. HLS / DASH streams are supported too.",
		badge: "New",
	},
	{
		icon: <Globe className="w-4 h-4 text-claude-400" />,
		title: "Browser capture",
		desc: "A companion extension hands your browser downloads to Macget — cookies and headers included, so logged-in downloads just work.",
		link: { href: EXTENSION_URL, label: "Add to Chrome" },
	},
	{
		icon: <PauseCircle className="w-4 h-4 text-claude-300" />,
		title: "Pause, resume & recover",
		desc: "Stop and resume any download; in-progress transfers auto-resume on the next launch. Range-aware, so partial files never corrupt.",
	},
	{
		icon: <ShieldCheck className="w-4 h-4 text-claude-400" />,
		title: "Jumplink filtering",
		desc: "Drops the popunder / redirect / shortener junk movie-proxy sites fire, so only the downloads you actually meant get captured.",
	},
	{
		icon: <Package className="w-4 h-4 text-claude-300" />,
		title: "Zero setup",
		desc: "yt-dlp and ffmpeg ship inside the app — no Homebrew, no Terminal. Drag it in and go.",
	},
];

const steps = [
	{
		n: "1",
		title: "Download & open the DMG",
		desc: "Grab the latest release and open it, then drag Macget into your Applications folder.",
	},
	{
		n: "2",
		title: "First launch",
		desc: "Macget is a free, un-notarized build, so macOS asks once. Open System Settings → Privacy & Security, scroll down, and click “Open Anyway”.",
	},
	{
		n: "3",
		title: "Start downloading",
		desc: "Paste a link, drop a URL on the window, or use the browser extension. For video, click the ⬇ button on the player and choose a quality.",
	},
];

export default function MacgetPage() {
	return (
		<div className="bg-black text-zinc-100 min-h-screen overflow-x-hidden">
			{/* ── Mini nav ───────────────────────────────────────────────────────── */}
			<header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b border-claude-500/10 bg-black/80">
				<div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
					>
						<ArrowLeft className="w-3.5 h-3.5" />
						Back home
					</Link>
					<span className="text-xs text-zinc-600">Macget</span>
				</div>
			</header>

			{/* ── Hero ───────────────────────────────────────────────────────────── */}
			<section className="relative flex flex-col items-center justify-center min-h-dvh text-center px-4 pt-14">
				<Particles className="absolute inset-0 -z-10" quantity={90} />

				<div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-claude-600/10 blur-[80px] pointer-events-none" />
				<div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-claude-700/10 blur-[80px] pointer-events-none" />
				<div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full bg-claude-600/[0.07] blur-[80px] pointer-events-none" />

				<motion.div
					initial={{ opacity: 0, scale: 0.88 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="mb-6"
				>
					<Image
						src="/macget-icon.png"
						alt="Macget"
						width={88}
						height={88}
						className="rounded-[20px] shadow-[0_0_40px_rgba(217,119,87,0.25)]"
						priority
					/>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1, duration: 0.55, ease: "easeOut" }}
					className="py-1 text-5xl sm:text-7xl font-display text-transparent bg-white bg-clip-text text-edge-outline mb-3"
				>
					Macget
				</motion.h1>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.22, duration: 0.4 }}
					className="text-base sm:text-lg text-zinc-400 max-w-md mb-2"
				>
					A fast, multi-threaded download manager for macOS — now with YouTube &
					video downloads.
				</motion.p>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.4 }}
					className="flex flex-wrap items-center justify-center gap-2 mb-9"
				>
					{["Free", "Open source", "macOS 26+"].map((b) => (
						<span
							key={b}
							className="text-[11px] px-2.5 py-1 rounded-full border border-claude-500/30 bg-claude-500/10 text-claude-300"
						>
							{b}
						</span>
					))}
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.45, ease: "easeOut" }}
					className="flex flex-wrap items-center justify-center gap-2.5"
				>
					<a
						href={DMG_URL}
						download
						className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-claude-600 to-claude-600 text-white text-sm font-medium hover:from-claude-500 hover:to-claude-400 transition-all duration-200 shadow-[0_0_20px_rgba(217,119,87,0.35)]"
					>
						<Download className="w-4 h-4" /> Download for macOS
					</a>
					<a
						href={REPO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-zinc-700 text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-all duration-150"
					>
						<Github className="w-4 h-4" /> View on GitHub
					</a>
				</motion.div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.4 }}
					className="text-[11px] text-zinc-600 mt-5"
				>
					Universal build · Apple Silicon & Intel · ~130 MB
				</motion.p>
			</section>

			{/* ── Features ───────────────────────────────────────────────────────── */}
			<section className="relative py-24 px-4 border-t border-claude-500/10 overflow-hidden">
				<div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-72 rounded-full bg-claude-500/[0.07] blur-[100px] pointer-events-none" />

				<div className="max-w-5xl mx-auto relative">
					<motion.p
						{...fadeUp(0)}
						className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2"
					>
						Features
					</motion.p>
					<motion.h2
						{...fadeUp(0.05)}
						className="text-3xl sm:text-4xl font-display mb-12"
					>
						<ShineText>Everything a download manager should be</ShineText>
					</motion.h2>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{features.map((f, i) => (
							<motion.div key={f.title} {...fadeUp(i * 0.06)}>
								<Card>
									<div className="p-6 h-full">
										<div className="flex items-center justify-between mb-3">
											<span className="flex items-center justify-center w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900/40">
												{f.icon}
											</span>
											{f.badge && (
												<span className="text-[10px] px-2 py-0.5 rounded-full border border-claude-500/30 bg-claude-500/10 text-claude-300">
													{f.badge}
												</span>
											)}
										</div>
										<h3 className="text-sm font-medium text-zinc-200 mb-1.5">
											{f.title}
										</h3>
										<p className="text-xs text-zinc-500 leading-relaxed">
											{f.desc}
										</p>
										{f.link && (
											<a
												href={f.link.href}
												target="_blank"
												rel="noopener noreferrer"
												className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-claude-300 hover:text-claude-200 transition-colors"
											>
												{f.link.label}
												<ArrowRight className="w-3 h-3" />
											</a>
										)}
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Browser extension ──────────────────────────────────────────────── */}
			<section className="relative py-24 px-4 border-t border-claude-500/10 overflow-hidden">
				<div className="absolute top-1/2 right-0 -translate-y-1/2 w-[480px] h-80 rounded-full bg-claude-500/[0.07] blur-[100px] pointer-events-none" />

				<div className="max-w-5xl mx-auto relative">
					<motion.p
						{...fadeUp(0)}
						className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2"
					>
						Browser extension
					</motion.p>
					<motion.h2
						{...fadeUp(0.05)}
						className="text-3xl sm:text-4xl font-display mb-5"
					>
						<ShineText>Send downloads straight from your browser</ShineText>
					</motion.h2>

					<motion.p
						{...fadeUp(0.1)}
						className="text-sm text-zinc-400 max-w-2xl leading-relaxed mb-8"
					>
						The companion Chrome extension hands your browser downloads to
						Macget — cookies and headers included, so logged-in and
						gated downloads just work. Installed automatically the first time
						you open Macget, or grab it from the Chrome Web Store.
					</motion.p>

					<motion.div {...fadeUp(0.16)}>
						<a
							href={EXTENSION_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-claude-600 to-claude-600 text-white text-sm font-medium hover:from-claude-500 hover:to-claude-400 transition-all duration-200 shadow-[0_0_20px_rgba(217,119,87,0.35)]"
						>
							<Puzzle className="w-4 h-4" /> Add to Chrome
							<ArrowRight className="w-4 h-4" />
						</a>
					</motion.div>
				</div>
			</section>

			{/* ── Get started ────────────────────────────────────────────────────── */}
			<section className="relative py-24 px-4 border-t border-claude-500/10 overflow-hidden">
				<div className="absolute -bottom-20 -left-32 w-[500px] h-[500px] rounded-full bg-claude-500/10 blur-[100px] pointer-events-none" />

				<div className="max-w-5xl mx-auto relative">
					<motion.p
						{...fadeUp(0)}
						className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2"
					>
						Get started
					</motion.p>
					<motion.h2
						{...fadeUp(0.05)}
						className="text-3xl sm:text-4xl font-display mb-12"
					>
						<ShineText>Up and running in a minute</ShineText>
					</motion.h2>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
						{steps.map((s, i) => (
							<motion.div
								key={s.n}
								{...fadeUp(i * 0.07)}
								className="p-6 rounded-xl border border-zinc-800/70 bg-zinc-900/30"
							>
								<div className="w-8 h-8 rounded-full bg-gradient-to-br from-claude-500 to-claude-600 flex items-center justify-center text-xs font-bold text-white mb-4">
									{s.n}
								</div>
								<h3 className="text-sm font-medium text-zinc-200 mb-1.5">
									{s.title}
								</h3>
								<p className="text-xs text-zinc-500 leading-relaxed">
									{s.desc}
								</p>
							</motion.div>
						))}
					</div>

					<motion.div
						{...fadeUp(0.2)}
						className="p-5 rounded-xl border border-claude-500/15 bg-gradient-to-br from-claude-500/[0.06] to-claude-600/[0.04]"
					>
						<p className="text-xs text-zinc-400 mb-3">
							Prefer the terminal for the first-launch step? Clear the
							quarantine flag instead:
						</p>
						<code className="block text-[12px] font-mono text-claude-200 bg-black/40 border border-zinc-800 rounded-lg px-4 py-3 overflow-x-auto">
							xattr -dr com.apple.quarantine /Applications/Macget.app
						</code>
					</motion.div>

					<motion.div {...fadeUp(0.28)} className="mt-10 flex justify-center">
						<a
							href={DMG_URL}
							download
							className="flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-claude-600 to-claude-600 text-white text-sm font-medium hover:from-claude-500 hover:to-claude-400 transition-all duration-200 shadow-[0_0_20px_rgba(217,119,87,0.35)]"
						>
							<Download className="w-4 h-4" /> Download for macOS
						</a>
					</motion.div>
				</div>
			</section>

			{/* ── Footer ─────────────────────────────────────────────────────────── */}
			<footer className="border-t border-claude-500/10 py-8 px-4">
				<div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
					<Link
						href="/"
						className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors"
					>
						<ArrowLeft className="w-3 h-3" /> Back to portfolio
					</Link>
					<a
						href={REPO_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors"
					>
						Source on GitHub <ArrowRight className="w-3 h-3" />
					</a>
				</div>
			</footer>
		</div>
	);
}
