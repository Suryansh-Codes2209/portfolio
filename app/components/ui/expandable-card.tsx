"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/app/lib/utils";

// Ported from Aceternity UI's Expandable Card (MIT, Manu Arora — 21st.dev/@manuarora700).
// A card that morphs into a centred sheet via a shared layoutId; Escape or a
// click outside closes it.

interface ExpandableCardProps {
  preview: ReactNode;
  children: ReactNode;
  label: string;
  className?: string;
  sheetClassName?: string;
}

export function ExpandableCard({ preview, children, label, className, sheetClassName }: ExpandableCardProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.button
        type="button"
        layoutId={`card-${id}`}
        onClick={() => setOpen(true)}
        aria-label={`Open ${label}`}
        className={cn("block w-full text-left", className)}
      >
        {preview}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-[#1a1714]/50 p-4 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              ref={sheetRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              layoutId={`card-${id}`}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "paper relative max-h-[85dvh] w-full max-w-2xl overflow-y-auto p-7 outline-none sm:p-10",
                sheetClassName,
              )}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-line text-fg-subtle hover:text-fg"
              >
                <X className="h-4 w-4" />
              </button>
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
