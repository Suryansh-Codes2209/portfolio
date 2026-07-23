"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "recognition-intro-seen";

type Greeting = { lang: string; text: string };

// Hello first — it's the universal fallback and the closing word.
const GREETINGS: Greeting[] = [
  { lang: "en", text: "Hello" },
  { lang: "hi", text: "नमस्ते" },
  { lang: "es", text: "Hola" },
  { lang: "fr", text: "Bonjour" },
  { lang: "ja", text: "こんにちは" },
  { lang: "ko", text: "안녕하세요" },
  { lang: "zh", text: "你好" },
  { lang: "ar", text: "مرحبا" },
  { lang: "it", text: "Ciao" },
  { lang: "pt", text: "Olá" },
  { lang: "de", text: "Hallo" },
  { lang: "ru", text: "Привет" },
  { lang: "bn", text: "নমস্কার" },
  { lang: "ta", text: "வணக்கம்" },
  { lang: "te", text: "నమస్కారం" },
  { lang: "pa", text: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ" },
  { lang: "gu", text: "નમસ્તે" },
  { lang: "tr", text: "Merhaba" },
  { lang: "el", text: "Γεια σας" },
  { lang: "he", text: "שלום" },
  { lang: "th", text: "สวัสดี" },
  { lang: "vi", text: "Xin chào" },
  { lang: "id", text: "Halo" },
  { lang: "pl", text: "Cześć" },
  { lang: "sv", text: "Hej" },
];

const WORD_MS = 1050;
const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789#$%&*+";

// Visitor's language plays first; 4–5 shuffled others fill the middle; Hello closes.
function buildSequence(locale: string): Greeting[] {
  const primary = locale.split("-")[0].toLowerCase();
  const hello = GREETINGS[0];
  const visitor = GREETINGS.find((g) => g.lang === primary) ?? hello;
  const rest = GREETINGS.filter((g) => g !== visitor && g !== hello);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return visitor === hello
    ? [hello, ...rest.slice(0, 5)]
    : [visitor, ...rest.slice(0, 4), hello];
}

// Grapheme-aware split so matras/combining marks stay attached. Cursive scripts
// (Arabic) are kept whole — per-glyph spans would break letter joining.
function splitUnits(word: string): string[] {
  if (/[؀-ۿ]/.test(word)) return [word];
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(word), (s) => s.segment);
  }
  return Array.from(word);
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Mac/.test(ua)) return "macOS";
  if (/Windows/.test(ua)) return "Windows";
  if (/Linux/.test(ua)) return "Linux";
  return "unknown";
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "browser";
}

/** Real measurement: HEAD round-trip for latency, then a ~200KB cache-busted
 *  download for throughput. Network Information API is only an instant first guess. */
