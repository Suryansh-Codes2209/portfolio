"use client";

import { useReducedMotion } from "framer-motion";
import { ArrowRight, Download, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { projects } from "../../data/projects";
import { ExpandableCard } from "../ui/expandable-card";
import { Chapter } from "../vox/chapter";
import { Highlight } from "../vox/highlight";
import { KineticHeading } from "../vox/kinetic-heading";
import { RemotionClip } from "../vox/remotion-clip";
import { Stamp } from "../vox/stamp";
import { TapedCard, tiltFor } from "../vox/taped-card";

const MACGET_DMG_URL = "https://github.com/Suryansh-Codes2209/Macget/releases/latest/download/Macget.dmg";

export function ProjectsSection() {
  const reduceMotion = useReducedMotion();
  const [heroProject, ...restProjects] = projects;
  const [stats, setStats] = useState({ githubStars: 0, macgetDownloads: 0 });

  // Same endpoint the hero uses; the response is cached for a day.
  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  return (
    <Chapter id="projects" number={4} kicker="Work">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <KineticHeading text="He doesn't just talk about it. He ships." highlight="ships." />
        <Link href="/projects" className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-fg-subtle hover:text-fg sm:flex">
          All case files <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* ── Case 01: MacGet ─────────────────────────────────────────────── */}
      <div className="mt-16 grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="mb-5 flex items-center gap-4">
            <Image src="/macget-icon.png" alt="MacGet" width={60} height={60} className="-rotate-6 [filter:drop-shadow(0_3px_0_var(--sticker))_drop-shadow(0_8px_10px_rgba(0,0,0,0.25))]" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">Case 01 · Flagship · Open source</p>
              <h3 className="font-serif text-5xl leading-none text-fg">MacGet</h3>
            </div>
          </div>
          <p className="mb-6 text-[15px] leading-relaxed text-fg-muted">
            A fast, multi-threaded download manager for macOS — <Highlight>chunked HTTP downloads</Highlight>, browser-extension capture, and
            YouTube/HLS video via bundled yt-dlp. SwiftUI + an actor-based engine.
          </p>
          <div className="mb-8 flex flex-wrap gap-3">
            {["Free", "Open source", "macOS 26+"].map((b, i) => (
              <Stamp key={b} rotate={[-4, 3, -2][i]} className="text-[10px]">
                {b}
              </Stamp>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a href={MACGET_DMG_URL} download className="inline-flex items-center gap-2 bg-fg px-5 py-2.5 text-sm font-medium text-bg shadow-paper transition-transform hover:-rotate-1">
              <Download className="h-4 w-4" /> Download
            </a>
            {heroProject.github && (
              <a href={heroProject.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-fg px-5 py-2 text-sm text-fg transition-colors hover:bg-highlight hover:text-highlight-ink">
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
            <a href="https://macget.suryansh.work" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm text-fg-muted hover:text-accent-text">
              Learn more <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="relative lg:col-span-7">
          <TapedCard seed="macget-clip" fig="Fig. 04 — MacGet, explained · Remotion" tape="corners" className="p-2.5">
            <RemotionClip id="macget" stats={stats} poster="/video/posters/macget.jpg" label="Animated explainer of MacGet's chunked downloads and download stats" />
          </TapedCard>

          {/* the real demo, as a polaroid stuck on the corner */}
          <div className="relative z-10 -mt-10 ml-auto w-[62%] rotate-[4deg] bg-[#fdfbf6] p-2.5 pb-9 shadow-paper sm:-mt-16 sm:w-[48%] dark:bg-[#e9e2d3]">
            <span aria-hidden className="tape absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-3" />
            <video
              src="/macget-demo.mp4"
              poster="/macget-icon.png"
              muted
              loop
              playsInline
              autoPlay={!reduceMotion}
              controls={!!reduceMotion}
              preload="none"
              aria-label="MacGet demo"
              className="halftone aspect-video w-full bg-[#1a1714] object-cover"
            />
            <p className="absolute bottom-2 left-3 font-serif text-lg italic text-[#4a443c]">the real thing ↑</p>
          </div>
        </div>
      </div>

      {/* ── the other case files ────────────────────────────────────────── */}
      <div className="mt-20 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {restProjects.map((project, i) => {
          const [name, kind] = project.title.split(" — ");
          return (
            <ExpandableCard
              key={project.title}
              label={name}
              preview={
                <div style={{ transform: `rotate(${tiltFor(project.title)}deg)` }} className="paper ruled relative h-full p-6 pt-8 transition-transform duration-300 hover:-translate-y-1">
                  <span aria-hidden className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff8a6b,#c15f3c_55%,#7a2e17)] shadow-[0_3px_4px_rgba(0,0,0,0.35)]" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">
                    Case {String(i + 2).padStart(2, "0")}
                    {kind ? ` · ${kind}` : ""}
                  </p>
                  <h3 className="mb-2 mt-1 font-serif text-3xl text-fg">{name}</h3>
                  <p className="line-clamp-3 text-[13px] leading-relaxed text-fg-subtle">{project.description}</p>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-fg-faint">Open file →</p>
                </div>
              }
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">
                Case {String(i + 2).padStart(2, "0")} · {project.date}
              </p>
              <h3 className="mb-4 mt-1 font-serif text-5xl text-fg">{name}</h3>
              {kind && <p className="mb-5 text-sm text-fg-subtle">{kind}</p>}
              <p className="text-[15px] leading-relaxed text-fg-muted">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="border border-fg px-2 py-0.5 font-mono text-[11px] text-fg">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-fg px-4 py-2 text-sm text-bg">
                    <ExternalLink className="h-4 w-4" /> Visit
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-fg px-4 py-1.5 text-sm text-fg">
                    <Github className="h-4 w-4" /> Source
                  </a>
                )}
              </div>
            </ExpandableCard>
          );
        })}
      </div>

      <Link href="/projects" className="mt-12 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-fg-subtle hover:text-fg sm:hidden">
        All case files <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </Chapter>
  );
}
