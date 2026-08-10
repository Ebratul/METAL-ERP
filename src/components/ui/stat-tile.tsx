import type { ReactNode } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { signedPercent } from "@/lib/utils/format";
import { Sparkline } from "./sparkline";

export type DeltaDirection = "up" | "down" | "flat";

interface DeltaProps {
  value: number;
  /** For metrics where falling is good (defects, downtime, cost). */
  invert?: boolean;
  suffix?: string;
  className?: string;
}

/**
 * A delta chip. Direction is carried by the arrow glyph and the sign, not by
 * colour alone — colour is the secondary cue.
 */
export function Delta({ value, invert = false, suffix, className }: DeltaProps) {
  const direction: DeltaDirection =
    value > 0.05 ? "up" : value < -0.05 ? "down" : "flat";

  const isGood = invert ? direction === "down" : direction === "up";
  const Icon =
    direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : ArrowRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        direction === "flat"
          ? "text-ink-3"
          : isGood
            ? "text-up"
            : "text-down",
        className,
      )}
    >
      <Icon size={13} strokeWidth={2.5} aria-hidden="true" />
      <span className="tabular">{signedPercent(value)}</span>
      {suffix ? <span className="text-ink-3 ml-1 font-normal">{suffix}</span> : null}
    </span>
  );
}

interface StatTileProps {
  label: string;
  /** Pre-formatted value — the tile does not format, so callers control units. */
  value: string;
  delta?: number;
  /** Falling is good for this metric. */
  invertDelta?: boolean;
  /** Small note under the value, e.g. the comparison window. */
  caption?: string;
  icon?: ReactNode;
  /** Categorical slot 1–8 for the icon chip. */
  tone?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  trend?: number[];
  className?: string;
  /** Right-aligned extra, e.g. a status badge. */
  aside?: ReactNode;
}

/**
 * The stat tile is the answer when the story is one number — reached for
 * *instead of* a one-bar chart, never alongside one.
 *
 * The value uses proportional figures on purpose: `tabular-nums` makes large
 * standalone numbers look loose.
 */
export function StatTile({
  label,
  value,
  delta,
  invertDelta,
  caption,
  icon,
  tone = 1,
  trend,
  className,
  aside,
}: StatTileProps) {
  const seriesColor = `var(--series-${tone})`;

  return (
    <div
      className={cn(
        "card-surface shadow-card group relative flex flex-col gap-3 p-4 transition-colors",
        "hover:border-line-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {icon ? (
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `color-mix(in oklab, ${seriesColor} 16%, transparent)`,
                color: seriesColor,
              }}
              aria-hidden="true"
            >
              {icon}
            </span>
          ) : null}
          <p className="text-ink-2 truncate text-xs font-medium">{label}</p>
        </div>
        {aside}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-ink text-2xl leading-none font-semibold tracking-tight">
            {value}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {delta !== undefined ? (
              <Delta value={delta} invert={invertDelta} />
            ) : null}
            {caption ? (
              <span className="text-ink-3 text-[0.6875rem]">{caption}</span>
            ) : null}
          </div>
        </div>
        {trend && trend.length > 1 ? (
          <Sparkline
            data={trend}
            color={seriesColor}
            width={72}
            height={30}
            label={`${label} trend`}
            className="shrink-0 opacity-90"
          />
        ) : null}
      </div>
    </div>
  );
}

/** Compact variant for dense KPI strips (the second row of the dashboard). */
export function MiniStat({
  label,
  value,
  delta,
  invertDelta,
  icon,
  tone = 1,
  className,
}: Omit<StatTileProps, "trend" | "caption" | "aside">) {
  const seriesColor = `var(--series-${tone})`;
  return (
    <div
      className={cn(
        "card-surface shadow-card flex items-center gap-3 p-3.5",
        className,
      )}
    >
      {icon ? (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `color-mix(in oklab, ${seriesColor} 16%, transparent)`,
            color: seriesColor,
          }}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-ink-3 truncate text-[0.6875rem]">{label}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-ink text-base font-semibold">{value}</span>
          {delta !== undefined ? (
            <Delta value={delta} invert={invertDelta} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
