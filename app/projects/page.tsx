"use client";

import { projects } from "../data/projects";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { Card } from "../components/card";
import { ShineText } from "../components/shine-text";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" } as const,
  transition: { duration: 0.42, delay, ease: "easeOut" as const },
});

export default function ProjectsPage() {
  return (
    <div className="bg-black text-zinc-100 min-h-screen">
      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b border-zinc-800/50 bg-black/80">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
          <span className="text-xs text-zinc-600">Projects</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-24">
        <motion.p {...fadeUp(0)} className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2">
          Work
        </motion.p>
        <motion.h1 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-3">
          <ShineText>Projects</ShineText>
        </motion.h1>
        <motion.p {...fadeUp(0.08)} className="text-sm text-zinc-500 mb-12 max-w-md">
          A selection of projects I&apos;ve built — some from work, some for fun.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div key={project.title} {...fadeUp(i * 0.06)}>
              <Card>
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors leading-snug">
                      {project.title}
                    </h2>
                    <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View on GitHub"
                          className="text-zinc-700 hover:text-zinc-400 transition-colors"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Visit live site"
                          className="text-zinc-700 hover:text-zinc-400 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded border border-zinc-800 text-zinc-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-[10px] text-zinc-700">{project.date}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
