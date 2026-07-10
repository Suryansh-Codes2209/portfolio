"use client";

import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { Boxes, Cloud, Code2, Infinity as InfinityIcon, MessagesSquare, Network, Sparkles } from "lucide-react";
import {
  SiDjango, SiDocker, SiFastapi, SiFigma, SiFramer, SiGit, SiGithubactions, SiGooglecloud,
  SiGooglegemini, SiGraphql, SiLangchain, SiLinux, SiMongodb, SiNextdotjs, SiNodedotjs,
  SiPostgresql, SiPostman, SiPython, SiReact, SiRedis, SiTailwindcss, SiTypescript,
} from "react-icons/si";
import { ShineText } from "./shine-text";

type Tech = { name: string; Icon: ComponentType<{ className?: string }>; color: string };
type Category = { label: string; items: Tech[] };

// `color` is the brand hue used on hover; `null`-ish brands fall back to the accent token.
const ACCENT = "var(--accent)";

const categories: Category[] = [
  {
    label: "AI & Agents",
    items: [
      { name: "LangGraph", Icon: SiLangchain, color: "#1C3C3C" },
      { name: "LangChain", Icon: SiLangchain, color: "#1C3C3C" },
      { name: "Gemini API", Icon: SiGooglegemini, color: "#8E75B2" },
      { name: "OpenAI API", Icon: Sparkles, color: ACCENT },
      { name: "RAG / Vector Search", Icon: Boxes, color: ACCENT },
      { name: "Prompt Engineering", Icon: MessagesSquare, color: ACCENT },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "Python", Icon: SiPython, color: "#3776AB" },
      { name: "FastAPI", Icon: SiFastapi, color: "#009688" },
      { name: "Django", Icon: SiDjango, color: "#44B78B" },
      { name: "Node.js", Icon: SiNodedotjs, color: "#5FA04E" },
      { name: "REST APIs", Icon: Network, color: ACCENT },
      { name: "GraphQL", Icon: SiGraphql, color: "#E10098" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { name: "React", Icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", Icon: SiNextdotjs, color: ACCENT },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Framer Motion", Icon: SiFramer, color: "#0055FF" },
    ],
  },
  {
    label: "Database",
    items: [
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB", Icon: SiMongodb, color: "#47A248" },
      { name: "Redis", Icon: SiRedis, color: "#FF4438" },
    ],
  },
  {
    label: "DevOps & Cloud",
    items: [
      { name: "Google Cloud Run", Icon: SiGooglecloud, color: "#4285F4" },
      { name: "Docker", Icon: SiDocker, color: "#2496ED" },
      { name: "AWS", Icon: Cloud, color: "#FF9900" },
      { name: "CI/CD", Icon: InfinityIcon, color: ACCENT },
      { name: "GitHub Actions", Icon: SiGithubactions, color: "#2088FF" },
    ],
  },
  {
    label: "Tools",
    items: [
      { name: "Git", Icon: SiGit, color: "#F05032" },
      { name: "VS Code", Icon: Code2, color: "#3B82F6" },
      { name: "Postman", Icon: SiPostman, color: "#FF6C37" },
      { name: "Linux", Icon: SiLinux, color: "#FCC624" },
      { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
    ],
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.45, delay, ease: "easeOut" as const },
});

export function TechStack() {
  return (
    <section id="stack" className="relative overflow-hidden border-t border-line px-4 py-24">
      {/* animated dot-grid pattern fills the space behind the grid */}
      <div className="tech-pattern pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -top-24 right-0 h-[480px] w-[480px] rounded-full bg-claude-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-5xl">
        <motion.p {...fadeUp(0)} className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">
          Technologies
        </motion.p>
        <motion.h2 {...fadeUp(0.05)} className="mb-12 font-display text-3xl sm:text-4xl">
          <ShineText>Tech I work with</ShineText>
        </motion.h2>

        <div className="space-y-8">
          {categories.map((cat, ci) => (
            <motion.div key={cat.label} {...fadeUp(ci * 0.05)}>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fg-faint">{cat.label}</div>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {cat.items.map((t) => (
                  <div
                    key={t.name}
                    style={{ ["--brand" as string]: t.color }}
                    className="group flex items-center gap-2.5 rounded-xl border border-line bg-surface/80 px-3.5 py-3 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-line-strong"
                  >
                    <t.Icon className="h-[18px] w-[18px] shrink-0 text-fg-subtle transition-colors duration-200 group-hover:text-[color:var(--brand)]" />
                    <span className="truncate text-sm text-fg-muted transition-colors duration-200 group-hover:text-fg">
                      {t.name}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
