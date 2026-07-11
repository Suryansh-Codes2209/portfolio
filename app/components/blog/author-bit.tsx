import { SiGithub, SiX } from "react-icons/si";

/**
 * Compact author byline shown at the foot of each post. Uses a monogram so it
 * never depends on an image asset; swap in an <Image> if you add an avatar.
 */
export function AuthorBit() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface/50 p-5">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-lg text-accent-text">
        SC
      </div>
      <div className="min-w-0">
        <p className="font-medium text-fg">Suryansh Chaudhary</p>
        <p className="mt-0.5 text-sm text-fg-muted">
          Full-stack AI engineer. Building &amp; shipping products in public — MacGet and AI systems.
        </p>
        <div className="mt-2 flex items-center gap-3 text-fg-subtle">
          <a
            href="https://github.com/Suryansh-Codes2209"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-fg"
          >
            <SiGithub className="h-4 w-4" />
          </a>
          <a
            href="https://x.com/Suryansh_2001"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="transition-colors hover:text-fg"
          >
            <SiX className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
