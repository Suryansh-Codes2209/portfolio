import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

type Variant = "info" | "success" | "warning" | "error";

const styles: Record<
  Variant,
  { icon: typeof Info; ring: string; tint: string; iconColor: string }
> = {
  info: {
    icon: Info,
    ring: "border-l-accent",
    tint: "bg-accent-soft",
    iconColor: "text-accent-text",
  },
  success: {
    icon: CheckCircle2,
    ring: "border-l-emerald-500",
    tint: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
  },
  warning: {
    icon: AlertTriangle,
    ring: "border-l-amber-500",
    tint: "bg-amber-500/10",
    iconColor: "text-amber-500",
  },
  error: {
    icon: XCircle,
    ring: "border-l-red-500",
    tint: "bg-red-500/10",
    iconColor: "text-red-500",
  },
};

/**
 * MDX callout / aside. Usage in a post:
 *   <Callout type="warning" title="Heads up">Body text…</Callout>
 */
export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const s = styles[type];
  const Icon = s.icon;
  return (
    <div
      className={`my-6 flex gap-3 rounded-lg border border-line border-l-2 ${s.ring} ${s.tint} px-4 py-3`}
    >
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${s.iconColor}`} />
      <div className="min-w-0 text-sm leading-relaxed text-fg-muted [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {title && <p className="mb-1 font-semibold text-fg">{title}</p>}
        {children}
      </div>
    </div>
  );
}
