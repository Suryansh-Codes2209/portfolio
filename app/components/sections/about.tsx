"use client";

import { ArrowRight, Cloud, Cpu, Server } from "lucide-react";
import Link from "next/link";
import { NumberTicker } from "../ui/number-ticker";
import { Annotate } from "../vox/annotate";
import { Chapter } from "../vox/chapter";
import { KineticHeading } from "../vox/kinetic-heading";
import { TapedCard } from "../vox/taped-card";

const stats = [
  { label: "Years building", target: 3, suffix: "+" },
  { label: "AI agents shipped", target: 5, suffix: "+" },
  { label: "LLM APIs", target: 6, suffix: "+" },
  { label: "Technologies", target: 25, suffix: "+" },
];

const pillars = [
  { icon: <Cpu className="h-4 w-4" />, title: "AI Engineering", desc: "LangGraph + LangChain agents with conditional routing, tool orchestration, and grounded financial reasoning." },
  { icon: <Server className="h-4 w-4" />, title: "Full Stack Ownership", desc: "FastAPI + React, streaming LLM responses, TypeScript SDKs, and agent state management end-to-end." },
  { icon: <Cloud className="h-4 w-4" />, title: "Cloud & DevOps", desc: "Docker, Google Cloud Run, CI/CD, and cost-optimised inference routing for AI workloads in production." },
];

export function AboutSection() {
  return (
    <Chapter id="about" number={2} kicker="About">
      <KineticHeading text="Building AI agents that actually ship" highlight="actually ship" />

      <div className="mt-14 grid gap-12 lg:grid-cols-12">
        <div className="space-y-5 text-[17px] leading-relaxed text-fg-muted lg:col-span-7">
          <p>
            I&apos;m a <strong className="font-medium text-fg">Full Stack AI Engineer</strong> building financial research AI agents — production
            systems that pull live market data, reason through financials, and generate analyst-grade reports, fully automated.
          </p>
          <p>
            Currently at <strong className="font-medium text-fg">Spiral Kite Labs</strong>, I own the full stack: LangGraph agent architecture,
            LangChain tool integrations, FastAPI backend, Google Cloud Run infrastructure, and the React frontend that makes it usable.
          </p>
          <p>
            When you&apos;re the AI + DevOps + backend + frontend person at a startup, you stop thinking in layers and start thinking in{" "}
            <Annotate kind="circle">
              <span className="text-fg">outcomes</span>
            </Annotate>
            .
          </p>
          <Link href="/about" className="inline-flex items-center gap-1.5 pt-2 text-sm text-accent-text hover:underline">
            Read the full story <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* the numbers, as a ruled index card */}
        <div className="lg:col-span-5">
          <TapedCard seed="about-stats" fig="Fig. 02 — By the numbers" tape="corners" className="ruled p-7">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">{s.label}</dt>
                  <dd className="font-serif text-5xl leading-none text-fg">
                    <NumberTicker value={s.target} />
                    <span className="text-accent">{s.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </TapedCard>
        </div>
      </div>

      <div className="mt-16 grid gap-8 sm:grid-cols-3">
        {pillars.map((p, i) => (
          <TapedCard key={p.title} seed={p.title} fig={`Fig. 02.${i + 1}`} className="p-6">
            <div className="mb-3 text-accent-text">{p.icon}</div>
            <h3 className="mb-2 font-serif text-2xl text-fg">{p.title}</h3>
            <p className="text-[13px] leading-relaxed text-fg-subtle">{p.desc}</p>
          </TapedCard>
        ))}
      </div>
    </Chapter>
  );
}
