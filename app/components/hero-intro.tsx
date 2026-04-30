"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const IntroScene = dynamic(
  () => import("./intro-scene").then((m) => m.IntroScene),
  { ssr: false, loading: () => null },
);

const STORAGE_KEY = "claude-intro-seen";

const PHASES = [
  { name: "Form", range: [0.0, 0.25] as const },
  { name: "Morph", range: [0.25, 0.55] as const },
  { name: "Build", range: [0.55, 0.82] as const },
  { name: "Emit", range: [0.82, 1.0] as const },
];

function currentPhase(p: number) {
  for (let i = PHASES.length - 1; i >= 0; i--) {
    if (p >= PHASES[i].range[0]) return i;
  }
  return 0;
}

function FlashLayer({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const p = progressRef.current;
        const flash = p > 0.78 ? Math.min(1, (p - 0.78) / 0.18) : 0;
        el.style.opacity = String(Math.pow(flash, 0.8) * 0.95);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #FFE5CF 0%, #D97757 18%, #C15F3C 35%, rgba(193,95,60,0.12) 55%, transparent 75%)",
        mixBlendMode: "screen",
        opacity: 0,
      }}
    />
  );
}

function ProgressBar({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (labelRef.current) {
        labelRef.current.textContent = Math.round(p * 100).toString().padStart(3, "0");
      }
      if (phaseRef.current) {
        const idx = currentPhase(p);
        phaseRef.current.textContent = `${idx + 1}/${PHASES.length} · ${PHASES[idx].name}`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);
  return (
    <div className="w-[260px] flex flex-col gap-2">
      <div className="flex items-center justify-between text-[9px] tracking-[0.3em] uppercase text-zinc-500">
        <span ref={phaseRef}>1/4 · Form</span>
        <span ref={labelRef} className="font-mono text-claude-400/80">000</span>
      </div>
      <div className="relative h-[2px] w-full bg-zinc-900 overflow-hidden">
        <div
          ref={barRef}
          className="absolute inset-0 origin-left bg-gradient-to-r from-claude-500 to-claude-300"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}

export function HeroIntro() {
  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playedRef = useRef(false);
  const primedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

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
    const audio = new Audio("/sounds/fahhh.mp3");
    audio.preload = "auto";
    audio.volume = 0.7;
    audio.load();
    audioRef.current = audio;
  }, []);

  useEffect(() => {
    if (!active || !started) return;

    const prevOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const clamp = (n: number) => Math.max(0, Math.min(1, n));

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current = clamp(targetRef.current + e.deltaY * 0.0012);
    };

    let lastY = 0;
    const onTouchStart = (e: TouchEvent) => {
      lastY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const y = e.touches[0].clientY;
      targetRef.current = clamp(targetRef.current + (lastY - y) * 0.0025);
      lastY = y;
    };

    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", " ", "PageDown", "End"].includes(e.key)) {
        e.preventDefault();
        targetRef.current = clamp(targetRef.current + (e.key === "End" ? 1 : 0.1));
      } else if (["ArrowUp", "PageUp", "Home"].includes(e.key)) {
        e.preventDefault();
        targetRef.current = clamp(targetRef.current - (e.key === "Home" ? 1 : 0.1));
      } else if (e.key === "Escape") {
        targetRef.current = 1;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);

    const tick = () => {
      const cur = progressRef.current;
      const tgt = targetRef.current;
      progressRef.current = cur + (tgt - cur) * 0.085;
      if (tgt >= 0.999 && progressRef.current > 0.985) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        if (!playedRef.current && audioRef.current) {
          playedRef.current = true;
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch((err) => {
            console.warn("[hero-intro] audio play failed:", err);
          });
        }
        setDone(true);
        setActive(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [active, started]);

  const skip = () => {
    handleBegin();
    targetRef.current = 1;
  };

  const handleBegin = () => {
    if (!primedRef.current && audioRef.current) {
      const a = audioRef.current;
      primedRef.current = true;
      a.muted = true;
      a.play()
        .then(() => {
          a.pause();
          a.currentTime = 0;
          a.muted = false;
        })
        .catch((err) => {
          primedRef.current = false;
          a.muted = false;
          console.warn("[hero-intro] audio prime failed:", err);
        });
    }
    setStarted(true);
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {active && !done && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: "easeOut" } }}
          className="fixed inset-0 z-[200] bg-black overflow-hidden"
          style={{ touchAction: "none" }}
        >
          <IntroScene progressRef={progressRef} />
          <FlashLayer progressRef={progressRef} />

          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 to-transparent" />

          <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] tracking-[0.3em] text-claude-400/80 uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-claude-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-claude-500" />
            </span>
            Scroll to advance
          </div>

          <button
            onClick={skip}
            className="absolute top-6 right-6 text-[10px] tracking-[0.3em] text-zinc-500 hover:text-claude-300 uppercase transition-colors"
          >
            Skip →
          </button>

          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center gap-3">
            <ProgressBar progressRef={progressRef} />
            <motion.svg
              width="22"
              height="34"
              viewBox="0 0 22 34"
              fill="none"
              className="opacity-60 text-zinc-500"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <rect x="1" y="1" width="20" height="32" rx="10" stroke="currentColor" strokeWidth="1.2" />
              <motion.circle
                cx="11"
                cy="10"
                r="2"
                fill="#D97757"
                animate={{ cy: [10, 20, 10] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.svg>
          </div>

          <div className="pointer-events-none absolute bottom-6 right-6 text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
            Suryansh · 2026
          </div>

          <AnimatePresence>
            {!started && (
              <motion.button
                key="begin-gate"
                type="button"
                onClick={handleBegin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-5 bg-black/85 backdrop-blur-sm cursor-pointer"
              >
                <span className="relative flex h-16 w-16 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-claude-500/40" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-claude-500 shadow-[0_0_24px_rgba(217,119,87,0.8)]" />
                </span>
                <span className="font-display text-2xl text-zinc-100 tracking-tight">Click to begin</span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-zinc-500">Sound on · Scroll to advance</span>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
