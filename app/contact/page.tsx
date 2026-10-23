"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { SOCIALS } from "../data/site";
import { PageNav } from "../components/page-nav";
import { Postcard } from "../components/sections/contact";
import { SiteFooter } from "../components/site-footer";
import { KineticHeading } from "../components/vox/kinetic-heading";
import { Stamp } from "../components/vox/stamp";
import { tiltFor } from "../components/vox/taped-card";

const socials = [
  {
    icon: <Github className="h-5 w-5" />,
    label: "GitHub",
    handle: SOCIALS.github.split("/").pop(),
    href: SOCIALS.github,
    description: "Check out my open-source work and contributions.",
    tint: "bg-surface",
  },
  {
    icon: <Twitter className="h-5 w-5" />,
    label: "Twitter / X",
    handle: `@${SOCIALS.x.split("/").pop()}`,
    href: SOCIALS.x,
    description: "Follow me for dev thoughts and updates.",
    tint: "bg-[#d8e8f0] dark:bg-[#1c2a31]",
  },
  {
    icon: <Linkedin className="h-5 w-5" />,
    label: "LinkedIn",
    handle: "suryansh-chaudhary-2209",
    href: SOCIALS.linkedin,
    description: "Let's connect professionally.",
    tint: "bg-[#fff3b0] dark:bg-[#3a3418]",
  },
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
    handle: SOCIALS.email,
    href: `mailto:${SOCIALS.email}`,
    description: "Best way to reach me for work enquiries.",
    tint: "bg-[#ffd9cf] dark:bg-[#3a221c]",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <PageNav current="Contact" />

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">
            <span className="text-accent-text">Say hello</span> — the mailroom
          </p>
          <Stamp rotate={-5}>Replies within a day or two</Stamp>
        </div>
        <KineticHeading as="h1" text="Got something worth building? Write in." highlight="Write in." className="sm:text-7xl" />
        <p className="mb-16 mt-6 max-w-xl text-[17px] leading-relaxed text-fg-muted">
          Open to new opportunities, freelance projects, and interesting collaborations. Drop a postcard — I&apos;ll get back to
          you quickly.
        </p>

        <Postcard />

        {/* the address book: one business card per channel */}
        <section aria-labelledby="elsewhere" className="mt-24">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent-text">Fig. 02 — The address book</p>
          <h2 id="elsewhere" className="mb-12 font-serif text-4xl text-fg sm:text-5xl">
            Or find me elsewhere
          </h2>
          <div className="grid gap-8 sm:grid-cols-2">
            {socials.map((s, i) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: -30, rotate: tiltFor(s.label, 8) }}
                whileInView={{ opacity: 1, y: 0, rotate: tiltFor(s.label, 2) }}
                whileHover={{ rotate: 0, y: -4 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", damping: 14, stiffness: 150, delay: i * 0.06 }}
                className={`group relative flex items-start gap-5 p-7 shadow-paper ${s.tint}`}
              >
                <span aria-hidden className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2" />
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-fg text-fg">
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-subtle">{s.label}</p>
                  <p className="mt-1 truncate font-serif text-2xl text-fg">{s.handle}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">{s.description}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-fg-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-text" />
              </motion.a>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
