"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";

const PARTICLES = 8;

export function LikeButton({ slug, layout = "row" }: { slug: string; layout?: "row" | "col" }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [burst, setBurst] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    let alive = true;
    fetch(`/api/likes/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setEnabled(!!d.enabled);
        setCount(d.count ?? 0);
        setLiked(d.liked || localStorage.getItem(`liked:${slug}`) === "1");
      })
      .catch(() => alive && setEnabled(false));
    return () => {
      alive = false;
    };
  }, [slug]);

  async function like() {
    if (liked) return;
    // optimistic
    setLiked(true);
    setCount((c) => c + 1);
    setBurst((b) => b + 1);
    localStorage.setItem(`liked:${slug}`, "1");

    try {
      const res = await fetch(`/api/likes/${slug}`, { method: "POST" });
      const d = await res.json();
      if (typeof d.count === "number") setCount(d.count);
    } catch {
      /* keep optimistic state */
    }
  }

  // Hide entirely if likes aren't configured on the server.
  if (enabled === false) return null;

  return (
    <div className={layout === "col" ? "flex flex-col items-center gap-1.5" : "flex items-center gap-2"}>
      <button
        type="button"
        onClick={like}
        disabled={liked}
        aria-pressed={liked}
        aria-label={liked ? "You liked this post" : "Like this post"}
        className={`group relative flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200 ${
          liked
            ? "border-accent/40 bg-accent-soft"
            : "border-line bg-surface hover:border-accent/40 hover:bg-accent-soft"
        }`}
      >
        <motion.span
          key={liked ? "on" : "off"}
          animate={reduce ? undefined : liked ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              liked ? "fill-accent text-accent" : "text-fg-subtle group-hover:text-accent-text"
            }`}
          />
        </motion.span>

        {/* particle burst */}
        {!reduce && (
          <AnimatePresence>
            {burst > 0 && (
              <span key={burst} className="pointer-events-none absolute inset-0">
                {Array.from({ length: PARTICLES }).map((_, i) => {
                  const angle = (i / PARTICLES) * Math.PI * 2;
                  return (
                    <motion.span
                      key={i}
                      className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-accent"
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos(angle) * 22,
                        y: Math.sin(angle) * 22,
                        opacity: 0,
                        scale: 0.4,
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  );
                })}
              </span>
            )}
          </AnimatePresence>
        )}
      </button>

      <div className="relative h-5 overflow-hidden text-sm tabular-nums text-fg-subtle">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={count}
            initial={reduce ? false : { y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: -12, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="block"
          >
            {count}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
