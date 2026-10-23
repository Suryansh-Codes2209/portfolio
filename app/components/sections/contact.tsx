"use client";

import { Check, Copy, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { useState } from "react";
import { SOCIALS } from "../../data/site";
import { Chapter } from "../vox/chapter";
import { KineticHeading } from "../vox/kinetic-heading";
import { Stamp } from "../vox/stamp";

const EMAIL = SOCIALS.email;

const socials = [
  { icon: <Github className="h-4 w-4" />, label: "GitHub", handle: SOCIALS.github.split("/").pop(), href: SOCIALS.github },
  { icon: <Twitter className="h-4 w-4" />, label: "Twitter", handle: `@${SOCIALS.x.split("/").pop()}`, href: SOCIALS.x },
  { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn", handle: "suryansh-chaudhary-2209", href: SOCIALS.linkedin },
  { icon: <Mail className="h-4 w-4" />, label: "Email", handle: EMAIL, href: `mailto:${EMAIL}` },
];

const field =
  "w-full border-0 border-b-2 border-dashed border-line-strong bg-transparent px-0 py-2 font-serif text-xl text-fg placeholder:text-fg-faint focus:border-accent focus:outline-none focus:ring-0";

/** The postcard: message on the left, address block on the right. */
export function Postcard() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="paper relative -rotate-[0.7deg] p-6 sm:p-10">
      {/* postage */}
      <div className="absolute right-6 top-6 hidden h-24 w-20 rotate-3 border-[3px] border-dotted border-line-strong bg-highlight p-1.5 sm:block">
        <div className="flex h-full w-full items-center justify-center border border-highlight-ink/40 font-serif text-3xl text-highlight-ink">S.</div>
      </div>
      <Stamp className="absolute right-24 top-20 hidden sm:inline-flex" rotate={-14}>
        Shipped · {new Date().getFullYear()}
      </Stamp>

      <div className="grid gap-10 lg:grid-cols-2 lg:divide-x lg:divide-dashed lg:divide-line-strong">
        <form onSubmit={handleSubmit} className="space-y-6 lg:pr-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-fg-subtle">Message</p>
          <div>
            <label className="sr-only" htmlFor="name">Name</label>
            <input id="name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className={field} />
          </div>
          <div>
            <label className="sr-only" htmlFor="email">Email</label>
            <input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" className={field} />
          </div>
          <div>
            <label className="sr-only" htmlFor="message">Message</label>
            <textarea id="message" required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project…" className={`${field} resize-none`} />
          </div>
          <button type="submit" className="w-full bg-fg py-3 text-sm font-medium text-bg shadow-paper transition-transform hover:-rotate-1">
            {sent ? "✓ Opening your email client…" : "Send it"}
          </button>
        </form>

        <div className="space-y-8 lg:pl-10 lg:pt-28">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="group block w-full text-left"
          >
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent-text">Direct line — click to copy</p>
            <p className="flex items-center gap-3 break-all font-serif text-2xl text-fg sm:text-3xl">
              <span className="marker">{EMAIL}</span>
              {copied ? <Check className="h-5 w-5 flex-shrink-0 text-accent" /> : <Copy className="h-5 w-5 flex-shrink-0 text-fg-faint group-hover:text-fg" />}
            </p>
          </button>

          <ul className="space-y-0">
            {socials.map((s) => (
              <li key={s.label} className="border-b border-dashed border-line-strong">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 py-3">
                  <span className="text-fg-subtle group-hover:text-accent-text">{s.icon}</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-fg-muted group-hover:text-fg">{s.label}</span>
                  <span className="ml-auto truncate text-xs text-fg-faint">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <Chapter id="contact" number={8} kicker="Say hello">
      <KineticHeading text="Got something worth building? Write in." highlight="Write in." />
      <p className="mb-14 mt-5 max-w-lg text-[15px] leading-relaxed text-fg-subtle">
        I build in public. Got a project, a bug report, or just want to talk shop? Drop a postcard.
      </p>
      <Postcard />
    </Chapter>
  );
}
