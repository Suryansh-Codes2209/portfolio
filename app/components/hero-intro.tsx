"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "claude-intro-seen";

const PROMPT = "build suryansh's portfolio --public";

type Step = { pending?: string; done: string; deploy?: boolean };

const LOG: Step[] = [
  { pending: "installing dependencies…", done: "next.js + tailwind ready" },
  { done: "hero" },
  { done: "#now — what i'm building" },
  { done: "projects · macget" },
  { done: "blog · build logs" },
  { done: "contact" },
  { pending: "deploying to production…", done: "live in 3.2s ⚡", deploy: true },
];

type Line = { text: string; done: boolean; deploy: boolean };

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

function Spinner() {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER.length);
    }, 80);
    return () => window.clearInterval(id);
  }, []);
  return <span className="text-claude-400">{SPINNER[frame]}</span>;
}

function FlashLayer({ trigger }: { trigger: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #FFE5CF 0%, #D97757 18%, #C15F3C 35%, rgba(193,95,60,0.12) 55%, transparent 75%)",
        mixBlendMode: "screen",
      }}
      initial={{ opacity: 0 }}
      animate={trigger ? { opacity: [0, 0.95, 0.7] } : { opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", times: [0, 0.4, 1] }}
    />
  );
}

export function HeroIntro() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [typed, setTyped] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    if (reduced || seen) {
      setDone(true);
      return;
    }
    setActive(true);
  }, []);

  const skip = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setActive(false);
    setDone(true);
  }, []);

  useEffect(() => {
    if (!active || done) return;
    const onKey = () => skip();
    window.addEventListener("keydown", onKey, { once: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [active, done, skip]);

  // Lock page scroll while the intro plays.
  useEffect(() => {
    if (!active || done) return;
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
    };
  }, [active, done]);

  // The cinematic sequence: type the prompt → stream the build log → boom → reveal.
  useEffect(() => {
    if (!active || done) return;
    let cancelled = false;
    const timeouts: number[] = [];
    const delay = (ms: number) =>
      new Promise<void>((resolve) => {
        timeouts.push(window.setTimeout(resolve, ms));
      });

    const run = async () => {
      await delay(300);

      for (let i = 1; i <= PROMPT.length; i++) {
        if (cancelled) return;
        setTyped(PROMPT.slice(0, i));
        await delay(22);
      }
      await delay(480);

      for (const step of LOG) {
        if (cancelled) return;
        setLines((prev) => [
          ...prev,
          { text: step.pending ?? step.done, done: !step.pending, deploy: !!step.deploy },
        ]);
        if (step.pending) {
          await delay(step.deploy ? 720 : 520);
          if (cancelled) return;
          setLines((prev) =>
            prev.map((l, i) =>
              i === prev.length - 1 ? { text: step.done, done: true, deploy: l.deploy } : l,
            ),
          );
        }
        await delay(160);
      }

      await delay(360);
      if (cancelled) return;

      // Boom (visual only)
      setFlash(true);

      await delay(680);
      if (cancelled) return;
      sessionStorage.setItem(STORAGE_KEY, "1");
      setActive(false);
      setDone(true);
    };
    run();

    return () => {
      cancelled = true;
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [active, done]);

  if (!mounted) return null;

  const typing = lines.length === 0;

  return (
    <AnimatePresence>
      {active && !done && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeOut" } }}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black px-4"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, rgba(217,119,87,0.09), transparent 60%)",
            }}
          />
          <FlashLayer trigger={flash} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-zinc-800 bg-black/90 font-mono shadow-2xl shadow-black/60"
          >
            <div className="flex items-center gap-2 border-b border-zinc-800/80 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-2 text-[11px] text-zinc-500">suryansh@portfolio: ~/portfolio</span>
            </div>

            <div className="min-h-[280px] px-5 py-5 text-[13px] leading-relaxed">
              <div className="flex text-zinc-200">
                <span className="mr-2 text-claude-400">$</span>
                <span>
                  {typed}
                  {typing && (
                    <span
                      className="ml-0.5 inline-block h-[15px] w-[7px] translate-y-[2px] bg-claude-400"
                      style={{ animation: "blink 1s step-end infinite" }}
                    />
                  )}
                </span>
              </div>

              <div className="mt-3 space-y-1.5">
                {lines.map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {line.done ? (
                      <span className={line.deploy ? "text-claude-300" : "text-claude-400"}>✓</span>
                    ) : (
                      <Spinner />
                    )}
                    <span className={line.done ? "text-zinc-300" : "text-zinc-500"}>{line.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="pointer-events-none absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.3em] text-zinc-600">
            Suryansh · 2026
          </div>

          <button
            onClick={skip}
            className="pointer-events-auto absolute bottom-6 right-6 text-[10px] uppercase tracking-[0.3em] text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            skip →
          </button>

          <style jsx>{`
            @keyframes blink {
              0%,
              100% {
                opacity: 1;
              }
              50% {
                opacity: 0;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
