"use client";

import { useState } from "react";
import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { cn } from "@/lib/utils/cn";
import { ChartTooltip } from "./chart-frame";
import {
  axisProps,
  CHART_INK,
  gridProps,
  MAX_SERIES_ALL_PAIRS,
  ORDINAL,
  SEQUENTIAL,
  seriesColor,
  sequentialStep,
} from "./chart-theme";

/* ── Funnel ───────────────────────────────────────────────────────────────
   Stages are ORDERED, so they take a single-hue ordinal ramp — the reader
   sees the sequence in the colour. Values are direct-labelled because a
   funnel has few enough marks that labelling every one is legible.
   ──────────────────────────────────────────────────────────────────────── */

export interface FunnelStage {
  label: string;
  value: number;
}

export function FunnelChart({
  stages,
  format = String,
  className,
}: {
  stages: FunnelStage[];
  format?: (value: number) => string;
  className?: string;
}) {
  if (!stages.length) return null;
  const top = stages[0].value || 1;

  return (
    <ol className={cn("flex flex-col gap-2 px-1", className)}>
      {stages.map((stage, index) => {
        const widthPct = Math.max(6, (stage.value / top) * 100);
        const color = ORDINAL[Math.min(index, ORDINAL.length - 1)];
        const previous = index === 0 ? null : stages[index - 1].value;
        const stepConversion =
          previous && previous > 0 ? (stage.value / previous) * 100 : null;

        return (
          <li key={stage.label} className="flex items-center gap-3">
            <span className="text-ink-2 w-28 shrink-0 truncate text-xs sm:w-36">
              {stage.label}
            </span>
            <div className="min-w-0 flex-1">
              <div
                className="flex h-8 items-center justify-end rounded-md px-2 transition-[width] duration-500"
                style={{ width: `${widthPct}%`, backgroundColor: color }}
              >
                {/* Only render the label inside the bar when it fits. */}
                {widthPct > 22 ? (
                  <span className="tabular text-xs font-semibold text-white">
                    {format(stage.value)}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="w-24 shrink-0 text-right">
              {widthPct <= 22 ? (
                <span className="text-ink tabular block text-xs font-semibold">
                  {format(stage.value)}
                </span>
              ) : null}
              {stepConversion !== null ? (
                <span className="text-ink-3 tabular block text-[0.6875rem]">
                  {stepConversion.toFixed(1)}%
                </span>
              ) : (
                <span className="text-ink-3 block text-[0.6875rem]">100%</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/* ── Heatmap ──────────────────────────────────────────────────────────────
   Continuous magnitude, so a single-hue sequential ramp with a scale legend.
   Every cell is also reachable as text via the table view in ChartFrame.
   ──────────────────────────────────────────────────────────────────────── */

export interface HeatCell {
  row: string;
  column: string;
  value: number;
}

export function Heatmap({
  cells,
  rows,
  columns,
  format = String,
  className,
  unit,
}: {
  cells: HeatCell[];
  rows: string[];
  columns: string[];
  format?: (value: number) => string;
  className?: string;
  unit?: string;
}) {
  const [hover, setHover] = useState<HeatCell | null>(null);
  const values = cells.map((cell) => cell.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const span = max - min || 1;

  const lookup = new Map(cells.map((cell) => [`${cell.row}|${cell.column}`, cell]));

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="scroll-thin overflow-x-auto">
        <div className="min-w-max">
          <div
            className="grid gap-0.5"
            style={{
              gridTemplateColumns: `minmax(5.5rem, auto) repeat(${columns.length}, minmax(2.25rem, 1fr))`,
            }}
          >
            <div />
            {columns.map((column) => (
              <div
                key={column}
                className="text-ink-3 pb-1 text-center text-[0.625rem]"
              >
                {column}
              </div>
            ))}

            {rows.map((row) => (
              <FragmentRow
                key={row}
                row={row}
                columns={columns}
                lookup={lookup}
                min={min}
                span={span}
                format={format}
                onHover={setHover}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Scale legend — required for any continuous colour encoding. */}
        <div className="flex items-center gap-2">
          <span className="text-ink-3 text-[0.625rem]">{format(min)}</span>
          <div className="flex h-2 w-28 overflow-hidden rounded-full">
            {SEQUENTIAL.map((step) => (
              <div key={step} className="flex-1" style={{ backgroundColor: step }} />
            ))}
          </div>
          <span className="text-ink-3 text-[0.625rem]">
            {format(max)}
            {unit ? ` ${unit}` : ""}
          </span>
        </div>
        <p className="text-ink-2 min-h-4 text-xs" aria-live="polite">
          {hover
            ? `${hover.row} · ${hover.column}: ${format(hover.value)}${unit ? ` ${unit}` : ""}`
            : ""}
        </p>
      </div>
    </div>
  );
}

function FragmentRow({
  row,
  columns,
  lookup,
  min,
  span,
  format,
  onHover,
}: {
  row: string;
  columns: string[];
  lookup: Map<string, HeatCell>;
  min: number;
  span: number;
  format: (value: number) => string;
  onHover: (cell: HeatCell | null) => void;
}) {
  return (
    <>
      <div className="text-ink-2 flex items-center pr-2 text-[0.6875rem]">{row}</div>
      {columns.map((column) => {
        const cell = lookup.get(`${row}|${column}`);
        if (!cell) {
          return (
            <div key={column} className="bg-surface-2 h-7 rounded-[3px] opacity-40" />
          );
        }
        const intensity = (cell.value - min) / span;
        return (
          <button
            key={column}
            type="button"
            // Hit target covers the full cell, comfortably past the 24px floor.
            className="h-7 min-w-[2.25rem] rounded-[3px] transition-transform hover:scale-[1.08]"
            style={{ backgroundColor: sequentialStep(intensity) }}
            onMouseEnter={() => onHover(cell)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(cell)}
            onBlur={() => onHover(null)}
            aria-label={`${row}, ${column}: ${format(cell.value)}`}
          />
        );
      })}
    </>
  );
}

/* ── Scatter ──────────────────────────────────────────────────────────────
   An all-pairs form: any two marks can sit side by side, so it carries the
   tighter three-series cap.
   ──────────────────────────────────────────────────────────────────────── */

export interface ScatterGroup {
  label: string;
  points: Array<{ x: number; y: number; z?: number; name?: string }>;
}

export function ScatterPlot({
  groups,
  height = 280,
  xLabel,
  yLabel,
  formatX = String,
  formatY = String,
}: {
  groups: ScatterGroup[];
  height?: number;
  xLabel: string;
  yLabel: string;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
}) {
  // Past three groups the CVD floor cannot hold for an all-pairs form.
  const shown = groups.slice(0, MAX_SERIES_ALL_PAIRS);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 12, right: 16, bottom: 22, left: 4 }}>
        <CartesianGrid {...gridProps} vertical />
        <XAxis
          type="number"
          dataKey="x"
          name={xLabel}
          {...axisProps}
          tickFormatter={formatX}
          label={{
            value: xLabel,
            position: "insideBottom",
            offset: -12,
            fill: CHART_INK.label,
            fontSize: 10,
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yLabel}
          {...axisProps}
          width={56}
          tickFormatter={formatY}
        />
        <ZAxis type="number" dataKey="z" range={[60, 420]} />
        <Tooltip
          cursor={{ strokeDasharray: "0", stroke: CHART_INK.axis }}
          content={<ChartTooltip format={(value) => formatY(value)} />}
          wrapperStyle={{ outline: "none" }}
        />
        {shown.map((group, index) => (
          <Scatter
            key={group.label}
            name={group.label}
            data={group.points}
            fill={seriesColor(index)}
            fillOpacity={0.75}
            // 2px surface ring so overlapping bubbles stay separable.
            stroke={CHART_INK.surface}
            strokeWidth={2}
            isAnimationActive={false}
          />
        ))}
      </ScatterChart>
    </ResponsiveContainer>
  );
}

/* ── Ranked bar list ──────────────────────────────────────────────────────
   Nominal categories, one measure: every bar takes slot 1. Colouring each bar
   by its own value would re-encode what bar length already shows.
   ──────────────────────────────────────────────────────────────────────── */

export function RankedBars({
  items,
  format = String,
  className,
  color = seriesColor(0),
  /** Highlight one row and recede the rest — emphasis, not a second hue. */
  highlightLabel,
}: {
  items: Array<{ label: string; value: number; caption?: string }>;
  format?: (value: number) => string;
  className?: string;
  color?: string;
  highlightLabel?: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className={cn("flex flex-col gap-2.5", className)}>
      {items.map((item) => {
        const dimmed = highlightLabel !== undefined && item.label !== highlightLabel;
        return (
          <li key={item.label} className="flex items-center gap-3">
            <span className="text-ink-2 w-28 shrink-0 truncate text-xs sm:w-32">
              {item.label}
            </span>
            <div className="bg-surface-2 h-5 min-w-0 flex-1 overflow-hidden rounded-md">
              <div
                className="h-full rounded-md transition-[width] duration-500"
                style={{
                  width: `${Math.max(2, (item.value / max) * 100)}%`,
                  backgroundColor: color,
                  opacity: dimmed ? 0.32 : 1,
                }}
              />
            </div>
            <span className="text-ink tabular w-20 shrink-0 text-right text-xs font-semibold">
              {format(item.value)}
            </span>
            {item.caption ? (
              <span className="text-ink-3 hidden w-14 shrink-0 text-right text-[0.6875rem] sm:block">
                {item.caption}
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
