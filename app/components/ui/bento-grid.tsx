import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

// Ported from Magic UI's BentoGrid (MIT, Dillion Verma — 21st.dev/@dillionverma),
// re-skinned as taped notes on newsprint instead of glass cards.

export function BentoGrid({ children, className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("grid w-full auto-rows-[minmax(150px,auto)] grid-cols-1 gap-5 sm:grid-cols-3", className)} {...props}>
      {children}
    </div>
  );
}

interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
  name: string;
  description: string;
  icon?: ReactNode;
  badge?: ReactNode;
  /** Sticky-note tint; defaults to a plain sheet. */
  tint?: "sheet" | "yellow" | "pink" | "blue";
  featured?: boolean;
}

const TINTS = {
  sheet: "bg-surface",
  yellow: "bg-[#fff3b0] dark:bg-[#3a3418]",
  pink: "bg-[#ffd9cf] dark:bg-[#3a221c]",
  blue: "bg-[#d8e8f0] dark:bg-[#1c2a31]",
} as const;

export function BentoCard({
  name,
  description,
  icon,
  badge,
  tint = "sheet",
  featured,
  className,
  ...props
}: BentoCardProps) {
  const ink = tint === "sheet" ? "" : "text-[#1a1714] dark:text-fg";
  return (
    <div
      className={cn(
        "group relative flex flex-col p-6 shadow-paper transition-transform duration-300 hover:-translate-y-1 hover:rotate-0",
        TINTS[tint],
        ink,
        className,
      )}
      {...props}
    >
      <span aria-hidden className="tape absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3" />
      <div className="mb-3 flex items-center gap-2">
        {icon}
        {badge}
      </div>
      <h3 className={cn("font-serif leading-tight mb-2", featured ? "text-3xl" : "text-xl")}>{name}</h3>
      <p className={cn("text-[13px] leading-relaxed", tint === "sheet" ? "text-fg-subtle" : "opacity-80")}>{description}</p>
    </div>
  );
}
