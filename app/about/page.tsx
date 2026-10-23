import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageNav } from "../components/page-nav";
import { SiteFooter } from "../components/site-footer";
import { Cutout } from "../components/vox/cutout";
import { Stamp } from "../components/vox/stamp";
import { PRODUCTS, SOCIALS } from "../data/site";

// Deliberately a server component with no scroll-reveal animation: every word
// below ships in the initial HTML at full opacity, which is the whole point of
// an entity page. The Vox look here is all static — marker, tape, stamps, the
// sticker cut-out — nothing that hides text until JavaScript runs.

const facts = [
  { k: "Full name", v: "Suryansh Chaudhary" },
  { k: "Role", v: "Full-Stack AI Engineer" },
  { k: "Company", v: "Spiral Kite Labs" },
  { k: "Education", v: "Poornima Group" },
  { k: "Known for", v: "MacGet · Oratora · Signal Boy" },
  { k: "Focus", v: "LangGraph agents, agentic RAG, macOS & Swift" },
];

// The sections, in order — also drives the margin index.
const SECTIONS = [
  { id: "current-work", label: "Now" },
  { id: "macget", label: "MacGet" },
  { id: "oratora", label: "Oratora" },
  { id: "signal-boy", label: "Signal Boy" },
  { id: "how-he-works", label: "How he works" },
  { id: "background", label: "Background" },
  { id: "contact", label: "Get in touch" },
];

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 text-[16px] leading-[1.75] text-fg-muted">{children}</p>;
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const n = SECTIONS.findIndex((x) => x.id === id) + 1;
  return (
    <section id={id} className="scroll-mt-24 border-t border-dashed border-line-strong pt-12 first:border-t-0 first:pt-0">
      <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-text">
        Chapter {String(n).padStart(2, "0")}
      </p>
      <h2 className="mb-6 font-serif text-4xl leading-[1.05] text-fg sm:text-5xl">{title}</h2>
      {children}
    </section>
  );
}

/** A pulled quote, pinned in the column like a clipping. */
function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="relative my-10 -rotate-[0.6deg] border-l-4 border-accent bg-surface px-7 py-6 font-serif text-2xl leading-snug text-fg shadow-paper">
      <span aria-hidden className="tape absolute -top-3 right-10 h-6 w-20 rotate-3" />
      {children}
    </blockquote>
  );
}

