"use client";

import type { PlayerRef } from "@remotion/player";
import { useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import dynamic from "next/dynamic";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";
import type { ClipId } from "./clips";

const ClipPlayer = dynamic(() => import("./clips"), { ssr: false });

/**
 * A Remotion scene playing live in the page. It stays a static poster until
 * it's near the viewport, pauses when scrolled away, and under reduced motion
 * never autoplays — the poster gets a play button instead.
 */
export function RemotionClip({
  id,
  poster,
  fallback,
  stats,
  className,
  label,
}: {
  id: ClipId;
  /** Still frame shown before the player mounts (from `pnpm video:still`). */
  poster?: string;
  /** Rendered instead of the poster image, e.g. a cut-out portrait. */
  fallback?: ReactNode;
  stats?: { githubStars: number; macgetDownloads: number };
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const player = useRef<PlayerRef>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);
  const [userPlay, setUserPlay] = useState(false);
  const mounted = near && (!reduce || userPlay);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        const p = player.current;
        if (!p) return;
        if (e.isIntersecting && !reduce) p.play();
        else if (!e.isIntersecting) p.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  return (
    <div ref={ref} role="img" aria-label={label} className={cn("relative aspect-video w-full overflow-hidden bg-bg-2", className)}>
      {!mounted &&
        (fallback ?? (poster ? <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null))}
      {mounted && (
        <div className="absolute inset-0">
          <ClipPlayer playerRef={player} id={id} stats={stats} controls={!!reduce} fill />
        </div>
      )}
      {reduce && !userPlay && (
        <button
          type="button"
          onClick={() => setUserPlay(true)}
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 bg-fg px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-bg"
        >
          <Play className="h-3 w-3" /> Play clip
        </button>
      )}
    </div>
  );
}
