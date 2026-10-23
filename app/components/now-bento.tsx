"use client";

import { motion } from "framer-motion";
import { Code2, Cpu, Radio, Zap } from "lucide-react";
import { BentoCard, BentoGrid } from "./ui/bento-grid";
import { Stamp } from "./vox/stamp";

type NowItem = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  span: string;
  tint: "sheet" | "yellow" | "pink" | "blue";
  tilt: string;
  badge?: string;
  featured?: boolean;
};

const items: NowItem[] = [
  { icon: <Radio className="w-4 h-4" />, title: "Building Oratora", desc: "A real-time audience-engagement platform — live polls, word clouds, Q&A and quizzes the whole room joins from their phones, no app install. Next.js 16, Socket.IO over Redis, Postgres.", span: "sm:col-span-2 sm:row-span-2", tint: "yellow", tilt: "-rotate-1", badge: "Launching soon", featured: true },
  { icon: <Zap className="w-4 h-4" />, title: "Shipping MacGet 1.2", desc: "YouTube & HLS video downloads, browser-capture, and signed auto-updates for the macOS download manager.", span: "", tint: "pink", tilt: "rotate-2" },
  { icon: <Code2 className="w-4 h-4" />, title: "Writing build logs", desc: "Documenting how the download engine, actor concurrency, and AI agents actually get built — in public.", span: "", tint: "blue", tilt: "-rotate-2" },
  { icon: <Cpu className="w-4 h-4" />, title: "AI agents in production", desc: "Financial research agents at Spiral Kite Labs — live market data, grounded reasoning, analyst-grade reports.", span: "sm:col-span-3", tint: "sheet", tilt: "rotate-[0.5deg]" },
];

/** The #now board: sticky notes taped up as things move. */
export function NowBento() {
  return (
    <BentoGrid className="gap-7">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: -40, rotate: -6 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", damping: 14, stiffness: 140, delay: i * 0.08 }}
          className={item.span}
        >
          <BentoCard
            name={item.title}
            description={item.desc}
            icon={item.icon}
            tint={item.tint}
            featured={item.featured}
            className={`h-full ${item.tilt}`}
            badge={item.badge ? <Stamp className="ml-auto text-[10px]" rotate={6}>{item.badge}</Stamp> : undefined}
          />
        </motion.div>
      ))}
    </BentoGrid>
  );
}