const Out = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-accent-text underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
  >
    {children}
  </a>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <PageNav current="About" />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8">
        {/* ── the subject file ─────────────────────────────────────────── */}
        <header className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-6 flex flex-wrap items-center gap-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">
                <span className="text-accent-text">About</span> — the subject file
              </p>
              <Stamp rotate={-5}>Building in public</Stamp>
            </div>
            <h1 className="font-serif text-5xl leading-[1.02] tracking-tight text-fg sm:text-7xl">
              Suryansh Chaudhary — <span className="marker">Full-Stack AI Engineer</span> and creator of MacGet
            </h1>

            {/* the dossier card */}
            <div className="paper ruled relative mt-10 rotate-[0.4deg] p-6 sm:p-7">
              <span aria-hidden className="tape absolute -left-4 -top-2 h-6 w-16 -rotate-[38deg]" />
              <span aria-hidden className="tape absolute -right-4 -top-2 h-6 w-16 rotate-[38deg]" />
              <Stamp className="absolute -top-4 right-8 bg-surface" rotate={7}>
                Verified
              </Stamp>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {facts.map((f) => (
                  <div key={f.k} className="flex flex-col">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-subtle">{f.k}</dt>
                    <dd className="font-serif text-xl leading-snug text-fg">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <figure className="relative m-0 lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <Cutout
                src="/hero-portrait-vector.png"
                alt="Suryansh Chaudhary, Full-Stack AI Engineer"
                width={2000}
                height={1600}
                priority
                sizes="(min-width: 1024px) 420px, 90vw"
                rotate={3}
              />
              <span aria-hidden className="tape absolute left-1/2 top-6 h-7 w-28 -translate-x-1/2 -rotate-6" />
            </div>
            <figcaption className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">
              Fig. 01 — The subject, mid-ship
            </figcaption>
          </figure>
        </header>

        {/* ── the file itself: margin index + reading column ───────────── */}
        <div className="mt-20 grid gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-fg-faint">In this file</p>
              <ol className="space-y-2.5 border-l-2 border-dashed border-line-strong pl-4">
                {SECTIONS.map((x, i) => (
                  <li key={x.id}>
                    <a href={`#${x.id}`} className="group flex items-baseline gap-3 text-sm text-fg-muted hover:text-fg">
                      <span className="font-mono text-[10px] text-accent-text">{String(i + 1).padStart(2, "0")}</span>
                      <span className="transition-colors group-hover:text-accent-text">{x.label}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-2xl space-y-14 lg:col-span-9">
            <div className="text-[19px] leading-[1.7] [&_p]:text-[19px] [&_p]:text-fg">
              <Prose>
                <strong className="font-medium text-fg">Suryansh Chaudhary</strong> is a Full-Stack AI
                Engineer who builds production AI systems and ships open-source software in public. He
                works at <strong className="font-medium text-fg">Spiral Kite Labs</strong>, where he
                builds financial research agents — systems that pull live market data, reason through
                filings, and produce analyst-grade reports without a human in the loop. Outside that work
                he is the creator of <Out href={PRODUCTS.macget.url}>MacGet</Out>, a free, open-source
                download manager for macOS; <Out href={PRODUCTS.oratora.url}>Oratora</Out>, a live
                audience engagement platform; and{" "}
                <Out href={PRODUCTS.signalBoy.url}>Signal Boy</Out>, a zero-dependency WiFi survey tool
                you run with a single <code className="font-mono text-[13px] text-fg">npx</code> command.
              </Prose>
            </div>

            <Section id="current-work" title="What he works on now">
              <Prose>
                His day job is agent architecture. At Spiral Kite Labs he owns the whole vertical for a
                multi-agent financial research desk: LangGraph for the control plane, LangChain for tool
                integrations, a FastAPI backend, Google Cloud Run for infrastructure, and the React
                frontend that makes the thing usable. The unglamorous half of that job is making the
                output <em>defensible</em> rather than merely fluent — in finance, a confident wrong
                number costs you the user permanently.
              </Prose>
              <PullQuote>
                &ldquo;In finance, a confident wrong number costs you the user <span className="marker">permanently</span>.&rdquo;
              </PullQuote>
              <Prose>
                That constraint drives most of the architecture. Retrieval runs on Vertex AI&apos;s
                managed multimodal RAG Engine, because the number an analyst needs usually lives in a
                bar chart on page 34 rather than in a paragraph a text-only parser can reach. Safety
                runs as layered gates: deterministic hard gates for the things that must never depend on
                a model&apos;s judgement, and an LLM-as-judge soft gate for everything ambiguous.
                Agents get explicit state, small nodes, and narrow tool boundaries — and the parts of
                the system that shouldn&apos;t be a model&apos;s decision simply aren&apos;t.
              </Prose>
            </Section>

            <Section id="macget" title="MacGet — an open-source macOS download manager">
              <Prose>
                <Out href={PRODUCTS.macget.url}>MacGet</Out> is the project he is best known for, and
                it is free and open source. It is a SwiftUI app built on an actor-based download engine
                that opens chunked parallel HTTP connections, captures downloads straight from the
                browser over Native Messaging, and bundles yt-dlp so grabbing a video is one click
                rather than a terminal session. Version 1.3.0 added BitTorrent and OPDS book catalogs —
                and deleted the &ldquo;adaptive concurrency&rdquo; ramp he had shipped as a headline
                feature two releases earlier, because the heuristic misread a saturated link as a failed
                experiment and made MacGet slower exactly where it should have been fastest.
              </Prose>
              <Prose>
                MacGet is now on <Out href={PRODUCTS.macget.productHunt}>Product Hunt</Out>, and the
                source lives on <Out href={PRODUCTS.macget.github}>GitHub</Out>.
              </Prose>
            </Section>

            <Section id="oratora" title="Oratora — live audience engagement">
              <Prose>
                <Out href={PRODUCTS.oratora.url}>Oratora</Out> is live audience engagement for talks,
                classes and events: polls, word clouds, Q&amp;A and quizzes that a room joins from a
                phone browser with a short code — no app, no account, no signup wall between a speaker
                and their audience. Architecturally it is a Next.js modular monolith paired with a
                separately-scaled Socket.IO and Redis realtime tier, load-tested at 1,000 simultaneous
                joins, because the failure mode that actually matters is everyone in a lecture hall
                connecting in the same ten seconds.
              </Prose>
            </Section>

            <Section id="signal-boy" title="Signal Boy — WiFi survey in one command">
              <Prose>
                <Out href={PRODUCTS.signalBoy.url}>Signal Boy</Out> started as a personal irritation:
                finding the dead zone in a flat required downloading an app, making an account, or
                paying for a heatmap licence. It runs with <code className="font-mono text-[13px] text-fg">npx signalboy</code>{" "}
                and shows a live dBm readout on a Game Boy-style LCD — a Kalman filter settles the
                reading while an EWMA keeps the sparkline moving. It has zero dependencies, per-OS
                backends for macOS, Windows and Linux, and a native Android app that reads the
                phone&apos;s own radio.
              </Prose>
            </Section>

            <Section id="how-he-works" title="How he works, and writes about it">
              <Prose>
                He builds in public. The <Link href="/blog" className="text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent">build log</Link>{" "}
                on this site runs two to four posts a month covering LangGraph agent architecture,
                prompt-injection defence, agentic RAG on Vertex AI, Swift concurrency inside MacGet, and
                the AI-assisted development workflow he actually uses day to day — including the
                decisions that turned out to be wrong. Being the AI, DevOps, backend and frontend person
                at a startup means you stop thinking in layers and start thinking in outcomes, and the
                writing reflects that.
              </Prose>
            </Section>

            <Section id="background" title="Background">
              <Prose>
                Suryansh studied at Poornima Group and has spent the years since working across the full
                stack — Python, FastAPI and Django on the backend; React, Next.js and TypeScript on the
                frontend; PostgreSQL, MongoDB and Redis for data; Docker, Google Cloud Run and GitHub
                Actions for shipping. The AI layer on top is LangGraph and LangChain with Gemini and
                OpenAI models, retrieval-augmented generation, and cost-aware routing between models.
                The full breakdown is on the{" "}
                <Link href="/skills" className="text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent">skills page</Link>.
              </Prose>
            </Section>

            <Section id="contact" title="Get in touch">
              <Prose>
                He is open to collaborations, freelance work on AI agent systems, and bug reports on any
                of the projects above. The fastest routes are{" "}
                <a href={`mailto:${SOCIALS.email}`} className="text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent">email</a>,{" "}
                <Out href={SOCIALS.x}>X</Out>, <Out href={SOCIALS.linkedin}>LinkedIn</Out>, or{" "}
                <Out href={SOCIALS.github}>GitHub</Out>.
              </Prose>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-fg px-6 py-3 text-sm font-medium text-bg shadow-paper transition-transform hover:-rotate-1"
                >
                  Contact Suryansh
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 border-2 border-fg px-5 py-2.5 text-sm text-fg transition-colors hover:bg-highlight hover:text-highlight-ink"
                >
                  See the projects
                </Link>
              </div>
            </Section>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
