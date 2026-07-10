"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { compact } from "../data/stats";
import { ShineText } from "./shine-text";

const rail = [
  { icon: <Github className="w-4 h-4" />, href: "https://github.com/Suryansh-Codes2209", label: "GitHub" },
  { icon: <Twitter className="w-4 h-4" />, href: "https://x.com/Suryansh_2001", label: "X" },
  { icon: <Linkedin className="w-4 h-4" />, href: "https://www.linkedin.com/in/suryansh-chaudhary-2209/", label: "LinkedIn" },
  { icon: <Mail className="w-4 h-4" />, href: "mailto:suryansh.codes2001@gmail.com", label: "Email" },
];

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
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 pt-14">
      {/* ambient glow behind the subject */}
      <div className="pointer-events-none absolute left-1/2 top-[24%] h-[420px] w-[600px] -translate-x-1/2 rounded-full bg-claude-600/16 blur-[130px]" />

      {/* top-left: availability + who I am */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="absolute left-5 top-20 z-30 max-w-[15rem] sm:left-8 sm:top-24"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-soft px-3 py-1.5 font-mono text-[11px] tracking-wide text-accent-text backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Building in public
        </div>
        <p className="mt-4 text-sm leading-relaxed text-fg-muted">
          Full-Stack <span className="text-fg">AI Engineer</span> — I build in public, shipping{" "}
          <span className="text-fg">MacGet</span> &amp; production AI systems.
        </p>
      </motion.div>

      {/* right: primary CTA + vertical social rail (desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="absolute right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-7 sm:flex"
      >
        <a
          href="#contact"
          className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-[0_0_24px_rgba(217,119,87,0.4)] transition-opacity hover:opacity-90"
        >
          Let&apos;s collaborate
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
        <div className="flex flex-col items-center gap-4">
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
          <span className="mt-1 h-14 w-px bg-line" />
        </div>
      </motion.div>

      {/* ── Centre stack: PHOTO (upper) then NAME (under it) ─────────────── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* PHOTO — soft feathered edges that melt into the background */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="pointer-events-none flex justify-center"
        >
          <Image
            src="/hero-portrait-vector.png"
            alt="Suryansh Chaudhary"
            width={2000}
            height={1600}
            priority
            className="h-[40vh] w-auto max-w-none object-contain sm:h-[46vh] lg:h-[52vh]
                       [-webkit-mask-image:radial-gradient(40%_70%_at_50%_42%,#000_40%,transparent_75%)]
                       [mask-image:radial-gradient(40%_70%_at_50%_42%,#000_40%,transparent_75%)]"
          />
        </motion.div>

        {/* NAME — directly under the photo, tucked slightly beneath it */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          aria-label="Suryansh Chaudhary"
          className="-mt-[4vh] select-none text-center font-display leading-[0.85] tracking-tighter text-fg
                     text-[14vw] sm:-mt-[4vh] sm:text-[12vw] lg:text-[9.5vw]"
        >
          <ShineText highlight="var(--accent)">
            Suryansh
            <br />
            Chaudhary
          </ShineText>
        </motion.h1>
      </div>

      {/* mobile CTAs */}
      <div className="absolute inset-x-0 bottom-24 z-30 flex justify-center gap-2.5 px-4 sm:hidden">
        <a
          href="#contact"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg shadow-[0_0_20px_rgba(217,119,87,0.35)]"
        >
          Let&apos;s collaborate
        </a>
        <a href="#projects" className="rounded-full border border-line px-5 py-2.5 text-sm text-fg-muted">
          Work
        </a>
      </div>

      {/* bottom: real proof row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute inset-x-0 bottom-7 z-30 flex items-center justify-center gap-6 font-mono text-xs text-fg-muted"
      >
        <span className="flex items-center gap-1.5">
          <Github className="h-3.5 w-3.5 text-accent" /> {compact(stats.githubStars)} stars
        </span>
        <span className="h-4 w-px bg-line" />
        <span className="flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5 text-accent" /> {compact(stats.macgetDownloads)} downloads
        </span>
        <span className="hidden h-4 w-px bg-line sm:block" />
        <a href="/suryansh.pdf" download className="hidden items-center gap-1.5 transition-colors hover:text-fg sm:flex">
          <Download className="h-3.5 w-3.5" /> Resume
        </a>
      </motion.div>
    </section>
  );
}
