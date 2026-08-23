import Link from "next/link";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { NAV_PAGES, SOCIALS } from "../data/site";

const socials = [
  { icon: <Github className="h-4 w-4" />, href: SOCIALS.github, label: "GitHub" },
  { icon: <Twitter className="h-4 w-4" />, href: SOCIALS.x, label: "X" },
  { icon: <Linkedin className="h-4 w-4" />, href: SOCIALS.linkedin, label: "LinkedIn" },
  { icon: <Mail className="h-4 w-4" />, href: `mailto:${SOCIALS.email}`, label: "Email" },
];

/**
 * Shared across every route. The link row is the point: without it the new
 * pages are orphans that Google finds in the sitemap and then ignores, because
 * nothing on the site says they matter.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-line px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <nav aria-label="Site pages" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {NAV_PAGES.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle transition-colors hover:text-accent-text"
            >
              {p.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-line pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] text-fg-faint">
            © {new Date().getFullYear()} Suryansh Chaudhary
            <span> · </span>
            <span>Full-Stack AI Engineer · creator of MacGet &amp; Oratora</span>
          </p>
          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-fg-faint transition-colors hover:text-fg-muted"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
