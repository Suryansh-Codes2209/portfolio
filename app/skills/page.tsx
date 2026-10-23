import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageNav } from "../components/page-nav";
import { SiteFooter } from "../components/site-footer";
import { Marquee } from "../components/ui/marquee";
import { KineticHeading } from "../components/vox/kinetic-heading";
import { Stamp } from "../components/vox/stamp";
import { tiltFor } from "../components/vox/taped-card";
import { SKILL_GROUPS } from "./skills-data";

const TINTS = ["bg-surface", "bg-[#fff3b0] dark:bg-[#3a3418]", "bg-[#d8e8f0] dark:bg-[#1c2a31]", "bg-[#ffd9cf] dark:bg-[#3a221c]"];

export default function SkillsPage() {
  const total = SKILL_GROUPS.reduce((n, g) => n + g.skills.length, 0);

  return (
    <div className="min-h-screen overflow-x-clip bg-bg text-fg">
      <PageNav current="Skills" />

      <header className="mx-auto max-w-6xl px-5 pb-14 pt-28 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">
            <span className="text-accent-text">Skills</span> — the toolkit, annotated
          </p>
          <Stamp rotate={-5}>{total} tools · each one shipped</Stamp>
        </div>
        <KineticHeading as="h1" text="What Suryansh Chaudhary builds with" highlight="builds" className="sm:text-7xl" />
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-fg-muted">
          Not a checklist — every tool below is here because something shipped with it. Where a claim maps to a project or
          a build log, the link is on the page.
        </p>

        {/* Jump list doubles as an outline Google can read. */}
        <nav aria-label="Skill categories" className="mt-10 flex flex-wrap gap-3">
          {SKILL_GROUPS.map((g, i) => (
            <a
              key={g.slug}
              href={`#${g.slug}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-fg bg-surface px-4 py-1.5 text-sm text-fg shadow-[0_3px_0_var(--line-strong)] transition-transform hover:-translate-y-0.5 hover:bg-highlight hover:text-highlight-ink"
            >
              <span className="font-mono text-[10px] text-accent-text">{String(i + 1).padStart(2, "0")}</span>
              {g.label}
            </a>
          ))}
        </nav>
      </header>

      {/* ticker tape of every tool */}
      <div className="-rotate-1 border-y-2 border-fg bg-highlight py-1 text-highlight-ink">
        <Marquee pauseOnHover className="[--duration:70s] [--gap:2.5rem]">
          {SKILL_GROUPS.flatMap((g) => g.skills).map((s) => (
            <span key={s.name} className="font-mono text-xs uppercase tracking-[0.2em]">
              {s.name} <span aria-hidden>✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="space-y-28">
          {SKILL_GROUPS.map((group, gi) => {
            const flip = gi % 2 === 1;
            return (
              <section key={group.slug} id={group.slug} className="grid scroll-mt-24 gap-10 lg:grid-cols-12">
                {/* the chapter card — alternates sides down the page */}
                <div className={`lg:col-span-4 ${flip ? "lg:order-2" : ""}`}>
                  <div className="lg:sticky lg:top-24">
                    <p className="font-serif text-8xl leading-none text-accent/80">{String(gi + 1).padStart(2, "0")}</p>
                    <h2 className="mt-3 font-serif text-4xl leading-tight text-fg">
                      <span className="marker">{group.label}</span>
                    </h2>
                    <p className="mt-5 text-[15px] leading-relaxed text-fg-muted">{group.blurb}</p>
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-fg-faint">
                      Fig. {String(gi + 1).padStart(2, "0")} — {group.skills.length} tools
                    </p>
                  </div>
                </div>

                {/* the evidence: one index card per tool */}
                <dl className={`grid gap-6 sm:grid-cols-2 lg:col-span-8 ${flip ? "lg:order-1" : ""}`}>
                  {group.skills.map((skill, si) => (
                    <div
                      key={skill.name}
                      style={{ ["--r" as string]: `${tiltFor(skill.name, 1.6)}deg` }}
                      className={`relative p-6 pt-7 shadow-paper transition-transform duration-300 [transform:rotate(var(--r))] hover:[transform:rotate(0deg)_translateY(-4px)] ${
                        si === 0 ? TINTS[(gi + 1) % TINTS.length] : "bg-surface ruled"
                      }`}
                    >
                      <span aria-hidden className="tape absolute -top-3 left-6 h-5 w-16 -rotate-3" />
                      <dt className="font-serif text-2xl leading-tight text-fg">{skill.name}</dt>
                      <dd className="mt-2 text-[13px] leading-relaxed text-fg-muted">{skill.note}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            );
          })}
        </div>

        {/* working together — a note pinned at the end */}
        <section className="paper relative mt-28 -rotate-[0.5deg] p-8 sm:p-12">
          <span aria-hidden className="tape absolute -top-3 left-12 h-6 w-28 -rotate-3" />
          <Stamp className="absolute right-8 top-8 hidden sm:inline-flex" rotate={8}>
            Open to collabs
          </Stamp>
          <h2 className="mb-4 font-serif text-4xl text-fg">Working together</h2>
          <p className="mb-7 max-w-2xl text-[16px] leading-relaxed text-fg-muted">
            Open to collaborations and freelance work on AI agent systems, agentic RAG pipelines, and full-stack products
            around them. The{" "}
            <Link href="/projects" className="text-accent-text underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
              projects
            </Link>{" "}
            and{" "}
            <Link href="/blog" className="text-accent-text underline decoration-accent/40 underline-offset-2 hover:decoration-accent">
              build log
            </Link>{" "}
            are the honest version of this page — including the decisions that turned out wrong.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-fg px-6 py-3 text-sm font-medium text-bg shadow-paper transition-transform hover:-rotate-1"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border-2 border-fg px-5 py-2.5 text-sm text-fg transition-colors hover:bg-highlight hover:text-highlight-ink"
            >
              About Suryansh
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
