"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { compact } from "../data/stats";

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
    <section className="relative flex flex-col items-center justify-center min-h-dvh text-center px-4 pt-14 overflow-hidden">
      {/* restrained ambient glow — ONE orb, not five */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[520px] h-80 rounded-full bg-claude-600/10 blur-[110px] pointer-events-none" />

      {/* vertical social rail (desktop) */}
      <div className="hidden lg:flex flex-col items-center gap-4 absolute right-8 top-1/2 -translate-y-1/2">
        {rail.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
             className="text-zinc-600 hover:text-claude-300 transition-colors">{s.icon}</a>
        ))}
        <span className="w-px h-16 bg-line mt-2" />
      </div>

      {/* availability pill */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.4 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-claude-500/30 bg-claude-500/10 mb-8 font-mono text-[11px] tracking-wide text-claude-300">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-claude-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-claude-500" />
        </span>
        Available for work · Building in public
      </motion.div>

      {/* small avatar accent */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="mb-6">
        <div className="w-16 h-16 rounded-full ring-1 ring-claude-500/40 ring-offset-2 ring-offset-black overflow-hidden mx-auto">
          <Image src="/Profile.png" alt="Suryansh Chaudhary" width={64} height={64} className="object-cover w-full h-full" priority />
        </div>
      </motion.div>

      {/* OVERSIZED name */}
      <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
        className="font-display leading-[0.95] tracking-tight text-transparent bg-white bg-clip-text text-edge-outline
                   text-[15vw] sm:text-[13vw] lg:text-[9.5rem] mb-5">
        Suryansh<br className="sm:hidden" /> Chaudhary
      </motion.h1>

      {/* one-line ship-focused tagline */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28, duration: 0.4 }}
        className="text-base sm:text-lg text-zinc-400 max-w-xl mb-8">
        I build in public — shipping <span className="text-zinc-200">MacGet</span> and production AI systems.
      </motion.p>

      {/* CTAs — one primary */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}
        className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
        <a href="#contact" className="px-6 py-2.5 rounded-full bg-claude-600 text-white text-sm font-medium hover:bg-claude-500 transition-colors shadow-[0_0_20px_rgba(217,119,87,0.35)]">
          Let&apos;s build something
        </a>
        <a href="#projects" className="px-6 py-2.5 rounded-full border border-line text-zinc-300 text-sm hover:border-zinc-500 hover:text-white transition-colors">
          View work
        </a>
      </motion.div>

      {/* REAL proof row */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.4 }}
        className="flex items-center gap-8 font-mono text-xs text-zinc-500">
        <span className="flex items-center gap-1.5"><Github className="w-3.5 h-3.5 text-claude-400" /> {compact(stats.githubStars)} stars</span>
        <span className="w-px h-4 bg-line" />
        <span className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5 text-claude-400" /> {compact(stats.macgetDownloads)} downloads</span>
        <span className="w-px h-4 bg-line hidden sm:block" />
        <a href="/suryansh.pdf" download className="hidden sm:flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
          <Download className="w-3.5 h-3.5" /> Resume
        </a>
      </motion.div>

      <a href="#now" aria-label="Scroll" className="absolute bottom-8 text-zinc-700 hover:text-zinc-400 transition-colors">
        <ArrowDown className="w-5 h-5 animate-bounce" />
      </a>
    </section>
  );
}
