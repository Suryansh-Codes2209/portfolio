"use client";

import { motion } from "framer-motion";
import { Camera, CameraOff, Hand, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "requesting" | "loading" | "running" | "denied" | "error";

const MAX_SCROLL_PER_FRAME = 22;
const DEAD_ZONE = 0.13;
const EMA_ALPHA = 0.35;

export function GestureScroll({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [dismissed, setDismissed] = useState(false);
  const [hint, setHint] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const landmarkerRef = useRef<any>(null);
  const rafRef = useRef<number>(0);
  const smoothYRef = useRef(0.5);

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (landmarkerRef.current?.close) landmarkerRef.current.close();
    landmarkerRef.current = null;
    setStatus("idle");
    setHint("");
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    setStatus("requesting");
    setHint("Requesting camera…");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false,
      });
    } catch {
      setStatus("denied");
      setHint("Camera blocked — just scroll normally.");
      setTimeout(() => {
        setStatus("idle");
        setHint("");
      }, 2600);
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    if (!video) {
      stream.getTracks().forEach((t) => t.stop());
      setStatus("error");
      setHint("Video element not ready.");
      setTimeout(() => stop(), 1800);
      return;
    }
    video.srcObject = stream;
    await video.play().catch(() => {});

    setStatus("loading");
    setHint("Warming up the model…");

    let HandLandmarker: any;
    let FilesetResolver: any;
    try {
      const mod = await import("@mediapipe/tasks-vision");
      HandLandmarker = mod.HandLandmarker;
      FilesetResolver = mod.FilesetResolver;
    } catch {
      setStatus("error");
      setHint("Couldn't load gesture engine.");
      setTimeout(() => stop(), 2200);
      return;
    }

    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm",
      );
      landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
          delegate: "GPU",
        },
        numHands: 1,
        runningMode: "VIDEO",
      });
    } catch {
      setStatus("error");
      setHint("Gesture engine failed to start.");
      setTimeout(() => stop(), 2200);
      return;
    }

    setStatus("running");
    setHint("Raise your hand to scroll up, lower it to scroll down.");

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;
    smoothYRef.current = 0.5;
    let lastHandSeen = 0;

    const loop = () => {
      const lm = landmarkerRef.current;
      if (!lm || !video || video.readyState < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      const now = performance.now();
      let result: any;
      try {
        result = lm.detectForVideo(video, now);
      } catch {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hands = result?.landmarks ?? [];
      if (hands.length > 0) {
        lastHandSeen = now;
        const hand = hands[0];
        const wristY = hand[0].y;
        smoothYRef.current = smoothYRef.current * (1 - EMA_ALPHA) + wristY * EMA_ALPHA;

        if (ctx && canvas) {
          ctx.fillStyle = "#D97757";
          for (const pt of hand) {
            ctx.beginPath();
            ctx.arc((1 - pt.x) * canvas.width, pt.y * canvas.height, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        const norm = (smoothYRef.current - 0.5) * 2;
        const signed = Math.abs(norm) < DEAD_ZONE ? 0 : norm - Math.sign(norm) * DEAD_ZONE;
        const velocity = signed * MAX_SCROLL_PER_FRAME * 1.3;
        if (velocity !== 0) {
          window.scrollBy({ top: velocity, behavior: "instant" as ScrollBehavior });
        }
      } else if (now - lastHandSeen > 600) {
        smoothYRef.current = 0.5;
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [stop]);

  if (dismissed) return null;

  const running = status === "running";
  const busy = status === "requesting" || status === "loading";
  const errorish = status === "denied" || status === "error";

  const label =
    status === "idle" ? "Hand scroll" :
    status === "requesting" ? "Asking…" :
    status === "loading" ? "Loading…" :
    status === "denied" ? "Blocked" :
    status === "error" ? "Unavailable" :
    "Live";

  const Icon = busy ? Loader2 : errorish ? CameraOff : running ? Camera : Hand;

  return (
    <>
      <button
        type="button"
        onClick={running ? stop : start}
        disabled={busy}
        aria-pressed={running}
        className={`relative flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all duration-150 disabled:opacity-60 ${
          running
            ? "border-claude-500/60 bg-claude-500/10 text-claude-200 hover:border-claude-400 hover:text-white"
            : errorish
            ? "border-zinc-800 text-zinc-500"
            : "border-zinc-800 text-zinc-500 hover:border-claude-500/40 hover:text-claude-300"
        } ${className}`}
      >
        <Icon className={`w-3 h-3 ${busy ? "animate-spin" : ""}`} />
        <span>{label}</span>
        {running && (
          <span className="relative flex h-1.5 w-1.5 ml-0.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-claude-500 opacity-80" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-claude-500" />
          </span>
        )}
      </button>

      {/* Floating live panel — always mounted so refs are valid before "running" flips. */}
      <motion.div
        animate={{
          opacity: running ? 1 : 0,
          y: running ? 0 : -6,
          scale: running ? 1 : 0.95,
        }}
        transition={{ duration: 0.25 }}
        className="fixed right-5 top-20 z-[80] flex flex-col items-end gap-2"
        style={{ pointerEvents: running ? "auto" : "none" }}
        aria-hidden={!running}
      >
        <div className="relative w-40 h-32 rounded-xl overflow-hidden border border-claude-500/40 bg-black shadow-[0_0_30px_rgba(217,119,87,0.25)]">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            width={160}
            height={128}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
          <div className="absolute top-1.5 left-1.5 flex items-center gap-1 text-[9px] tracking-[0.25em] uppercase text-claude-200 bg-black/50 px-1.5 py-0.5 rounded">
            <Camera className="w-2.5 h-2.5" /> live
          </div>
        </div>
        <button
          onClick={stop}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-700 text-[10px] tracking-[0.25em] uppercase text-zinc-400 hover:text-white hover:border-zinc-500 bg-black/60 backdrop-blur"
        >
          <X className="w-2.5 h-2.5" /> Stop
        </button>
        {hint && (
          <div className="max-w-[220px] text-right text-[10px] tracking-[0.12em] text-zinc-400 leading-relaxed">
            {hint}
          </div>
        )}
      </motion.div>
    </>
  );
}
