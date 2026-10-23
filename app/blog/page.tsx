"use client";

import { allBlogs } from "contentlayer/generated";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SubscribeForm } from "../components/blog/subscribe-form";
import { PageNav } from "../components/page-nav";
import { SiteFooter } from "../components/site-footer";
import { Highlight } from "../components/vox/highlight";
import { Stamp } from "../components/vox/stamp";
import { tiltFor } from "../components/vox/taped-card";

const published = allBlogs
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const allTags = Array.from(new Set(published.flatMap((p) => p.tags ?? []))).sort();

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Cover art, or a typeset headline standing in when a post has none. */
function Cover({ post, sizes, priority }: { post: (typeof published)[number]; sizes: string; priority?: boolean }) {
  return post.image ? (
    <Image
      src={post.image}
      alt=""
      fill
      priority={priority}
      sizes={sizes}
      className="object-cover grayscale-[30%] sepia-[18%] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:sepia-0"
    />
  ) : (
    // no cover art yet: the headline, typeset big on ruled paper
    <div className="ruled absolute inset-0 flex flex-col justify-between bg-surface p-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-text">No. {published.indexOf(post) + 1} · cover pending</span>
      <p className="font-serif text-3xl italic leading-[1.05] text-fg-muted sm:text-4xl">{post.title}</p>
    </div>
  );
}

export default function BlogPage() {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [featured, ...rest] = published;

  const filtered = useMemo(() => {
    if (activeTag === "All") return rest;
    return published.filter((p) => (p.tags ?? []).includes(activeTag));
  }, [activeTag, rest]);

  const showFeatured = activeTag === "All" && featured;
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-bg text-fg">
      <PageNav current="Blog" />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8">
        {/* ── masthead ─────────────────────────────────────────────────── */}
        <header className="border-y-4 border-double border-fg py-6 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-fg-subtle">
            Vol. 1 · No. {published.length} · {today}
          </p>
          <h1 className="my-3 font-serif text-6xl leading-none tracking-tight text-fg sm:text-8xl">
            The Build <Highlight>Log</Highlight>
          </h1>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-fg-muted">
            Build logs from shipping MacGet and AI systems in public — the engineering, the trade-offs, and what broke along
            the way.
          </p>
        </header>

        {published.length === 0 && <p className="mt-10 text-sm text-fg-subtle">No posts yet — check back soon.</p>}

        {/* ── sections (tag filter) ────────────────────────────────────── */}
        {allTags.length > 0 && (
          <nav aria-label="Filter by tag" className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-b border-fg py-3">
            {["All", ...allTags].map((tag) => {
              const active = tag === activeTag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  aria-pressed={active}
                  className={`font-mono text-[11px] uppercase tracking-widest transition-colors ${
                    active ? "marker" : "text-fg-subtle hover:text-fg"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </nav>
        )}

        {/* ── front page: the lead story ───────────────────────────────── */}
        {showFeatured && (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="border-b border-fg py-10"
          >
            <Link href={`/blog/${featured.slug}`} className="group grid gap-10 lg:grid-cols-12">
              <div className="relative lg:col-span-7">
                <div className="halftone relative aspect-[16/10] w-full overflow-hidden bg-bg-2 shadow-paper">
                  <Cover post={featured} sizes="(min-width: 1024px) 640px, 100vw" priority />
                </div>
                <Stamp className="absolute -right-3 -top-4 bg-bg" rotate={8}>
                  Latest edition
                </Stamp>
              </div>
              <div className="lg:col-span-5">
                <div className="mb-3 flex flex-wrap gap-3">
                  {featured.tags?.slice(0, 3).map((tag) => (
                    <span key={tag} className="font-mono text-[10px] uppercase tracking-widest text-accent-text">
                      #{tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-serif text-4xl leading-[1.05] text-fg decoration-highlight decoration-[8px] underline-offset-[-3px] group-hover:underline sm:text-5xl">
                  {featured.title}
                </h2>
                <p className="mt-5 text-[16px] leading-relaxed text-fg-muted first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-accent">
                  {featured.description}
                </p>
                <p className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-fg-subtle">
                  {formatDate(featured.date)}
                  {featured.readingTime ? ` · ${featured.readingTime} min read` : ""}
                  <ArrowRight className="h-3.5 w-3.5 text-accent-text transition-transform group-hover:translate-x-1" />
                </p>
              </div>
            </Link>
          </motion.article>
        )}

        {/* ── the clippings ────────────────────────────────────────────── */}
        <p className="mb-8 mt-12 font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">
          {activeTag === "All" ? "Earlier editions" : `Filed under #${activeTag}`} — {filtered.length}
        </p>
        <motion.div layout className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((post) => (
              <motion.article
                key={post.slug}
                layout
                initial={{ opacity: 0, y: -20, rotate: tiltFor(post.slug, 6) }}
                animate={{ opacity: 1, y: 0, rotate: tiltFor(post.slug, 1.5) }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ rotate: 0, y: -4 }}
                transition={{ type: "spring", damping: 18, stiffness: 160 }}
                className="paper relative p-3"
              >
                <span aria-hidden className="tape absolute -top-3 left-1/2 z-10 h-6 w-20 -translate-x-1/2 -rotate-2" />
                <Link href={`/blog/${post.slug}`} className="group block">
                  <div className="halftone relative aspect-[16/10] overflow-hidden bg-bg-2">
                    <Cover post={post} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <div className="px-2 pb-2 pt-4">
                    <div className="mb-2 flex flex-wrap gap-2">
                      {post.tags?.slice(0, 2).map((tag) => (
                        <span key={tag} className="font-mono text-[10px] uppercase tracking-widest text-accent-text">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-serif text-2xl leading-tight text-fg decoration-highlight decoration-[6px] underline-offset-[-2px] group-hover:underline">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-fg-subtle">{post.description}</p>
                    <p className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-fg-faint">
                      {formatDate(post.date)}
                      {post.readingTime && (
                        <>
                          <Clock className="h-3 w-3" /> {post.readingTime} min
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && published.length > 0 && (
          <p className="py-8 text-sm text-fg-subtle">No posts tagged “{activeTag}”.</p>
        )}

        {/* ── subscribe: the classifieds box ───────────────────────────── */}
        <section className="mt-24 border-4 border-double border-fg p-2">
          <div className="border border-fg p-6 sm:p-8">
            <p className="mb-4 text-center font-mono text-[11px] uppercase tracking-[0.35em] text-fg-subtle">Classifieds — delivery</p>
            <SubscribeForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
