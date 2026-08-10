"use client";

import { useState, type ReactNode } from "react";
import { ChartColumn, Table2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardHeader } from "@/components/ui/card";
import { resolveSeries, type SeriesSpec } from "./chart-theme";

export interface ChartFrameProps {
  title: string;
  subtitle?: string;
  /** Filter/range controls. Belongs in the header, not floating over the plot. */
  action?: ReactNode;
  series: SeriesSpec[];
  /** Row objects — the same array the chart is fed. */
  data: Array<Record<string, string | number>>;
  categoryKey: string;
  categoryLabel?: string;
  /** Formats values in the legend, tooltip and table view. */
  format?: (value: number) => string;
  children: ReactNode;
  footnote?: ReactNode;
  className?: string;
  /** Hides the legend when the chart already direct-labels everything. */
  hideLegend?: boolean;
  /** Extra content between the header and the plot (e.g. a summary row). */
  aside?: ReactNode;
}

/**
 * Every chart lives in a frame that guarantees the accessibility contract:
 *
 * - a legend whenever there are 2+ series (identity is never colour-alone)
 * - a table view twin, so no value is reachable only by hovering
 * - the plot and its axis band sized together, so the card never grows a
 *   nested scrollbar
 */
export function ChartFrame({
  title,
  subtitle,
  action,
  series,
  data,
  categoryKey,
  categoryLabel = "Period",
  format = (value) => String(value),
  children,
  footnote,
  className,
  hideLegend = false,
  aside,
}: ChartFrameProps) {
  const [view, setView] = useState<"chart" | "table">("chart");
  const resolved = resolveSeries(series);
  const showLegend = !hideLegend && resolved.length >= 2;

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex items-center gap-2">
            {action}
            <div
              role="group"
              aria-label={`${title} view`}
              className="bg-surface-2 border-line flex items-center gap-0.5 rounded-lg border p-0.5"
            >
              <button
                type="button"
                onClick={() => setView("chart")}
                aria-pressed={view === "chart"}
                aria-label="Chart view"
                title="Chart view"
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  view === "chart"
                    ? "bg-surface text-ink shadow-card"
                    : "text-ink-3 hover:text-ink-2",
                )}
              >
                <ChartColumn size={14} />
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                aria-pressed={view === "table"}
                aria-label="Table view"
                title="Table view"
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  view === "table"
                    ? "bg-surface text-ink shadow-card"
                    : "text-ink-3 hover:text-ink-2",
                )}
              >
                <Table2 size={14} />
              </button>
            </div>
          </div>
        }
      />

      {aside ? <div className="px-4 pb-3 sm:px-5">{aside}</div> : null}

      {showLegend ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-4 pb-3 sm:px-5">
          {resolved.map((spec) => (
            <span
              key={spec.key}
              className="text-ink-2 inline-flex items-center gap-1.5 text-xs"
            >
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: spec.color }}
                aria-hidden="true"
              />
              {spec.label}
            </span>
          ))}
        </div>
      ) : null}

      <div className="min-w-0 flex-1 px-1 pb-2 sm:px-2">
        {view === "chart" ? (
          children
        ) : (
          <div className="scroll-thin max-h-[22rem] overflow-auto px-3 pb-2 sm:px-3">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                {title} — tabular data{subtitle ? `. ${subtitle}` : ""}
              </caption>
              <thead className="bg-surface sticky top-0">
                <tr className="border-line border-b">
                  <th
                    scope="col"
                    className="text-ink-3 px-2 py-2 text-left text-[0.6875rem] font-semibold tracking-wide uppercase"
                  >
                    {categoryLabel}
                  </th>
                  {resolved.map((spec) => (
                    <th
                      key={spec.key}
                      scope="col"
                      className="text-ink-3 px-2 py-2 text-right text-[0.6875rem] font-semibold tracking-wide uppercase"
                    >
                      {spec.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr
                    key={`${row[categoryKey]}-${index}`}
                    className="border-line border-b last:border-b-0"
                  >
                    <th
                      scope="row"
                      className="text-ink-2 px-2 py-1.5 text-left text-xs font-normal"
                    >
                      {String(row[categoryKey])}
                    </th>
                    {resolved.map((spec) => (
                      <td
                        key={spec.key}
                        className="text-ink tabular px-2 py-1.5 text-right text-xs"
                      >
                        {typeof row[spec.key] === "number"
                          ? format(row[spec.key] as number)
                          : String(row[spec.key] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {footnote ? (
        <div className="text-ink-3 px-4 pb-4 text-[0.6875rem] sm:px-5">{footnote}</div>
      ) : null}
    </Card>
  );
}

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
}

/**
 * Shared tooltip. Tooltips enhance — they never gate a value, because the
 * table view carries the same numbers.
 */
export function ChartTooltip({
  active,
  payload,
  label,
  format = (value: number) => String(value),
  labelFormatter,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  format?: (value: number) => string;
  labelFormatter?: (label: string | number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-surface border-line shadow-float min-w-[9rem] rounded-lg border px-3 py-2">
      {label !== undefined ? (
        <p className="text-ink mb-1.5 text-xs font-semibold">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      ) : null}
      <ul className="flex flex-col gap-1">
        {payload.map((item, index) => (
          <li
            key={`${item.dataKey ?? index}`}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <span className="text-ink-2 inline-flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              {item.name}
            </span>
            <span className="text-ink tabular font-semibold">
              {typeof item.value === "number" ? format(item.value) : item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
