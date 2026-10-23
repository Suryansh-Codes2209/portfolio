"use client";

import { ArrowUpRight, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SOCIALS } from "../data/site";
import { compact } from "../data/stats";
import { NumberTicker } from "./ui/number-ticker";
import { Annotate } from "./vox/annotate";
import { ExplainerModal } from "./vox/explainer-modal";
import { Highlight } from "./vox/highlight";
import { RemotionClip } from "./vox/remotion-clip";
import { Stamp } from "./vox/stamp";

const rail = [
  { icon: <Github className="w-4 h-4" />, href: SOCIALS.github, label: "GitHub" },
  { icon: <Twitter className="w-4 h-4" />, href: SOCIALS.x, label: "X" },
  { icon: <Linkedin className="w-4 h-4" />, href: SOCIALS.linkedin, label: "LinkedIn" },
  { icon: <Mail className="w-4 h-4" />, href: `mailto:${SOCIALS.email}`, label: "Email" },
];

/**
 * Chapter 00 — the cold open. The name, lede and CTA are plain HTML that
 * paints immediately (LCP); the Remotion cold-open clip mounts afterwards
 * over a poster still of itself.
 */
export function Hero() {
  const [stats, setStats] = useState({ githubStars: 0, macgetDownloads: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setStats(d);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-5 pb-16 pt-24 sm:px-10 lg:px-16 xl:px-24">
      <div className="grid w-full items-center gap-14 lg:grid-cols-12">
        {/* ── copy ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 lg:col-span-6">
          <div className="mb-8 flex flex-wrap items-center gap-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">
              <span className="text-accent-text">Fig. 00</span> — The subject
            </p>
            <Stamp rotate={-4}>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Building in public
            </Stamp>
          </div>

          <h1 className="font-serif text-[16vw] leading-[0.88] tracking-tight text-fg sm:text-[11vw] lg:text-[7.2vw]">
            Suryansh{" "}
            <br />
            <Highlight delay={0.35}>Chaudhary</Highlight>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-muted">
            Full-Stack <span className="text-fg">AI Engineer</span>. I build LangGraph agents in production and ship{" "}
            <Annotate kind="underline" delay={0.9}>
              <a href="#projects" className="font-medium text-fg">
                MacGet
              </a>
            </Annotate>
            , a free download manager for the Mac, in public.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 bg-fg px-6 py-3 text-sm font-medium text-bg shadow-paper transition-transform hover:-rotate-1"
            >
              Let&apos;s collaborate
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <ExplainerModal stats={stats} />
          </div>

          {/* proof, as sticky notes */}
          <div className="mt-12 flex flex-wrap items-end gap-5">
            {[
              { n: stats.githubStars, label: "GitHub stars", icon: <Github className="h-3.5 w-3.5" />, tint: "bg-[#ffd9cf] dark:bg-[#3a221c]", r: "rotate-2" },
              { n: stats.macgetDownloads, label: "MacGet downloads", icon: <Download className="h-3.5 w-3.5" />, tint: "bg-[#fff3b0] dark:bg-[#3a3418]", r: "-rotate-2" },
            ].map((s) => (
              <div key={s.label} className={`${s.tint} ${s.r} px-5 py-4 shadow-paper`}>
                <p className="font-serif text-4xl leading-none text-[#1a1714] dark:text-fg">
                  <NumberTicker value={s.n} format={compact} />
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#4a443c] dark:text-fg-muted">
                  {s.icon} {s.label}
                </p>
              </div>
            ))}
            <div className="flex items-center gap-5 pb-1">
              {rail.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-fg-subtle transition-colors hover:text-accent-text"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── the "TV on paper" ────────────────────────────────────────── */}
        <div className="relative lg:col-span-6">
          <figure className="relative m-0 rotate-[1.5deg]">
            <div className="paper relative p-2.5 pb-3">
              <span aria-hidden className="tape absolute -top-3 left-8 z-10 h-6 w-24 -rotate-6" />
              <span aria-hidden className="tape absolute -top-3 right-8 z-10 h-6 w-24 rotate-6" />
              <RemotionClip
                id="cold-open"
                label="Animated cold open: Who is Suryansh Chaudhary?"
                fallback={
                  <Image src="/video/posters/cold-open.jpg" alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                }
              />
            </div>
            <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
              Fig. 01 — Cold open · rendered live with Remotion · scroll to travel →
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
