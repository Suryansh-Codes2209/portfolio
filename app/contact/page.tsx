"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { Card } from "../components/card";
import { ShineText } from "../components/shine-text";

const socials = [
  {
    icon: <Github className="w-5 h-5" />,
    label: "GitHub",
    handle: "Suryansh-Codes2209",
    href: "https://github.com/Suryansh-Codes2209",
    description: "Check out my open-source work and contributions.",
  },
  {
    icon: <Twitter className="w-5 h-5" />,
    label: "Twitter / X",
    handle: "@Suryansh_2001",
    href: "https://x.com/Suryansh_2001",
    description: "Follow me for dev thoughts and updates.",
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    label: "LinkedIn",
    handle: "suryansh-chaudhary-2209",
    href: "https://www.linkedin.com/in/suryansh-chaudhary-2209/",
    description: "Let's connect professionally.",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    handle: "suryansh.codes2001@gmail.com",
    href: "mailto:suryansh.codes2001@gmail.com",
    description: "Best way to reach me for work enquiries.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.42, delay, ease: "easeOut" as const },
});

export default function ContactPage() {
  return (
    <div className="bg-black text-zinc-100 min-h-screen">
      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b border-zinc-800/50 bg-black/80">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back home
          </Link>
          <span className="text-xs text-zinc-600">Contact</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-28 pb-24">
        <motion.p {...fadeUp(0)} className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2">
          Say Hello
        </motion.p>
        <motion.h1 {...fadeUp(0.05)} className="text-3xl sm:text-4xl font-display mb-3">
          <ShineText>Get in Touch</ShineText>
        </motion.h1>
        <motion.p {...fadeUp(0.08)} className="text-sm text-zinc-500 mb-12 max-w-md leading-relaxed">
          Open to new opportunities, freelance projects, and interesting collaborations.
          Drop me a line — I&apos;ll get back to you quickly.
        </motion.p>

        {/* primary email CTA */}
        <motion.div {...fadeUp(0.12)} className="mb-14">
          <a
            href="mailto:suryansh.codes2001@gmail.com"
            className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm hover:border-zinc-600 hover:text-white hover:bg-zinc-900 transition-all duration-200"
          >
            <Mail className="w-4 h-4" />
            suryansh.codes2001@gmail.com
            <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </motion.div>

        {/* socials grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {socials.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.07)}>
              <Card>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 group cursor-pointer"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-800 text-zinc-500 group-hover:border-zinc-600 group-hover:text-zinc-300 flex-shrink-0 transition-all duration-200">
                    {s.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                      {s.label}
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5 mb-2 truncate">{s.handle}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{s.description}</p>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 flex-shrink-0 mt-0.5 transition-colors" />
                </a>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
