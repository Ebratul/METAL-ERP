"use client";

import {
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartTooltip } from "./chart-frame";
import { CHART_INK, resolveSeries, seriesColor, type SeriesSpec } from "./chart-theme";

export interface Slice {
  label: string;
  value: number;
  /** Override the categorical slot — used for status-coloured breakdowns. */
  color?: string;
}

/** Part-to-whole is only legible at a glance up to ~6 segments. */
const MAX_SLICES = 6;

/**
 * Fold everything past the 6th slice into "Other" rather than generating a
 * 7th–Nth hue. Returns slices in descending value order.
 */
export function foldSlices(slices: Slice[], max = MAX_SLICES): Slice[] {
  const sorted = [...slices].sort((a, b) => b.value - a.value);
  if (sorted.length <= max) return sorted;
  const head = sorted.slice(0, max - 1);
  const tail = sorted.slice(max - 1);
  return [
    ...head,
    {
      label: "Other",
      value: tail.reduce((sum, slice) => sum + slice.value, 0),
      color: "var(--status-neutral)",
    },
  ];
}

interface DonutProps {
  slices: Slice[];
  height?: number;
  format?: (value: number) => string;
  /** Big number in the hole. */
  centerValue?: string;
  centerLabel?: string;
  centerCaption?: string;
  innerRadius?: number;
  outerRadius?: number;
}

export function DonutChart({
  slices,
  height = 240,
  format = String,
  centerValue,
  centerLabel,
  centerCaption,
  innerRadius = 62,
  outerRadius = 92,
}: DonutProps) {
  const folded = foldSlices(slices);
  const data = folded.map((slice, index) => ({
    ...slice,
    color: slice.color ?? seriesColor(index),
  }));

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            content={<ChartTooltip format={format} />}
            wrapperStyle={{ outline: "none" }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            strokeWidth={0}
            isAnimationActive={false}
          >
            {data.map((slice) => (
              <Cell key={slice.label} fill={slice.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {centerValue ? (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel ? (
            <span className="text-ink-3 text-[0.6875rem]">{centerLabel}</span>
          ) : null}
          <span className="text-ink text-xl font-semibold tracking-tight">
            {centerValue}
          </span>
          {centerCaption ? (
            <span className="text-ink-3 mt-0.5 text-[0.625rem]">{centerCaption}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * A single-value radial gauge. This is a stat tile with a plot — used where the
 * value's position against its 0–100 range is itself the message (OEE, capacity
 * utilisation), not for arbitrary numbers.
 */
export function RadialGauge({
  value,
  max = 100,
  height = 180,
  color = "var(--series-1)",
  label,
  caption,
  valueText,
}: {
  value: number;
  max?: number;
  height?: number;
  color?: string;
  label: string;
  caption?: string;
  valueText?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const data = [{ name: label, value: pct, fill: color }];

  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          data={data}
          startAngle={220}
          endAngle={-40}
          innerRadius="66%"
          outerRadius="100%"
          barSize={12}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: CHART_INK.grid }}
            dataKey="value"
            cornerRadius={6}
            angleAxisId={0}
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-ink text-2xl leading-none font-semibold tracking-tight">
          {valueText ?? `${pct.toFixed(1)}%`}
        </span>
        <span className="text-ink-2 mt-1.5 text-xs font-medium">{label}</span>
        {caption ? (
          <span className="text-ink-3 mt-0.5 text-[0.625rem]">{caption}</span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Radar profile — for comparing a handful of entities across the same fixed
 * set of dimensions (supplier scorecards, line capability).
 */
export function RadarProfile({
  data,
  series,
  categoryKey = "dimension",
  height = 260,
  format = String,
}: {
  data: Array<Record<string, string | number>>;
  series: SeriesSpec[];
  categoryKey?: string;
  height?: number;
  format?: (value: number) => string;
}) {
  const resolved = resolveSeries(series);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke={CHART_INK.grid} />
        <PolarAngleAxis
          dataKey={categoryKey}
          tick={{ fill: CHART_INK.label, fontSize: 10 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: CHART_INK.label, fontSize: 9 }}
          axisLine={false}
          tickCount={5}
        />
        <Tooltip
          content={<ChartTooltip format={format} />}
          wrapperStyle={{ outline: "none" }}
        />
        {resolved.map((spec) => (
          <Radar
            key={spec.key}
            name={spec.label}
            dataKey={spec.key}
            stroke={spec.color}
            strokeWidth={2}
            fill={spec.color}
            fillOpacity={0.16}
            isAnimationActive={false}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
