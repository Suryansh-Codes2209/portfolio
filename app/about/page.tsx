import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageNav } from "../components/page-nav";
import { SiteFooter } from "../components/site-footer";
import { PRODUCTS, SOCIALS } from "../data/site";

// Deliberately a server component with no scroll-reveal animation: every word
// below ships in the initial HTML at full opacity, which is the whole point of
// an entity page.

const facts = [
  { k: "Full name", v: "Suryansh Chaudhary" },
  { k: "Role", v: "Full-Stack AI Engineer" },
  { k: "Company", v: "Spiral Kite Labs" },
  { k: "Education", v: "Poornima Group" },
  { k: "Known for", v: "MacGet · Oratora · Signal Boy" },
  { k: "Focus", v: "LangGraph agents, agentic RAG, macOS & Swift" },
];

function Prose({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 text-[15px] leading-relaxed text-fg-muted">{children}</p>;
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12">
      <h2 className="mb-4 font-display text-xl text-fg sm:text-2xl">{title}</h2>
      {children}
    </section>
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

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">
          About
        </p>
        <h1 className="mb-6 font-display text-3xl leading-tight text-fg sm:text-4xl">
          Suryansh Chaudhary — Full-Stack AI Engineer and creator of MacGet
        </h1>

        <div className="mb-10 flex items-start gap-5 rounded-2xl border border-line bg-surface p-5">
          <Image
            src="/Profile.png"
            alt="Suryansh Chaudhary, Full-Stack AI Engineer"
            width={96}
            height={96}
            className="h-20 w-20 flex-shrink-0 rounded-full object-cover"
          />
          <dl className="grid flex-1 grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {facts.map((f) => (
              <div key={f.k} className="flex flex-col">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
                  {f.k}
                </dt>
                <dd className="text-[13px] text-fg-muted">{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>

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

        <Section id="current-work" title="What he works on now">
          <Prose>
            His day job is agent architecture. At Spiral Kite Labs he owns the whole vertical for a
            multi-agent financial research desk: LangGraph for the control plane, LangChain for tool
            integrations, a FastAPI backend, Google Cloud Run for infrastructure, and the React
            frontend that makes the thing usable. The unglamorous half of that job is making the
            output <em>defensible</em> rather than merely fluent — in finance, a confident wrong
            number costs you the user permanently.
          </Prose>
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
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              Contact Suryansh
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
            >
              See the projects
            </Link>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
