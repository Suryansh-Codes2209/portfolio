"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Radio, Zap } from "lucide-react";

type NowItem = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  span: string;
  badge?: string;
  featured?: boolean;
};

const items: NowItem[] = [
  { icon: <Radio className="w-4 h-4 text-claude-400" />, title: "Building Oratora", desc: "A real-time audience-engagement platform — live polls, word clouds, Q&A and quizzes the whole room joins from their phones, no app install. Next.js 16, Socket.IO over Redis, Postgres.", span: "sm:col-span-2 sm:row-span-2", badge: "Launching soon", featured: true },
  { icon: <Zap className="w-4 h-4 text-claude-300" />, title: "Shipping MacGet 1.2", desc: "YouTube & HLS video downloads, browser-capture, and signed auto-updates for the macOS download manager.", span: "" },
  { icon: <Code2 className="w-4 h-4 text-claude-300" />, title: "Writing build logs", desc: "Documenting how the download engine, actor concurrency, and AI agents actually get built — in public.", span: "" },
  { icon: <Cpu className="w-4 h-4 text-claude-400" />, title: "AI agents in production", desc: "Financial research agents at Spiral Kite Labs — live market data, grounded reasoning, analyst-grade reports.", span: "sm:col-span-3" },
];

export function NowBento() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-[minmax(140px,auto)]">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: i * 0.07 }}
          className={`p-6 rounded-2xl border border-line bg-surface hover:border-claude-500/30 transition-colors flex flex-col ${item.span}`}
        >
          <div className="mb-3 flex items-center gap-2">
            {item.icon}
            {item.badge && (
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-accent/30 bg-accent-soft text-accent-text">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {item.badge}
              </span>
            )}
          </div>
          <h3 className={`font-medium text-fg mb-1.5 ${item.featured ? "text-lg" : "text-sm"}`}>{item.title}</h3>
          <p className="text-xs text-fg-subtle leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