function useSpeedTest(active: boolean) {
  const [latency, setLatency] = useState<number | null>(null);
  const [mbps, setMbps] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  const [measured, setMeasured] = useState(false);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    try {
      const conn = (navigator as { connection?: { downlink?: number } }).connection;
      if (conn?.downlink) setMbps(conn.downlink);
    } catch {}
    (async () => {
      try {
        const t0 = performance.now();
        await fetch(`/probe.bin?ping=${t0}`, { method: "HEAD", cache: "no-store" });
        if (cancelled) return;
        setLatency(Math.max(1, Math.round(performance.now() - t0)));

        const t1 = performance.now();
        const res = await fetch(`/probe.bin?nc=${t1}`, { cache: "no-store" });
        const buf = await res.arrayBuffer();
        const secs = (performance.now() - t1) / 1000;
        if (cancelled || secs <= 0) return;
        setMbps(Math.round(((buf.byteLength * 8) / secs / 1e6) * 10) / 10);
        setMeasured(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [active]);

  return { latency, mbps, failed, measured };
}

type SysInfo = {
  res: string;
  os: string;
  browser: string;
  locale: string;
  cores: number | null;
};

function useDiagnostics(active: boolean) {
  const [clock, setClock] = useState("");
  const [battery, setBattery] = useState<number | null>(null);
  const [fps, setFps] = useState<number | null>(null);
  const [sys, setSys] = useState<SysInfo | null>(null);

  useEffect(() => {
    if (!active) return;
    try {
      setSys({
        res: `${window.screen.width}×${window.screen.height} @${window.devicePixelRatio}x`,
        os: detectOS(),
        browser: detectBrowser(),
        locale: navigator.language,
        cores: navigator.hardwareConcurrency ?? null,
      });
    } catch {}

    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      );
    tick();
    const clockId = window.setInterval(tick, 1000);

    try {
      const nav = navigator as { getBattery?: () => Promise<{ level: number }> };
      nav.getBattery?.()
        .then((b) => setBattery(Math.round(b.level * 100)))
        .catch(() => {});
    } catch {}

    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      frames++;
      if (t - last >= 500) {
        setFps(Math.round((frames * 1000) / (t - last)));
        frames = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.clearInterval(clockId);
      cancelAnimationFrame(raf);
    };
  }, [active]);

  return { clock, battery, fps, sys };
}

type Weather = {
  available: boolean;
  city?: string;
  tempC?: number;
  condition?: string;
  kind?: "rain" | "snow" | "clear" | "cloudy";
  isNight?: boolean;
};

function useWeather(active: boolean) {
  const [weather, setWeather] = useState<Weather | null>(null);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    fetch("/api/weather")
      .then((r) => r.json())
      .then((w: Weather) => {
        if (!cancelled && w?.available) setWeather(w);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [active]);
  return weather;
}

// Time-of-day backdrop tint — the permanent fallback under any weather layer.
function backdropTint(hour: number): string {
  if (hour >= 20 || hour < 5) return "rgba(99, 102, 241, 0.09)"; // night indigo
  if (hour < 8 || hour >= 17) return "rgba(217, 119, 87, 0.13)"; // dawn / dusk amber
  return "rgba(217, 119, 87, 0.06)"; // day, neutral warm
}

function RainLayer() {
  const drops = useMemo(
    () =>
      Array.from({ length: 55 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 3,
        dur: 1.8 + Math.random() * 1.2,
        h: 28 + Math.random() * 42,
        op: 0.08 + Math.random() * 0.18,
      })),
    [],
  );
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {drops.map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: -80,
            left: `${d.left}%`,
            width: 1,
            height: d.h,
            background: "linear-gradient(to bottom, transparent, rgba(176, 196, 230, 0.55))",
            opacity: d.op,
            animation: `intro-fall ${d.dur}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}

function SnowLayer() {
  const flecks = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        dur: 4 + Math.random() * 4,
        size: 1.5 + Math.random() * 2,
        op: 0.15 + Math.random() * 0.3,
      })),
    [],
  );
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {flecks.map((f, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: -10,
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            borderRadius: "50%",
            background: "rgba(220, 230, 245, 0.8)",
            opacity: f.op,
            animation: `intro-drift ${f.dur}s linear ${f.delay}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}

function StarsLayer() {
  const stars = useMemo(
    () =>
      Array.from({ length: 26 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 55,
        size: 1 + Math.random() * 1.5,
        delay: Math.random() * 3,
        dur: 2 + Math.random() * 3,
      })),
    [],
  );
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6 }}
    >
      {stars.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "rgba(230, 235, 250, 0.9)",
            animation: `intro-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </motion.div>
  );
}

/** One greeting word: glyphs scramble-decode in, a shine sweeps across them
 *  (speed mapped to measured Mbps), and each glyph repels from the cursor. */
function ScrambleWord({ word, shineDur }: { word: string; shineDur: number }) {
  const units = useMemo(() => splitUnits(word), [word]);
  const [display, setDisplay] = useState<string[]>(() => units.map(() => " "));
  const glyphRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Scramble-decode: each glyph churns random chars, settling left to right.
  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => {
      const t = performance.now() - start;
      let done = true;
      setDisplay(
        units.map((u, i) => {
          if (t >= 110 + i * 34) return u;
          done = false;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }),
      );
      if (done) window.clearInterval(id);
    }, 34);
    return () => window.clearInterval(id);
  }, [units]);

  // Cursor magnetism: glyphs gently repel from the pointer. Pointer devices only.
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const el of glyphRefs.current) {
          if (!el) continue;
          const r = el.getBoundingClientRect();
          const dx = r.left + r.width / 2 - e.clientX;
          const dy = r.top + r.height / 2 - e.clientY;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 0) {
            const f = ((120 - dist) / 120) * 15;
            el.style.transform = `translate(${(dx / dist) * f}px, ${(dy / dist) * f}px)`;
          } else {
            el.style.transform = "";
          }
        }
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const gradient =
    "linear-gradient(110deg, #e4e4e7 0%, #e4e4e7 42%, #D97757 50%, #e4e4e7 58%, #e4e4e7 100%)";

  return (
    <span className="inline-flex" style={{ whiteSpace: "pre" }}>
      {display.map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            glyphRefs.current[i] = el;
          }}
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            backgroundImage: gradient,
            backgroundSize: "250% 100%",
            backgroundRepeat: "no-repeat",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
            transition: "transform 0.25s ease-out",
            animation: `intro-shine ${shineDur}s cubic-bezier(.2,.7,.2,1) ${0.12 + i * 0.04}s both`,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export function HeroIntro() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [sequence, setSequence] = useState<Greeting[] | null>(null);
  const [wordIndex, setWordIndex] = useState(0);

  const { latency, mbps, failed } = useSpeedTest(active);
  const { clock, battery, fps, sys } = useDiagnostics(active);
  const weather = useWeather(active);

  const tint = useMemo(() => backdropTint(new Date().getHours()), []);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    if (reduced || seen) {
      setDone(true);
      return;
    }
    setSequence(buildSequence(navigator.language));
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

  // Advance the greeting cycle; hold the closing word briefly, then wipe out.
  useEffect(() => {
    if (!active || done || !sequence) return;
    const last = wordIndex >= sequence.length - 1;
    const id = window.setTimeout(
      () => (last ? skip() : setWordIndex((i) => i + 1)),
      last ? WORD_MS + 250 : WORD_MS,
    );
    return () => window.clearTimeout(id);
  }, [active, done, sequence, wordIndex, skip]);

  if (!mounted) return null;

  // Fast connection → quick crisp sweep; slow → languid. Default before measurement.
  const shineDur = mbps ? Math.min(1.4, Math.max(0.45, 60 / (mbps + 25))) : 0.9;

  const speedText = failed
    ? "offline?"
    : mbps
      ? `↓ ${mbps.toFixed(1)} Mbps${latency ? ` · ${latency}ms` : ""}`
      : "measuring…";

  const showStars = weather?.kind === "clear" && weather?.isNight;

  return (
    <AnimatePresence>
      {active && !done && sequence && (
        <motion.div
          key="intro"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          onClick={skip}
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-black"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 42%, ${tint}, transparent 62%)`,
            }}
          />

          {weather?.kind === "rain" && <RainLayer />}
          {weather?.kind === "snow" && <SnowLayer />}
          {showStars && <StarsLayer />}

          {/* Greeting */}
          <div className="relative px-6 text-center font-display text-5xl sm:text-7xl">
            <ScrambleWord key={wordIndex} word={sequence[wordIndex].text} shineDur={shineDur} />
          </div>

          {/* Edge diagnostics — the "device scan" */}
          <motion.div
            className="pointer-events-none absolute left-5 top-5 font-mono text-[10px] tracking-wider text-sky-300/80 sm:text-[11px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {sys?.res}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute right-5 top-5 text-right font-mono text-[10px] tracking-wider text-emerald-300/80 sm:text-[11px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.8 }}
          >
            {clock}
            {battery !== null && <div>{battery}% battery</div>}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-5 left-5 font-mono text-[10px] tracking-wider text-violet-300/80 sm:text-[11px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            {sys && (
              <div>
                {sys.os} · {sys.browser} · {sys.locale}
                {sys.cores ? ` · ${sys.cores} cores` : ""}
                {fps !== null ? ` · ${fps} fps` : ""}
              </div>
            )}
            {weather?.available && (
              <div className="text-amber-200/80">
                {[weather.city, weather.tempC !== undefined ? `${weather.tempC}°C` : null, weather.condition]
                  .filter(Boolean)
                  .join(" · ")}
              </div>
            )}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-5 right-5 text-right font-mono text-[10px] tracking-wider text-claude-300 sm:text-[11px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.8 }}
          >
            {speedText}
          </motion.div>

          <motion.div
            className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
          >
            tap or press any key to skip
          </motion.div>

          <style jsx global>{`
            @keyframes intro-shine {
              from {
                background-position: 120% center;
              }
              to {
                background-position: -20% center;
              }
            }
            @keyframes intro-fall {
              to {
                transform: translateY(115vh);
              }
            }
            @keyframes intro-drift {
              to {
                transform: translateY(112vh) translateX(24px);
              }
            }
            @keyframes intro-twinkle {
              0%,
              100% {
                opacity: 0.15;
              }
              50% {
                opacity: 0.9;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
