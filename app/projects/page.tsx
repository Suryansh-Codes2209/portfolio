"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, ExternalLink, Github, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { projects } from "../data/projects";
import { PageNav } from "../components/page-nav";
import { SiteFooter } from "../components/site-footer";
import { KineticHeading } from "../components/vox/kinetic-heading";
import { RemotionClip } from "../components/vox/remotion-clip";
import { Stamp } from "../components/vox/stamp";
import { tiltFor } from "../components/vox/taped-card";

const MACGET_DMG_URL = "https://github.com/Suryansh-Codes2209/Macget/releases/latest/download/Macget.dmg";

/** A red push-pin at the top of a card. */
function Pin() {
  return (
    <span
      aria-hidden
      className="absolute -top-2.5 left-1/2 z-10 h-5 w-5 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ff8a6b,#c15f3c_55%,#7a2e17)] shadow-[0_3px_4px_rgba(0,0,0,0.35)]"
    />
  );
}

export default function ProjectsPage() {
  const [lead, ...rest] = projects;
  const [leadName, leadKind] = lead.title.split(" — ");
  const [stats, setStats] = useState({ githubStars: 0, macgetDownloads: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg text-fg">
      <PageNav current="Projects" />

      <header className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">
            <span className="text-accent-text">Work</span> — the evidence wall
          </p>
          <Stamp rotate={-5}>{projects.length} cases · all shipped</Stamp>
        </div>
        <KineticHeading as="h1" text="The case files" highlight="case files" className="sm:text-7xl" />
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-fg-muted">
          A selection of projects I&apos;ve built — some from work, some for fun. Every one of them is live, linked, and
          open to inspection.
        </p>
      </header>

      {/* ── the cork board ─────────────────────────────────────────────── */}
      <main className="relative border-y-2 border-[#8a6a3f] bg-[#c9a97a] px-5 py-20 sm:px-8 dark:border-[#3b2c1a] dark:bg-[#4a3a26]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(90,55,20,0.35)_1.4px,transparent_1.6px),radial-gradient(rgba(255,235,200,0.25)_1px,transparent_1.4px)] [background-position:0_0,9px_7px] [background-size:17px_19px,23px_21px]"
        />

        <div className="relative mx-auto max-w-6xl">
          {/* Case 01 — the lead file, with its explainer clip */}
          <motion.article
            initial={{ opacity: 0, y: -40, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: -0.6 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", damping: 16, stiffness: 120 }}
            className="paper ruled relative grid gap-10 p-7 sm:p-10 lg:grid-cols-12"
          >
            <Pin />
            <div className="lg:col-span-5">
              <div className="mb-5 flex items-center gap-4">
                <Image
                  src="/macget-icon.png"
                  alt=""
                  width={64}
                  height={64}
                  className="-rotate-6 [filter:drop-shadow(0_3px_0_var(--sticker))_drop-shadow(0_8px_10px_rgba(0,0,0,0.25))]"
                />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">
                    Case 01 · {leadKind} · {lead.date}
                  </p>
                  <h2 className="font-serif text-5xl leading-none text-fg">{leadName}</h2>
                </div>
              </div>
              <p className="mb-6 text-[15px] leading-relaxed text-fg-muted">
                {/* marker on whatever follows the "what it is:" lead-in */}
                {lead.description.includes(": ") ? (
                  <>
                    {lead.description.slice(0, lead.description.indexOf(": ") + 2)}
                    <span className="marker">{lead.description.slice(lead.description.indexOf(": ") + 2)}</span>
                  </>
                ) : (
                  lead.description
                )}
              </p>
              <div className="mb-7 flex flex-wrap gap-2">
                {lead.tags.map((tag) => (
                  <span key={tag} className="border border-fg px-2 py-0.5 font-mono text-[11px] text-fg">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <a href={MACGET_DMG_URL} download className="inline-flex items-center gap-2 bg-fg px-5 py-2.5 text-sm font-medium text-bg shadow-paper transition-transform hover:-rotate-1">
                  <Download className="h-4 w-4" /> Download
                </a>
                {lead.github && (
                  <a href={lead.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border-2 border-fg px-4 py-2 text-sm text-fg transition-colors hover:bg-highlight hover:text-highlight-ink">
                    <Github className="h-4 w-4" /> Source
                  </a>
                )}
                {lead.productHunt && (
                  <a href={lead.productHunt} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2 py-2 text-sm text-accent-text hover:underline">
                    <Rocket className="h-4 w-4" /> Live on Product Hunt
                  </a>
                )}
              </div>
            </div>
            <figure className="m-0 lg:col-span-7">
              <div className="bg-surface p-2 shadow-paper">
                <RemotionClip id="macget" stats={stats} poster="/video/posters/macget.jpg" label="Animated explainer of MacGet" />
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
                Fig. 01 — MacGet, explained · rendered live with Remotion
              </figcaption>
            </figure>
          </motion.article>

          {/* the other cases, pinned up and joined by red string */}
          <div className="relative mt-20 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((project, i) => {
              const [name, kind] = project.title.split(" — ");
              return (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: -50, rotate: tiltFor(project.title, 10) }}
                  whileInView={{ opacity: 1, y: 0, rotate: tiltFor(project.title, 2.5) }}
                  whileHover={{ rotate: 0, y: -6 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", damping: 14, stiffness: 130, delay: i * 0.08 }}
                  className="paper ruled relative flex flex-col p-7 pt-9"
                >
                  <Pin />
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">
                    Case {String(i + 2).padStart(2, "0")} · {project.date}
                  </p>
                  <h2 className="mt-1 font-serif text-4xl leading-none text-fg">{name}</h2>
                  {kind && <p className="mt-2 text-sm italic text-fg-subtle">{kind}</p>}
                  <p className="mt-4 flex-1 text-[13px] leading-relaxed text-fg-muted">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="border border-line-strong px-2 py-0.5 font-mono text-[10px] text-fg-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center gap-4 border-t border-dashed border-line-strong pt-4">
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-fg hover:text-accent-text">
                        <ExternalLink className="h-3.5 w-3.5" /> Visit
                      </a>
                    )}
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-fg hover:text-accent-text">
                        <Github className="h-3.5 w-3.5" /> Source
                      </a>
                    )}
                    {project.productHunt && (
                      <a href={project.productHunt} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-accent-text hover:underline">
                        <Rocket className="h-3.5 w-3.5" /> Product Hunt
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </main>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <p className="font-serif text-3xl text-fg sm:text-4xl">
          Want the story behind a case? <Link href="/blog" className="marker hover:underline">Read the build logs</Link> or{" "}
          <Link href="/contact" className="inline-flex items-center gap-1 text-accent-text underline decoration-2 underline-offset-4">
            start a new one <ArrowUpRight className="h-6 w-6" />
          </Link>
        </p>
      </section>

      <SiteFooter />
    </div>
  );
}
