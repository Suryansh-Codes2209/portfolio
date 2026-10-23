"use client";

import { motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "../theme-toggle";

// Anchors only where no standalone page exists. Everything else points at the
// real URL so the top nav is a crawl path, not just a scroll control.
const navLinks = [
  { label: "Now", href: "#now" },
  { label: "About", href: "/about" },
  { label: "Skills", href: "/skills" },
  { label: "Projects", href: "/projects" },
  { label: "Blog", href: "/blog" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "/contact" },
];

/** Home-page header: a strip of paper pinned across the top. */
export function HomeNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-serif text-xl text-fg transition-colors hover:text-accent-text">
          Suryansh<span className="text-accent">.</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-[11px] uppercase tracking-widest text-fg-subtle transition-colors duration-150 hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/suryansh.pdf"
            download
            className="hidden items-center gap-1.5 border border-line-strong px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-fg-muted transition-colors hover:bg-highlight hover:text-highlight-ink sm:flex"
          >
            <Download className="h-3 w-3" /> Resume
          </a>
          <ThemeToggle className="hidden sm:flex" />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center text-fg-muted transition-colors hover:text-fg lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="overflow-hidden border-t border-line lg:hidden"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="py-2 font-serif text-2xl text-fg-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
          <a href="/suryansh.pdf" download className="flex items-center gap-1.5 py-2 text-sm text-fg-muted transition-colors hover:text-fg">
            <Download className="h-3.5 w-3.5" /> Download Resume
          </a>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-fg-muted">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </motion.div>
    </nav>
  );
}
