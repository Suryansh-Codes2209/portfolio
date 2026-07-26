"use client";

import { allBlogs } from "contentlayer/generated";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SubscribeForm } from "../components/blog/subscribe-form";
import { ThemeToggle } from "../components/theme-toggle";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.42, delay, ease: "easeOut" as const },
});

const published = allBlogs
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const allTags = Array.from(new Set(published.flatMap((p) => p.tags ?? []))).sort();

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string>("All");

  const [featured, ...rest] = published;

  const filtered = useMemo(() => {
    if (activeTag === "All") return rest;
    return published.filter((p) => (p.tags ?? []).includes(activeTag));
  }, [activeTag, rest]);

  const showFeatured = activeTag === "All" && featured;

  return (
    <div className="bg-bg text-fg min-h-screen">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-claude-600/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-claude-700/[0.05] blur-[100px]" />
      </div>

      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-fg-subtle hover:text-fg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-24 relative">
        <motion.p {...fadeUp(0)} className="text-[10px] uppercase tracking-widest text-accent-text mb-2">
          Writing
        </motion.p>
        <motion.h1 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-3 text-fg">
          Build logs
        </motion.h1>
        <motion.p {...fadeUp(0.08)} className="text-sm text-fg-muted mb-8 max-w-md">
          Build logs from shipping MacGet and AI systems in public — the engineering, the trade-offs, and what
          broke along the way.
        </motion.p>

        {published.length === 0 && (
          <p className="text-sm text-fg-subtle">No posts yet — check back soon.</p>
        )}

        {/* tag filter */}
        {allTags.length > 0 && (
          <motion.div {...fadeUp(0.1)} className="mb-10 flex flex-wrap gap-2">
            {["All", ...allTags].map((tag) => {
              const active = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors duration-150 ${
                    active
                      ? "border-accent/40 bg-accent-soft text-accent-text"
                      : "border-line text-fg-subtle hover:border-line-strong hover:text-fg"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </motion.div>
        )}

        {/* featured */}
        {showFeatured && (
          <motion.div {...fadeUp(0.1)} className="mb-14">
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-2xl border border-accent/30 bg-accent-soft p-6 sm:p-8 transition-colors duration-200 hover:border-accent/50"
            >
              {featured.image && (
                <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-surface">
                  <Image
                    src={featured.image}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 768px) 700px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <span className="text-[10px] uppercase tracking-widest text-accent-text">Latest</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-display text-fg leading-snug transition-colors duration-200 group-hover:text-accent-text">
                {featured.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-fg-muted leading-relaxed max-w-2xl">
                {featured.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {featured.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent-soft border border-accent/20 px-2.5 py-1 text-[10px] text-accent-text"
                  >
                    {tag}
                  </span>
                ))}
                <span className="flex items-center gap-1 font-mono text-[11px] text-fg-subtle">
                  {formatDate(featured.date)}
                  {featured.readingTime ? ` · ${featured.readingTime} min read` : ""}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-accent-text transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* list */}
        <div className="border-t border-line">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((post) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="border-b border-line"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col sm:flex-row sm:items-start justify-between gap-3 py-5 sm:py-6 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-display text-fg leading-snug transition-colors duration-150 group-hover:text-accent-text">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-fg-muted leading-relaxed line-clamp-2 max-w-xl">
                      {post.description}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] text-accent-text"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {post.image && (
                    <div className="relative hidden sm:block w-32 shrink-0 aspect-[16/9] overflow-hidden rounded-lg border border-line bg-surface">
                      <Image
                        src={post.image}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-1.5">
                    <span className="font-mono text-[11px] text-fg-subtle">{formatDate(post.date)}</span>
                    {post.readingTime && (
                      <span className="flex items-center gap-1 font-mono text-[11px] text-fg-faint">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min read
                      </span>
                    )}
                    <ArrowRight className="hidden sm:block w-3.5 h-3.5 text-fg-faint transition-all duration-150 group-hover:translate-x-1 group-hover:text-accent-text" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && published.length > 0 && (
          <p className="py-8 text-sm text-fg-subtle">No posts tagged “{activeTag}”.</p>
        )}

        {/* subscribe CTA */}
        <div className="mt-16">
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
}
