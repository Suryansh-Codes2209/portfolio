import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NAV_PAGES } from "../data/site";
import { ThemeToggle } from "./theme-toggle";

/**
 * Header for the standalone routes. Unlike the homepage nav (which scrolls to
 * anchors) every item here is a real URL, so each page links to every other one.
 */
export function PageNav({ current }: { current: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-fg-subtle transition-colors hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back home
        </Link>

        <nav aria-label="Pages" className="hidden items-center gap-5 sm:flex">
          {NAV_PAGES.map((p) =>
            p.label === current ? (
              <span key={p.href} className="text-xs text-fg-faint">
                {p.label}
              </span>
            ) : (
              <Link
                key={p.href}
                href={p.href}
                className="text-xs text-fg-subtle transition-colors hover:text-fg"
              >
                {p.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs text-fg-faint sm:hidden">{current}</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
