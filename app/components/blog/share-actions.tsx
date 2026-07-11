"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { SiX } from "react-icons/si";

/**
 * Minimal, tasteful share row: "Share on X" intent link + "Copy link" with a
 * copied-confirmation. `layout` controls whether it stacks (side rail) or sits
 * inline (footer).
 */
export function ShareActions({
  title,
  url,
  layout = "row",
}: {
  title: string;
  url: string;
  layout?: "row" | "col";
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no-op */
    }
  }

  const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title,
  )}&url=${encodeURIComponent(url)}`;

  const btn =
    "flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs text-fg-subtle transition-colors duration-150 hover:border-line-strong hover:text-fg";

  return (
    <div className={layout === "col" ? "flex flex-col gap-2" : "flex flex-wrap items-center gap-2"}>
      <a href={tweet} target="_blank" rel="noopener noreferrer" className={btn}>
        <SiX className="h-3 w-3" />
        Share
      </a>
      <button type="button" onClick={copyLink} className={btn} aria-label="Copy link">
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            Copied
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
