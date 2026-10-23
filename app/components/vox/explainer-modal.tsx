"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/app/lib/utils";
import { EXPLAINER_SECONDS } from "./explainer-length";

const ClipPlayer = dynamic(() => import("./clips"), { ssr: false });

/** "▶ Watch the explainer" — opens the full Remotion cut in a modal. */
export function ExplainerModal({
  stats,
  className,
  label,
}: {
  stats: { githubStars: number; macgetDownloads: number };
  className?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group inline-flex items-center gap-2.5 text-sm font-medium text-fg underline decoration-accent decoration-2 underline-offset-[6px] hover:decoration-[3px]",
          className,
        )}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-fg transition-transform group-hover:scale-110">
          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
        </span>
        {label ?? `Watch the ${EXPLAINER_SECONDS}-second explainer`}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] grid place-items-center bg-[#1a1714]/80 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Portfolio explainer video"
              initial={{ scale: 0.92, rotate: -2, y: 30 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="paper relative w-full max-w-5xl p-2 sm:p-3"
            >
              <span aria-hidden className="tape absolute -top-3 left-10 z-10 h-6 w-28 -rotate-3" />
              <span aria-hidden className="tape absolute -top-3 right-10 z-10 h-6 w-28 rotate-3" />
              <ClipPlayer id="explainer" stats={stats} controls autoPlay loop={false} />
              <div className="flex items-center justify-between px-1 pt-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
                <span>FIG. 00 — The explainer · rendered live with Remotion</span>
                <button type="button" onClick={() => setOpen(false)} className="inline-flex items-center gap-1 hover:text-fg" aria-label="Close video">
                  <X className="h-3.5 w-3.5" /> Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
