"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

/**
 * Sticky "On this page" table of contents. Reads h2/h3 headings from the
 * rendered <article> at mount, then scroll-spies the active section with an
 * IntersectionObserver. Hidden on narrow screens (rendered in an xl sidebar).
 */
export function PostToc() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>("article h2, article h3"),
    ).filter((n) => n.id);

    setHeadings(
      nodes.map((n) => ({
        id: n.id,
        text: n.textContent ?? "",
        level: Number(n.tagName[1]),
      })),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    for (const n of nodes) observer.observe(n);
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-fg-faint">
        On this page
      </p>
      <ul className="space-y-2 border-l border-line">
        {headings.map((h) => {
          const active = h.id === activeId;
          return (
            <li key={h.id} style={{ paddingLeft: h.level === 3 ? 16 : 0 }}>
              <a
                href={`#${h.id}`}
                className={`-ml-px block border-l-2 pl-3 leading-snug transition-colors duration-150 ${
                  active
                    ? "border-l-accent text-accent-text"
                    : "border-l-transparent text-fg-subtle hover:text-fg"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
