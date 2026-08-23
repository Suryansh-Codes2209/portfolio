"use client";

import { projects } from "../data/projects";
import { motion } from "framer-motion";
import { ExternalLink, Github, Rocket } from "lucide-react";
import Link from "next/link";
import { Card } from "../components/card";
import { ShineText } from "../components/shine-text";
import { PageNav } from "../components/page-nav";
import { SiteFooter } from "../components/site-footer";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" } as const,
  transition: { duration: 0.42, delay, ease: "easeOut" as const },
});

export default function ProjectsPage() {
  return (
    <div className="bg-bg text-fg min-h-screen">
      <PageNav current="Projects" />

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-24">
        <motion.p {...fadeUp(0)} className="text-[10px] uppercase tracking-widest text-fg-faint mb-2">
          Work
        </motion.p>
        <motion.h1 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-3">
          <ShineText>Projects</ShineText>
        </motion.h1>
        <motion.p {...fadeUp(0.08)} className="text-sm text-fg-subtle mb-12 max-w-md">
          A selection of projects I&apos;ve built — some from work, some for fun.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div key={project.title} {...fadeUp(i * 0.06)}>
              <Card>
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="text-sm font-medium text-fg-muted group-hover:text-fg transition-colors leading-snug">
                      {project.title}
                    </h2>
                    <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View on GitHub"
                          className="text-fg-faint hover:text-fg-subtle transition-colors"
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
                          className="text-fg-faint hover:text-fg-subtle transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-fg-subtle leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {project.productHunt && (
                    <a
                      href={project.productHunt}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 font-mono text-[10px] text-accent-text transition-colors hover:border-accent/60"
                    >
                      <Rocket className="h-3 w-3" />
                      Live on Product Hunt
                    </a>
                  )}

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded border border-line text-fg-faint"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-[10px] text-fg-faint">{project.date}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
