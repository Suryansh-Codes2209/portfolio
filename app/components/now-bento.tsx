"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Zap } from "lucide-react";

const items = [
  { icon: <Zap className="w-4 h-4 text-claude-400" />, title: "Shipping MacGet 1.2", desc: "YouTube & HLS video downloads, browser-capture, and signed auto-updates for the macOS download manager.", span: "sm:col-span-2 sm:row-span-2" },
  { icon: <Code2 className="w-4 h-4 text-claude-300" />, title: "Writing build logs", desc: "Documenting how the download engine, actor concurrency, and AI agents actually get built — in public.", span: "" },
  { icon: <Cpu className="w-4 h-4 text-claude-400" />, title: "AI agents in production", desc: "Financial research agents at Spiral Kite Labs — live market data, grounded reasoning, analyst-grade reports.", span: "" },
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
          <div className="mb-3">{item.icon}</div>
          <h3 className={`font-medium text-fg mb-1.5 ${item.span ? "text-lg" : "text-sm"}`}>{item.title}</h3>
          <p className="text-xs text-fg-subtle leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
