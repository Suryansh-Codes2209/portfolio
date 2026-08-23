import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageNav } from "../components/page-nav";
import { SiteFooter } from "../components/site-footer";
import { SKILL_GROUPS } from "./skills-data";

export default function SkillsPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <PageNav current="Skills" />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">
          Skills
        </p>
        <h1 className="mb-4 font-display text-3xl leading-tight text-fg sm:text-4xl">
          What Suryansh Chaudhary builds with
        </h1>
        <p className="mb-10 max-w-xl text-[15px] leading-relaxed text-fg-muted">
          Not a checklist — every tool below is here because something shipped with it. Where a
          claim maps to a project or a build log, the link is on the page.
        </p>

        {/* Jump list doubles as an outline Google can read. */}
        <nav aria-label="Skill categories" className="mb-14 flex flex-wrap gap-2">
          {SKILL_GROUPS.map((g) => (
            <a
              key={g.slug}
              href={`#${g.slug}`}
              className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-fg-subtle transition-colors hover:border-line-strong hover:text-fg"
            >
              {g.label}
            </a>
          ))}
        </nav>

        <div className="space-y-14">
          {SKILL_GROUPS.map((group) => (
            <section key={group.slug} id={group.slug} className="scroll-mt-20">
              <h2 className="mb-3 font-display text-xl text-fg sm:text-2xl">{group.label}</h2>
              <p className="mb-6 text-[15px] leading-relaxed text-fg-muted">{group.blurb}</p>

              <dl className="space-y-4">
                {group.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-line-strong"
                  >
                    <dt className="mb-1 text-sm font-medium text-fg">{skill.name}</dt>
                    <dd className="text-[13px] leading-relaxed text-fg-subtle">{skill.note}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-2 font-display text-xl text-fg">Working together</h2>
          <p className="mb-5 text-[15px] leading-relaxed text-fg-muted">
            Open to collaborations and freelance work on AI agent systems, agentic RAG pipelines,
            and full-stack products around them. The{" "}
            <Link
              href="/projects"
              className="text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
            >
              projects
            </Link>{" "}
            and{" "}
            <Link
              href="/blog"
              className="text-accent-text underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
            >
              build log
            </Link>{" "}
            are the honest version of this page — including the decisions that turned out wrong.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
            >
              Get in touch
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-fg-muted transition-colors hover:border-line-strong hover:text-fg"
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
