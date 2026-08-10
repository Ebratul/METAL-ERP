import { cn } from "@/lib/utils/cn";

interface ProgressRingProps {
  /** 0–100. */
  value: number;
  size?: number;
  thickness?: number;
  color?: string;
  label?: string;
  /** Centre text — defaults to the rounded percentage. */
  caption?: string;
  sublabel?: string;
  className?: string;
}

export function ProgressRing({
  value,
  size = 96,
  thickness = 8,
  color = "var(--series-1)",
  label,
  caption,
  sublabel,
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${label ?? "Progress"}: ${clamped.toFixed(0)} percent`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--chart-grid)"
          strokeWidth={thickness}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-ink text-lg leading-none font-semibold">
          {caption ?? `${clamped.toFixed(0)}%`}
        </span>
        {sublabel ? (
          <span className="text-ink-3 mt-1 text-[0.625rem]">{sublabel}</span>
        ) : null}
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  height?: number;
  label?: string;
  /** Show the numeric value at the right of the track. */
  showValue?: boolean;
  valueText?: string;
}

export function ProgressBar({
  value,
  max = 100,
  color = "var(--series-1)",
  className,
  height = 6,
  label,
  showValue = false,
  valueText,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="bg-surface-3 relative flex-1 overflow-hidden rounded-full"
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showValue ? (
        <span className="text-ink-2 tabular w-11 shrink-0 text-right text-xs">
          {valueText ?? `${pct.toFixed(0)}%`}
        </span>
      ) : null}
    </div>
  );
}

/**
 * A segmented meter: several parts of a whole in one track. Segments are
 * separated by a 2px surface gap rather than a border.
 */
export function StackedMeter({
  segments,
  height = 8,
  className,
  label,
}: {
  segments: Array<{ label: string; value: number; color: string }>;
  height?: number;
  className?: string;
  label?: string;
}) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;
  return (
    <div
      className={cn("flex w-full items-stretch gap-0.5", className)}
      style={{ height }}
      role="img"
      aria-label={
        label ??
        segments.map((s) => `${s.label} ${((s.value / total) * 100).toFixed(0)}%`).join(", ")
      }
    >
      {segments.map((segment) => (
        <div
          key={segment.label}
          className="first:rounded-l-full last:rounded-r-full"
          style={{
            width: `${(segment.value / total) * 100}%`,
            backgroundColor: segment.color,
          }}
        />
      ))}
    </div>
  );
}
