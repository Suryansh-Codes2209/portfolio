"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2, Rss } from "lucide-react";

type State = "idle" | "loading" | "success" | "error";

export function SubscribeForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setState("success");
        setMessage(data.message ?? "Check your inbox to confirm.");
      } else {
        setState("error");
        setMessage(data.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <div
      className={`rounded-2xl border border-accent/25 bg-accent-soft p-6 sm:p-7 ${
        compact ? "" : "sm:p-8"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl text-fg">Get new build logs in your inbox</h3>
          <p className="mt-1.5 text-sm text-fg-muted">
            New engineering write-ups on MacGet and AI systems. No spam, unsubscribe anytime.
          </p>
        </div>
        <a
          href="/rss.xml"
          aria-label="RSS feed"
          className="mt-1 shrink-0 rounded-lg border border-line p-2 text-fg-subtle transition-colors hover:border-line-strong hover:text-accent-text"
        >
          <Rss className="h-4 w-4" />
        </a>
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait" initial={false}>
          {state === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-sm text-emerald-500"
            >
              <Check className="h-4 w-4" />
              {message}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={submit}
              initial={false}
              animate={state === "error" ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (state === "error") setState("idle");
                }}
                placeholder="you@example.com"
                disabled={state === "loading"}
                className="flex-1 rounded-lg border border-line bg-bg px-3.5 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-fg-faint focus:border-accent/50"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {state === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
        {state === "error" && (
          <p className="mt-2 text-xs text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
}
