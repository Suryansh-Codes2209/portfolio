"use client";

import { allBlogs } from "contentlayer/generated";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { Card } from "../components/card";
import { ShineText } from "../components/shine-text";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.42, delay, ease: "easeOut" as const },
});

const published = allBlogs
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export default function BlogPage() {
  return (
    <div className="bg-black text-zinc-100 min-h-screen">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-claude-600/[0.06] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-claude-700/[0.05] blur-[100px]" />
      </div>

      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b border-claude-500/10 bg-black/80">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
          <span className="text-xs text-zinc-600">Blog</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-24 relative">
        <motion.p {...fadeUp(0)} className="text-[10px] uppercase tracking-widest text-claude-400/70 mb-2">
          Writing
        </motion.p>
        <motion.h1 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-3">
          <ShineText>Blog</ShineText>
        </motion.h1>
        <motion.p {...fadeUp(0.08)} className="text-sm text-zinc-500 mb-12 max-w-md">
          Thoughts on full-stack development, TypeScript, cloud architecture, and building things that last.
        </motion.p>

        <div className="space-y-4">
          {published.map((post, i) => (
            <motion.div key={post.slug} {...fadeUp(i * 0.07)}>
              <Card>
                <Link href={`/blog/${post.slug}`} className="block p-6 group">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors mb-2 leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-3">
                        {post.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {post.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="flex items-center gap-1 text-[10px] text-claude-400/70">
                            <Tag className="w-2.5 h-2.5" />{tag}
                          </span>
                        ))}
                        {post.readingTime && (
                          <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                            <Clock className="w-2.5 h-2.5" />{post.readingTime} min read
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-zinc-600">
                        {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-claude-400 group-hover:translate-x-0.5 transition-all duration-150" />
                    </div>
                  </div>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
