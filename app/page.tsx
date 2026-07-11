"use client";

import { allBlogs } from "contentlayer/generated";
import { projects } from "./data/projects";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight, Check, Cloud, Code2, Copy, Cpu,
  Database, Download, ExternalLink, Github, Layers,
  Linkedin, Mail, Menu, Server, Twitter, X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Card } from "./components/card";
import { Hero } from "./components/hero";
import { HeroIntro } from "./components/hero-intro";
import { NowBento } from "./components/now-bento";
import { TechStack } from "./components/tech-stack";
import { ShineText } from "./components/shine-text";
import { ThemeToggle } from "./components/theme-toggle";

// ─── animated counter ─────────────────────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const duration = 1400;
    const frame = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(frame);
      else setCount(target);
    };
    requestAnimationFrame(frame);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── data ─────────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Now",      href: "#now"      },
  { label: "About",    href: "#about"    },
  { label: "Stack",    href: "#stack"    },
  { label: "Projects", href: "#projects" },
  { label: "Blog",     href: "/blog"     },
  { label: "Resume",   href: "#resume"   },
  { label: "Contact",  href: "#contact"  },
];

const recommendations = [
  {
    name: "Prem Ranjan",
    initials: "PR",
    tagline: "Developer · Mentor · Interviewer · Java · React · Microservices · AWS · Python · AI/ML · LLM",
    relation: "Worked with Suryansh on the same team",
    date: "January 16, 2025",
    source: "LinkedIn",
    sourceUrl: "https://www.linkedin.com/in/suryansh-chaudhary-2209/details/recommendations/",
    paragraphs: [
      "I had the privilege of mentoring Suryansh, and I've been genuinely impressed by his technical expertise and problem-solving abilities. He's highly skilled in web development, with a strong grasp of Next.js, React.js, and JavaScript frameworks, and he has hands-on experience working with OpenAI technologies and AI/ML applications.",
      "Suryansh approaches challenges with a clear, analytical mindset, consistently delivering thoughtful and effective solutions. His dedication to learning, coupled with his ability to share knowledge and collaborate, makes him a standout professional. I'm confident he'll excel in any role he takes on.",
    ],
  },
];

const experience = [
  {
    role: "Full Stack AI Engineer",
    company: "Spiral Kite Labs",
    period: "2024 – Present",
    type: "Full-time",
    desc: "Own the full product stack of an early-stage AI startup — LangGraph agent architecture, LangChain tool integrations, FastAPI backend, Google Cloud Run infrastructure, and the React frontend. Building a financial research AI agent that autonomously retrieves market data, reasons across sources, and produces structured analyst-grade reports.",
    tech: ["LangGraph", "LangChain", "FastAPI", "Python", "React", "Google Cloud Run", "Docker"],
  },
  {
    role: "Software Developer",
    company: "AutoText",
    period: "2023 – 2024",
    type: "Full-time",
    desc: "Shipped production features across the full stack — React frontend, Django / FastAPI backend, PostgreSQL. Owned API integrations and refactored the core data pipeline for high-frequency workloads.",
    tech: ["Django", "FastAPI", "React", "PostgreSQL", "REST APIs"],
  },
  {
    role: "Intern — Databases & Algorithms",
    company: "NITI Aayog (Government of India)",
    period: "2022 – 2023",
    type: "Part-time · 1.5 yrs",
    desc: "Worked on data pipelines and database systems supporting policy research. Applied algorithms and data-structure techniques to large-scale government datasets.",
    tech: ["Python", "Databases", "Algorithms", "Data Analysis"],
  },
  {
    role: "Summer Intern",
    company: "OnGraph Technologies",
    period: "2021",
    type: "Internship",
    desc: "Contributed to product work using NoSQL databases, wrote technical documentation, and participated in agile sprints and code reviews.",
    tech: ["NoSQL", "Technical Writing", "Agile"],
  },
];

const education = [
  {
    degree: "B.Tech — Computer Science (AI)",
    institution: "Poornima Group",
    period: "2019 – 2023",
  },
];

const socials = [
  { icon: <Github className="w-4 h-4" />, label: "GitHub",     handle: "Suryansh-Codes2209",         href: "https://github.com/Suryansh-Codes2209" },
  { icon: <Twitter className="w-4 h-4" />, label: "Twitter",   handle: "@Suryansh_2001",               href: "https://x.com/Suryansh_2001" },
  { icon: <Linkedin className="w-4 h-4" />, label: "LinkedIn", handle: "suryansh-chaudhary-2209",      href: "https://www.linkedin.com/in/suryansh-chaudhary-2209/" },
  { icon: <Mail className="w-4 h-4" />, label: "Email",        handle: "suryansh.codes2001@gmail.com", href: "mailto:suryansh.codes2001@gmail.com" },
];

