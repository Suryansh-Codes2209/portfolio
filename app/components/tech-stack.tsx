"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { categories } from "../data/stack";
import { Marquee } from "./ui/marquee";
import { Chapter } from "./vox/chapter";
import { KineticHeading } from "./vox/kinetic-heading";
import { tiltFor } from "./vox/taped-card";

/** The toolkit: a sticker sheet per category, plus a ticker-tape marquee. */
export function TechStack() {
  const all = categories.flatMap((c) => c.items);

  return (
    <Chapter id="stack" number={3} kicker="Technologies" tone="bg-2">
      <KineticHeading text="Agents, backends, frontends. One person." highlight="One person." />

      <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, ci) => (
          <div key={cat.label}>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-accent-text">{cat.label}</p>
            <div className="flex flex-wrap gap-2.5">
              {cat.items.map((t, i) => (
                <motion.span
                  key={t.name}
                  initial={{ opacity: 0, y: -30, rotate: tiltFor(t.name, 12) }}
                  whileInView={{ opacity: 1, y: 0, rotate: tiltFor(t.name, 3) }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", damping: 12, stiffness: 160, delay: ci * 0.05 + i * 0.04 }}
                  whileHover={{ rotate: 0, scale: 1.06 }}
                  style={{ ["--brand" as string]: t.color }}
                  className="group inline-flex items-center gap-2 rounded-full border-2 border-fg bg-surface px-3.5 py-1.5 text-sm text-fg shadow-[0_3px_0_var(--line-strong)]"
                >
                  <t.Icon className="h-4 w-4 shrink-0 text-fg-subtle transition-colors group-hover:text-[color:var(--brand)]" />
                  {t.name}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ticker tape */}
      <div className="relative -mx-5 mt-20 -rotate-1 border-y-2 border-fg bg-highlight py-1 text-highlight-ink">
        <Marquee pauseOnHover className="[--duration:55s] [--gap:2.5rem]">
          {all.map((t) => (
            <span key={t.name} className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.2em]">
              <t.Icon className="h-3.5 w-3.5" /> {t.name} <span aria-hidden>✦</span>
            </span>
          ))}
        </Marquee>
      </div>

      <p className="mt-14 text-center">
        <Link href="/skills" className="inline-flex items-center gap-1.5 text-sm text-accent-text hover:underline">
          Full skills breakdown, with what shipped on each <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </p>
    </Chapter>
  );
}
