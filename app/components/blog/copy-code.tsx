"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Client wrapper for MDX `<pre>` blocks: renders the highlighted code from
 * rehype-pretty-code plus a language badge and a copy-to-clipboard button.
 */
export function Pre({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLPreElement> & { "data-language"?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const language = (props as Record<string, string>)["data-language"];

  async function copy() {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  return (
    <div className="group relative">
      {language && (
        <span className="absolute left-3 top-2.5 z-10 select-none font-mono text-[10px] uppercase tracking-wider text-white/40">
          {language}
        </span>
      )}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute right-2.5 top-2 z-10 rounded-md border border-white/10 bg-white/5 p-1.5 text-white/60 opacity-0 backdrop-blur transition-all duration-150 hover:bg-white/10 hover:text-white focus-visible:opacity-100 group-hover:opacity-100"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-emerald-400" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
      <pre
        ref={ref}
        className={`mt-6 mb-4 overflow-x-auto rounded-lg border border-line bg-[#0f0d12] py-4 font-mono text-sm ${
          language ? "pt-9" : ""
        } ${className ?? ""}`}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