// ─── animation helper ─────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
});

const MACGET_DMG_URL =
  "https://github.com/Suryansh-Codes2209/Macget/releases/latest/download/Macget.dmg";

const EMAIL = "suryansh.codes2001@gmail.com";

// ─── page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const reduceMotion = useReducedMotion();
  const [heroProject, ...restProjects] = projects;
  const latestPosts = allBlogs
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  // contact form
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  // copy-email micro-interaction
  const [copied, setCopied] = useState(false);
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.open(`mailto:suryansh.codes2001@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="overflow-x-hidden">
      <HeroIntro />
      {/* ── Sticky nav ─────────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b border-line bg-bg/70">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="font-display text-sm text-fg hover:text-accent-text transition-colors">
            Suryansh.
          </Link>

          {/* desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-xs text-fg-subtle hover:text-fg transition-colors duration-150">
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/suryansh.pdf"
              download
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-line text-fg-subtle hover:border-line-strong hover:text-fg transition-all duration-150"
            >
              <Download className="w-3 h-3" /> Resume
            </a>
            <ThemeToggle className="hidden sm:flex" />
            {/* hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="lg:hidden flex items-center justify-center w-8 h-8 text-fg-muted hover:text-fg transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        <motion.div
          initial={false}
          animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden lg:hidden border-t border-line"
        >
          <div className="max-w-5xl mx-auto px-5 py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-fg-muted hover:text-fg py-2 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/suryansh.pdf"
              download
              className="flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg py-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download Resume
            </a>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-fg-muted">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </motion.div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── Now / Building ──────────────────────────────────────────────────── */}
      <section id="now" className="relative py-24 px-4 border-t border-line overflow-hidden">
        <div className="absolute -top-16 right-1/4 w-[480px] h-80 rounded-full bg-claude-500/[0.08] blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-claude-600/[0.06] blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <motion.p {...fadeUp(0)} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-fg-faint mb-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-claude-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-claude-500" />
            </span>
            Now
          </motion.p>
          <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-3"><ShineText>What I&apos;m building</ShineText></motion.h2>
          <motion.p {...fadeUp(0.08)} className="text-sm text-fg-subtle mb-10 max-w-xl leading-relaxed">
            A live snapshot of what I&apos;m shipping right now — updated as things move.
          </motion.p>

          <NowBento />

          <motion.p {...fadeUp(0.2)} className="text-[11px] text-fg-faint mt-6">
            Last updated June 2026
          </motion.p>
        </div>
      </section>

      {/* ── About ───────────────────────────────────────────────────────────── */}
      <section id="about" className="relative py-24 px-4 border-t border-line overflow-hidden">
        <div className="absolute -bottom-20 -left-32 w-[500px] h-[500px] rounded-full bg-claude-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <motion.p {...fadeUp(0)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text mb-2">About Me</motion.p>
          <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-12"><ShineText>Building AI agents that actually ship</ShineText></motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 mb-14">
            <motion.div {...fadeUp(0.08)} className="lg:col-span-3 space-y-4 text-[15px] text-fg-muted leading-relaxed">
              <p>
                I&apos;m a <strong className="text-fg font-medium">Full Stack AI Engineer</strong> building financial research AI agents — production systems that pull live market data, reason through financials, and generate analyst-grade reports, fully automated.
              </p>
              <p>
                Currently at <strong className="text-fg font-medium">Spiral Kite Labs</strong>, I own the full stack: LangGraph agent architecture, LangChain tool integrations, FastAPI backend, Google Cloud Run infrastructure, and the React frontend that makes it usable.
              </p>
              <p>When you&apos;re the AI + DevOps + backend + frontend person at a startup, you stop thinking in layers and start thinking in outcomes.</p>
            </motion.div>

            {/* animated stat cards */}
            <motion.div {...fadeUp(0.12)} className="lg:col-span-2 grid grid-cols-2 gap-3">
              {[
                { label: "Building",       target: 3,  suffix: "+ yr" },
                { label: "AI Agents",      target: 5,  suffix: "+" },
                { label: "LLM APIs",       target: 6,  suffix: "+" },
                { label: "Technologies",   target: 25, suffix: "+" },
              ].map((s) => (
                <div key={s.label} className="p-5 rounded-xl border border-line bg-surface hover:border-line-strong hover:-translate-y-0.5 transition-all duration-200">
                  <p className="text-xl font-display text-fg">
                    <Counter target={s.target} suffix={s.suffix} />
                  </p>
                  <p className="text-[11px] text-fg-faint mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Cpu className="w-4 h-4 text-accent-text" />, title: "AI Engineering", desc: "LangGraph + LangChain agents with conditional routing, tool orchestration, and grounded financial reasoning." },
              { icon: <Server className="w-4 h-4 text-accent-text" />, title: "Full Stack Ownership", desc: "FastAPI + React, streaming LLM responses, TypeScript SDKs, and agent state management end-to-end." },
              { icon: <Cloud className="w-4 h-4 text-accent-text" />, title: "Cloud & DevOps", desc: "Docker, Google Cloud Run, CI/CD, and cost-optimised inference routing for AI workloads in production." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp(i * 0.07)}
                className="p-5 rounded-xl border border-line bg-surface hover:border-line-strong hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="text-sm font-medium text-fg mb-1.5">{item.title}</h3>
                <p className="text-xs text-fg-subtle leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ──────────────────────────────────────────────────────── */}
      <TechStack />

      {/* ── Projects ────────────────────────────────────────────────────────── */}
      <section id="projects" className="relative py-24 px-4 border-t border-line overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-72 rounded-full bg-claude-500/[0.07] blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.p {...fadeUp(0)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text mb-2">Work</motion.p>
              <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display"><ShineText>Featured Projects</ShineText></motion.h2>
            </div>
            <motion.div {...fadeUp(0.05)}>
              <Link href="/projects" className="hidden sm:flex items-center gap-1.5 text-xs text-fg-subtle hover:text-fg transition-colors duration-150">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* featured MacGet block */}
          <motion.div {...fadeUp(0.08)} className="mb-6">
            <Card>
              <div className="grid lg:grid-cols-2">
                {/* info */}
                <div className="relative z-20 p-7 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Image src="/macget-icon.png" alt="MacGet" width={52} height={52} className="rounded-[14px] shadow-[0_0_24px_rgba(217,119,87,0.25)]" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-accent-text">Flagship · Open source</p>
                      <h3 className="text-xl font-display text-fg leading-tight">MacGet</h3>
                    </div>
                  </div>
                  <p className="text-sm text-fg-muted leading-relaxed mb-4 max-w-sm">
                    A fast, multi-threaded download manager for macOS — chunked HTTP downloads, browser-extension capture, and YouTube/HLS video via bundled yt-dlp. SwiftUI + an actor-based engine.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Free", "Open source", "macOS 26+"].map((b) => (
                      <span key={b} className="text-[11px] px-2.5 py-1 rounded-full border border-accent/30 bg-accent-soft text-accent-text">{b}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <a href={MACGET_DMG_URL} download className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-fg text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-[0_0_20px_rgba(217,119,87,0.35)]">
                      <Download className="w-4 h-4" /> Download
                    </a>
                    {heroProject.github && (
                      <a href={heroProject.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-line text-fg-muted text-sm hover:border-line-strong hover:text-fg transition-all duration-150">
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    <Link href="/macget" className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-fg-muted hover:text-accent-text transition-colors">
                      Learn more <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* media frame */}
                <div className="relative z-20 p-7 sm:p-8 lg:pl-0 flex items-center">
                  <div className="w-full rounded-xl overflow-hidden border border-line bg-surface shadow-[0_0_40px_rgba(0,0,0,0.45)]">
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line bg-surface-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                      <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                      <span className="w-2.5 h-2.5 rounded-full bg-line-strong" />
                    </div>
                    <div className="relative aspect-video bg-bg-2">
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
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restProjects.map((project, i) => (
              <motion.div key={project.title} {...fadeUp(i * 0.08)}>
                <Card>
                  <div className="block p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="text-sm font-medium text-fg-muted group-hover:text-fg transition-colors leading-snug">{project.title}</h3>
                      <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github className="w-3.5 h-3.5 text-fg-faint hover:text-fg-muted transition-colors" />
                          </a>
                        )}
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" aria-label="Live site">
                            <ExternalLink className="w-3.5 h-3.5 text-fg-faint hover:text-fg-muted transition-colors" />
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-fg-subtle leading-relaxed line-clamp-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded border border-line text-fg-faint">{tag}</span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.28)} className="mt-8 sm:hidden">
            <Link href="/projects" className="flex items-center gap-1.5 text-xs text-fg-subtle hover:text-fg transition-colors duration-150">
              View all projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Recommendation ──────────────────────────────────────────────────── */}
      <section id="testimonials" className="relative py-24 px-4 border-t border-line overflow-hidden">
        <div className="absolute top-10 left-0 w-96 h-96 rounded-full bg-claude-600/[0.06] blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto relative">
          <motion.p {...fadeUp(0)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text mb-2">Recommendation</motion.p>
          <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-3"><ShineText>What people say</ShineText></motion.h2>
          <motion.p {...fadeUp(0.08)} className="text-sm text-fg-subtle mb-12 max-w-md">A word from someone I&apos;ve built with.</motion.p>

          <div className="space-y-6">
            {recommendations.map((r, i) => (
              <motion.div key={r.name} {...fadeUp(i * 0.08)}>
                <Card>
                  <div className="relative p-8 sm:p-10">
                    {/* decorative quote mark */}
                    <span
                      aria-hidden
                      className="absolute -top-2 left-6 font-display text-[80px] leading-none text-claude-500/20 select-none"
                    >
                      &ldquo;
                    </span>

                    <div className="flex items-center justify-between mb-6">
                      <a
                        href={r.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-accent-text border border-accent/30 bg-accent-soft px-2.5 py-1 rounded-full hover:border-accent/50 hover:opacity-90 transition-colors"
                      >
                        <Linkedin className="w-3 h-3" /> via {r.source}
                      </a>
                      <span className="text-[10px] text-fg-faint">{r.date}</span>
                    </div>

                    <div className="space-y-4 text-[15px] text-fg-muted leading-relaxed mb-8">
                      {r.paragraphs.map((p, j) => (
                        <p key={j}>{p}</p>
                      ))}
                    </div>

                    <div className="flex items-start gap-4 pt-6 border-t border-line">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-claude-500 to-claude-600 flex items-center justify-center text-xs font-bold text-accent-fg flex-shrink-0">
                        {r.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-fg">{r.name}</p>
                        <p className="text-[11px] text-fg-subtle leading-relaxed">{r.tagline}</p>
                        <p className="text-[10px] text-fg-faint mt-1">{r.relation}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog ────────────────────────────────────────────────────────────── */}
      <section id="blog" className="relative py-24 px-4 border-t border-line overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-72 rounded-full bg-claude-600/[0.07] blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.p {...fadeUp(0)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text mb-2">Writing</motion.p>
              <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display"><ShineText>Latest Posts</ShineText></motion.h2>
            </div>
            <motion.div {...fadeUp(0.05)}>
              <Link href="/blog" className="hidden sm:flex items-center gap-1.5 text-xs text-fg-subtle hover:text-fg transition-colors">
                All posts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          <div className="space-y-3">
            {latestPosts.map((post, i) => (
              <motion.div key={post.slug} {...fadeUp(i * 0.07)}>
                <Card>
                  <Link href={`/blog/${post.slug}`} className="flex items-center justify-between gap-4 p-5 group">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] text-accent-text border border-accent/20 bg-accent-soft px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-sm font-medium text-fg-muted group-hover:text-fg transition-colors truncate">{post.title}</h3>
                      <p className="text-xs text-fg-faint mt-0.5 truncate">{post.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="hidden sm:block text-[11px] text-fg-faint">
                        {new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-fg-faint group-hover:text-accent-text group-hover:translate-x-0.5 transition-all duration-150" />
                    </div>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Resume ──────────────────────────────────────────────────────────── */}
      <section id="resume" className="relative py-24 px-4 border-t border-line overflow-hidden">
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-claude-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <div className="flex items-end justify-between mb-12">
            <div>
              <motion.p {...fadeUp(0)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text mb-2">Career</motion.p>
              <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display"><ShineText>Resume</ShineText></motion.h2>
            </div>
            <motion.a
              {...fadeUp(0.05)}
              href="/suryansh.pdf"
              download
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-full border border-accent/30 bg-accent-soft text-accent-text hover:opacity-90 transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" /> Download CV
            </motion.a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
            <motion.div {...fadeUp(0.08)}>
              <p className="text-[10px] uppercase tracking-widest text-accent-text mb-7">Experience</p>
              <div className="space-y-9">
                {experience.map((exp, i) => (
                  <div key={i} className="relative pl-5 border-l-2 border-accent/20">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(217,119,87,0.7)]" />
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                      <h4 className="text-sm font-medium text-fg">{exp.role}</h4>
                      <span className="text-[10px] text-accent-text border border-accent/30 bg-accent-soft px-2 py-0.5 rounded-full">{exp.type}</span>
                    </div>
                    <p className="text-xs text-fg-muted mb-0.5">{exp.company}</p>
                    <p className="text-[11px] text-fg-faint mb-3">{exp.period}</p>
                    <p className="text-xs text-fg-subtle leading-relaxed mb-3">{exp.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 border border-accent/20 bg-accent-soft rounded text-accent-text">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.12)}>
              <p className="text-[10px] uppercase tracking-widest text-accent-text mb-7">Education</p>
              <div className="space-y-9 mb-10">
                {education.map((edu, i) => (
                  <div key={i} className="relative pl-5 border-l-2 border-accent/20">
                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(193,95,60,0.6)]" />
                    <h4 className="text-sm font-medium text-fg mb-0.5">{edu.degree}</h4>
                    <p className="text-xs text-fg-muted mb-0.5">{edu.institution}</p>
                    <p className="text-[11px] text-fg-faint">{edu.period}</p>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-xl border border-claude-500/15 bg-gradient-to-br from-claude-500/[0.06] to-claude-600/[0.04]">
                <p className="text-[10px] uppercase tracking-widest text-accent-text mb-4">Core Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {["System Design", "API Architecture", "Performance Optimisation", "TypeScript", "CI/CD", "Agile / Scrum"].map((s) => (
                    <span key={s} className="text-xs px-3 py-1 rounded-full border border-accent/30 bg-accent-soft text-accent-text">{s}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────────────────── */}
      <section id="contact" className="relative py-24 px-4 border-t border-line overflow-hidden">
        <div className="absolute -top-10 -right-20 w-[450px] h-[450px] rounded-full bg-claude-500/[0.08] blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative">
          <motion.p {...fadeUp(0)} className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text mb-2">Say Hello</motion.p>
          <motion.h2 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-3"><ShineText>Get in Touch</ShineText></motion.h2>
          <motion.p {...fadeUp(0.08)} className="text-sm text-fg-subtle mb-8 max-w-md leading-relaxed">
            I build in public. Got a project, a bug report, or just want to talk shop? Reach out — fill the form or hit me up directly.
          </motion.p>

          {/* copy-email — primary focal action */}
          <motion.div {...fadeUp(0.1)} className="mb-10">
            <button
              type="button"
              onClick={handleCopyEmail}
              className="group flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-accent/30 bg-accent-soft px-6 py-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50"
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-accent-text mb-1.5">Direct line</p>
                <p className="font-mono text-sm sm:text-base text-fg truncate">{EMAIL}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 flex-shrink-0 text-xs font-medium px-3 py-1.5 rounded-full bg-accent text-accent-fg transition-opacity group-hover:opacity-90">
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied ✓
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy email
                  </>
                )}
              </span>
            </button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* contact form */}
            <motion.div {...fadeUp(0.15)}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-fg-subtle mb-1.5" htmlFor="name">Name</label>
                  <input
                    id="name" type="text" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-sm text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-fg-subtle mb-1.5" htmlFor="email">Email</label>
                  <input
                    id="email" type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-sm text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-fg-subtle mb-1.5" htmlFor="message">Message</label>
                  <textarea
                    id="message" required rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-surface text-sm text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-accent text-accent-fg text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-[0_0_20px_rgba(217,119,87,0.25)]"
                >
                  {sent ? "✓ Opening your email client..." : "Send Message"}
                </button>
              </form>
            </motion.div>

            {/* socials */}
            <motion.div {...fadeUp(0.2)} className="grid grid-cols-2 gap-3 content-start">
              {socials.map((s) => (
                <Card key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col gap-3 p-5 group cursor-pointer"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-full border border-line text-fg-subtle group-hover:border-accent/40 group-hover:text-accent-text group-hover:shadow-[0_0_10px_rgba(217,119,87,0.2)] transition-all duration-200">
                      {s.icon}
                    </span>
                    <div>
                      <p className="text-xs font-medium text-fg-muted group-hover:text-fg transition-colors">{s.label}</p>
                      <p className="text-[10px] text-fg-faint mt-0.5 truncate">{s.handle}</p>
                    </div>
                  </a>
                </Card>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-line py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-fg-faint">
            © {new Date().getFullYear()} Suryansh Chaudhary
            <span className="text-fg-faint"> · </span>
            <span className="text-fg-faint">Open to interesting collaborations</span>
          </p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-fg-faint hover:text-fg-muted transition-colors">
                {s.icon}
              </a>
            ))}
          </div>
          <p className="text-[11px] text-fg-faint">
            Typed by me <span className="text-accent-text">·</span> Paired with{" "}
            <span className="text-accent-text font-medium">Claude</span>{" "}
            <span className="text-accent-text">·</span> Deployed at{" "}
            <span className="text-accent-text font-medium">3am</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
