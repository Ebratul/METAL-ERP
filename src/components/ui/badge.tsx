import type { ReactNode } from "react";
import {
  CircleAlert,
  CircleCheck,
  CircleDot,
  Info,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type StatusTone =
  | "good"
  | "warning"
  | "serious"
  | "critical"
  | "info"
  | "neutral"
  | "accent";

const TONE_CLASS: Record<StatusTone, string> = {
  good: "bg-good-soft text-good",
  warning: "bg-warning-soft text-warning",
  serious: "bg-serious-soft text-serious",
  critical: "bg-critical-soft text-critical",
  info: "bg-info-soft text-info",
  neutral: "bg-neutral-soft text-ink-2",
  accent: "bg-accent-soft text-accent-ink",
};

/**
 * Status colour never carries meaning alone — every status badge ships an icon
 * plus its label, so it stays readable under CVD and in forced-colours mode.
 */
const TONE_ICON: Record<StatusTone, typeof CircleCheck | null> = {
  good: CircleCheck,
  warning: TriangleAlert,
  serious: CircleAlert,
  critical: CircleAlert,
  info: Info,
  neutral: CircleDot,
  accent: null,
};

interface BadgeProps {
  children: ReactNode;
  tone?: StatusTone;
  /** Drop the icon for pure labels (categories, counts) that aren't status. */
  withIcon?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export function Badge({
  children,
  tone = "neutral",
  withIcon = false,
  className,
  size = "sm",
}: BadgeProps) {
  const Icon = withIcon ? TONE_ICON[tone] : null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[0.6875rem]" : "px-2.5 py-1 text-xs",
        TONE_CLASS[tone],
        className,
      )}
    >
      {Icon ? <Icon size={12} strokeWidth={2.25} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/** A small filled dot + label — used in legends and list rows. */
export function DotLabel({
  color,
  children,
  className,
}: {
  color: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("text-ink-2 inline-flex items-center gap-2 text-xs", className)}>
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {children}
    </span>
  );
}

/** Live pill with a pulsing dot, for streaming surfaces. */
export function LivePill({ label = "LIVE" }: { label?: string }) {
  return (
    <span className="bg-good-soft text-good inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold tracking-wider">
      <span className="pulse-dot text-good relative inline-flex size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
