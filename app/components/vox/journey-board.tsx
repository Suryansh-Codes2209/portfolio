"use client";

import { Children, type ReactNode, useEffect, useRef, useState } from "react";

type Move = "right" | "down" | "left";

// The route the camera takes across the board: the current section slides
// out to the left, then up, then right, then up… a snake through two columns.
const PATTERN: Move[] = ["right", "down", "left", "down"];

type Seg = { start: number; end: number; panel: number; kind: "dwell" | "move" };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Lays its children out as full-screen panels on a 2D board and turns
 * vertical scrolling into a camera journey across it. A panel taller than the
 * screen is read top-to-bottom first ("dwell"), then the camera pans to the
 * next panel ("move"). The camera eases toward the scroll position rather
 * than tracking it 1:1, and when scrolling stops mid-pan the pan finishes in
 * the direction you were going — every section is a scroll target, and you
 * never get pulled back to the one you just left.
 *
 * Below `lg`, or with reduced motion, the panels simply stack — the same
 * markup, read the normal way.
 */
export function JourneyBoard({ children, labels }: { children: ReactNode; labels: string[] }) {
  const panels = Children.toArray(children);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const innerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hudRef = useRef<SVGPathElement>(null);
  const hudDotRef = useRef<SVGGElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [layout, setLayout] = useState<{ W: number; H: number; segs: Seg[]; total: number } | null>(null);
  const [current, setCurrent] = useState(0);

  // grid cell of every panel along the snake
  const cells = panels.reduce<{ c: number; r: number }[]>((acc, _, i) => {
    if (i === 0) return [{ c: 0, r: 0 }];
    const prev = acc[i - 1];
    const m = PATTERN[(i - 1) % PATTERN.length];
    acc.push(m === "right" ? { c: prev.c + 1, r: prev.r } : m === "left" ? { c: prev.c - 1, r: prev.r } : { c: prev.c, r: prev.r + 1 });
    return acc;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const on = () => setEnabled(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // measure: viewport size + how far each panel's content overflows it
  useEffect(() => {
    if (!enabled) {
      setLayout(null);
      return;
    }
    const measure = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const segs: Seg[] = [];
      let y = 0;
      panels.forEach((_, i) => {
        const h = innerRefs.current[i]?.scrollHeight ?? H;
        const dwell = Math.max(0, h - H);
        segs.push({ start: y, end: y + dwell, panel: i, kind: "dwell" });
        y += dwell;
        if (i < panels.length - 1) {
          const len = Math.round(H * 0.65);
          segs.push({ start: y, end: y + len, panel: i, kind: "move" });
          y += len;
        }
      });
      setLayout({ W, H, segs, total: y });
    };
    measure();
    const ro = new ResizeObserver(measure);
    innerRefs.current.forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, panels.length]);

  // scroll → camera
  useEffect(() => {
    if (!layout) return;
    const { W, H, segs, total } = layout;
    let raf = 0;
    let last = performance.now();
    let smoothY: number | null = null; // the camera eases toward the real scroll position
    let dir = 1; // last scroll direction: snapping always continues this way
    let prevScroll = window.scrollY;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let tween = 0; // rAF id of a running snap
    let tweening = false;

    const local = () => {
      const root = rootRef.current;
      return root ? Math.min(total, Math.max(0, window.scrollY - root.offsetTop)) : 0;
    };

    const render = (y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const seg = segs.find((s) => y >= s.start && y <= s.end) ?? segs[segs.length - 1];
      const i = seg.panel;
      let cx = cells[i].c * W;
      let cy = cells[i].r * H;
      let progress = i; // fractional panel index, for the HUD

      innerRefs.current.forEach((el, k) => {
        if (!el) return;
        const own = segs.find((s) => s.panel === k && s.kind === "dwell");
        if (!own) return;
        const off = y <= own.start ? 0 : Math.min(own.end - own.start, y - own.start);
        el.style.transform = `translate3d(0, ${-off}px, 0)`;
      });

      if (seg.kind === "move") {
        const t = easeInOut((y - seg.start) / (seg.end - seg.start || 1));
        cx += (cells[i + 1].c - cells[i].c) * W * t;
        cy += (cells[i + 1].r - cells[i].r) * H * t;
        progress = i + t;
      }
      canvas.style.transform = `translate3d(${-cx}px, ${-cy}px, 0)`;

      // HUD: route travelled so far + the "you are here" dot
      const hud = hudRef.current;
      if (hud) hud.style.strokeDashoffset = String(1 - progress / (panels.length - 1));
      const dot = hudDotRef.current;
      if (dot) {
        const a = cells[Math.floor(progress)];
        const b = cells[Math.min(panels.length - 1, Math.floor(progress) + 1)];
        const f = progress - Math.floor(progress);
        dot.setAttribute("transform", `translate(${hx(a.c + (b.c - a.c) * f)} ${hy(a.r + (b.r - a.r) * f)})`);
      }
      setCurrent(Math.round(progress));
    };

    // critically-damped follow: frame-rate independent, ~120ms to settle
    const tick = (now: number) => {
      raf = 0;
      const dt = Math.min(64, now - last);
      last = now;
      const target = local();
      smoothY = smoothY === null ? target : smoothY + (target - smoothY) * (1 - Math.exp(-dt / 70));
      if (Math.abs(target - smoothY) < 0.4) smoothY = target;
      render(smoothY);
      if (smoothY !== target) raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const stopTween = () => {
      if (tween) cancelAnimationFrame(tween);
      tween = 0;
      tweening = false;
    };

    // a stop inside a pan finishes the pan in the direction you were going
    const snap = () => {
      const root = rootRef.current;
      if (!root || tweening) return;
      const y = local();
      const seg = segs.find((s) => s.kind === "move" && y > s.start + 1 && y < s.end - 1);
      if (!seg) return;
      const to = root.offsetTop + (dir > 0 ? seg.end : seg.start);
      const from = window.scrollY;
      const dur = 260 + 380 * (Math.abs(to - from) / (seg.end - seg.start));
      const t0 = performance.now();
      tweening = true;
      const step = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        window.scrollTo(0, from + (to - from) * (1 - (1 - t) ** 3));
        if (t < 1) tween = requestAnimationFrame(step);
        else stopTween();
      };
      tween = requestAnimationFrame(step);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (!tweening && y !== prevScroll) dir = y > prevScroll ? 1 : -1;
      prevScroll = y;
      wake();
      clearTimeout(idle);
      if (!tweening) idle = setTimeout(snap, 140);
    };
    // any real input takes over from a running snap
    const onInput = () => {
      if (tweening) stopTween();
    };

    // in-page #anchors point at panels the browser can't scroll to on its own
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const root = rootRef.current;
      if (!a || !root) return;
      const target = document.getElementById(a.hash.slice(1));
      const k = innerRefs.current.findIndex((el) => el?.contains(target));
      if (!target || k < 0) return;
      e.preventDefault();
      const own = segs.find((s) => s.panel === k && s.kind === "dwell");
      window.scrollTo({ top: root.offsetTop + (own?.start ?? 0), behavior: "smooth" });
      history.replaceState(null, "", a.hash);
    };

    wake();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("touchstart", onInput, { passive: true });
    window.addEventListener("keydown", onInput);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("touchstart", onInput);
      window.removeEventListener("keydown", onInput);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      stopTween();
      clearTimeout(idle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  if (!enabled || !layout) {
    return (
      <div>
        {panels.map((p, i) => (
          <div key={i} ref={(el) => void (innerRefs.current[i] = el)}>
            {p}
          </div>
        ))}
      </div>
    );
  }

  const { W, H, total } = layout;
  const cols = Math.max(...cells.map((c) => c.c)) + 1;
  const rows = Math.max(...cells.map((c) => c.r)) + 1;
  const route = cells.map((c, i) => `${i ? "L" : "M"} ${hx(c.c)} ${hy(c.r)}`).join(" ");

  return (
    <div ref={rootRef} style={{ height: total + H }} className="relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={canvasRef} className="absolute left-0 top-0 will-change-transform" style={{ width: cols * W, height: rows * H }}>
          {panels.map((p, i) => (
            <div
              key={i}
              className="absolute overflow-hidden bg-bg shadow-[0_0_0_1px_var(--line-strong),0_30px_60px_-30px_rgba(0,0,0,0.5)]"
              style={{ left: cells[i].c * W, top: cells[i].r * H, width: W, height: H }}
            >
              <div
                ref={(el) => void (innerRefs.current[i] = el)}
                className="min-h-full will-change-transform [&>section]:flex [&>section]:min-h-screen [&>section]:flex-col [&>section]:justify-center"
              >
                {p}
              </div>
            </div>
          ))}
        </div>

        {/* the map of the journey, parked in the left gutter */}
        <nav
          aria-label="Journey map"
          className="group paper absolute left-3 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-2 border border-line px-2 py-3"
        >
          <p className="font-mono text-[9px] tracking-widest text-fg-faint">{String(current).padStart(2, "0")}</p>
          <svg width={hx(cols - 1) + 14} height={hy(rows - 1) + 14} className="overflow-visible">
            <path d={route} fill="none" stroke="var(--line-strong)" strokeWidth={2} strokeDasharray="2 4" />
            <path ref={hudRef} d={route} fill="none" stroke="var(--accent)" strokeWidth={2.5} pathLength={1} strokeDasharray={1} strokeDashoffset={1} />
            {cells.map((c, i) => (
              <circle key={i} cx={hx(c.c)} cy={hy(c.r)} r={3} fill={i <= current ? "var(--accent)" : "var(--surface)"} stroke="var(--fg-subtle)" strokeWidth={1} />
            ))}
            <g ref={hudDotRef}>
              <circle r={6} fill="var(--highlight)" stroke="var(--fg)" strokeWidth={1.5} />
            </g>
          </svg>
          {/* chapter name pops out to the right on hover */}
          <p className="paper pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap border border-line px-3 py-1.5 font-serif text-base text-fg opacity-0 transition-opacity group-hover:opacity-100">
            {labels[current]}
          </p>
        </nav>
      </div>
    </div>
  );
}

// HUD grid → pixels
const hx = (c: number) => 7 + c * 18;
const hy = (r: number) => 7 + r * 20;
