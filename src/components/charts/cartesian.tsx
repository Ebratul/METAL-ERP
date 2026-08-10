"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "./chart-frame";
import {
  axisProps,
  CHART_INK,
  gridProps,
  resolveSeries,
  type SeriesSpec,
} from "./chart-theme";

type Row = Record<string, string | number>;

interface BaseChartProps {
  data: Row[];
  series: SeriesSpec[];
  categoryKey: string;
  height?: number;
  format?: (value: number) => string;
  /** Axis tick formatter — usually a compact version of `format`. */
  tickFormat?: (value: number) => string;
}

const CROSSHAIR = {
  stroke: CHART_INK.axis,
  strokeWidth: 1,
} as const;

/**
 * Stacked/overlapping area trend. One y-axis only — a second measure of a
 * different scale gets its own chart, never a second axis.
 */
export function TrendAreaChart({
  data,
  series,
  categoryKey,
  height = 260,
  format = String,
  tickFormat,
  stacked = false,
}: BaseChartProps & { stacked?: boolean }) {
  const resolved = resolveSeries(series);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <defs>
          {resolved.map((spec) => (
            <linearGradient
              key={spec.key}
              id={`area-${spec.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={spec.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={spec.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={categoryKey} {...axisProps} dy={4} />
        <YAxis
          {...axisProps}
          width={54}
          tickFormatter={tickFormat ?? ((value: number) => format(value))}
        />
        <Tooltip
          cursor={CROSSHAIR}
          content={<ChartTooltip format={format} />}
          wrapperStyle={{ outline: "none" }}
        />
        {resolved.map((spec) => (
          <Area
            key={spec.key}
            type="monotone"
            dataKey={spec.key}
            name={spec.label}
            stackId={stacked ? "stack" : undefined}
            stroke={spec.color}
            strokeWidth={2}
            fill={`url(#area-${spec.key})`}
            // 2px surface ring keeps overlapping marks legible.
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: CHART_INK.surface,
              fill: spec.color,
            }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MultiLineChart({
  data,
  series,
  categoryKey,
  height = 260,
  format = String,
  tickFormat,
  referenceValue,
  referenceLabel,
}: BaseChartProps & { referenceValue?: number; referenceLabel?: string }) {
  const resolved = resolveSeries(series);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={categoryKey} {...axisProps} dy={4} />
        <YAxis
          {...axisProps}
          width={54}
          tickFormatter={tickFormat ?? ((value: number) => format(value))}
        />
        <Tooltip
          cursor={CROSSHAIR}
          content={<ChartTooltip format={format} />}
          wrapperStyle={{ outline: "none" }}
        />
        {referenceValue !== undefined ? (
          <ReferenceLine
            y={referenceValue}
            stroke={CHART_INK.axis}
            strokeWidth={1}
            label={{
              value: referenceLabel ?? "Target",
              position: "insideTopRight",
              fill: CHART_INK.label,
              fontSize: 10,
            }}
          />
        ) : null}
        {resolved.map((spec) => (
          <Line
            key={spec.key}
            type="monotone"
            dataKey={spec.key}
            name={spec.label}
            stroke={spec.color}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: CHART_INK.surface,
              fill: spec.color,
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

interface BarChartProps extends BaseChartProps {
  stacked?: boolean;
  /** Horizontal bars — better when category labels are long. */
  layout?: "vertical" | "horizontal";
}

/**
 * Bars carry 4px rounded data-ends anchored to the baseline, a 2px gap between
 * adjacent bars, and a 2px surface gap between stacked segments.
 */
export function SeriesBarChart({
  data,
  series,
  categoryKey,
  height = 260,
  format = String,
  tickFormat,
  stacked = false,
  layout = "vertical",
}: BarChartProps) {
  const resolved = resolveSeries(series);
  const isHorizontal = layout === "horizontal";

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={isHorizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 12, bottom: 4, left: isHorizontal ? 8 : 4 }}
        barGap={2}
        barCategoryGap={isHorizontal ? "24%" : "28%"}
      >
        <CartesianGrid {...gridProps} vertical={isHorizontal} horizontal={!isHorizontal} />
        {isHorizontal ? (
          <>
            <XAxis
              type="number"
              {...axisProps}
              tickFormatter={tickFormat ?? ((value: number) => format(value))}
            />
            <YAxis
              type="category"
              dataKey={categoryKey}
              {...axisProps}
              width={110}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={categoryKey} {...axisProps} dy={4} />
            <YAxis
              {...axisProps}
              width={54}
              tickFormatter={tickFormat ?? ((value: number) => format(value))}
            />
          </>
        )}
        <Tooltip
          cursor={{ fill: "color-mix(in oklab, var(--chart-grid) 55%, transparent)" }}
          content={<ChartTooltip format={format} />}
          wrapperStyle={{ outline: "none" }}
        />
        {resolved.map((spec, index) => {
          const isTop = index === resolved.length - 1;
          const radius: [number, number, number, number] = stacked
            ? isTop
              ? isHorizontal
                ? [0, 4, 4, 0]
                : [4, 4, 0, 0]
              : [0, 0, 0, 0]
            : isHorizontal
              ? [0, 4, 4, 0]
              : [4, 4, 0, 0];

          return (
            <Bar
              key={spec.key}
              dataKey={spec.key}
              name={spec.label}
              stackId={stacked ? "stack" : undefined}
              fill={spec.color}
              radius={radius}
              maxBarSize={isHorizontal ? 22 : 42}
              // Surface-coloured hairline between stacked segments reads as the
              // 2px gap, not as a contrasting border.
              stroke={stacked ? CHART_INK.surface : undefined}
              strokeWidth={stacked ? 2 : 0}
            />
          );
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Bars + line on ONE scale. Used only where both measures share units (e.g.
 * actual vs target in the same currency) — never as a dual-axis chart.
 */
export function ComboBarLineChart({
  data,
  categoryKey,
  barSeries,
  lineSeries,
  height = 260,
  format = String,
  tickFormat,
}: {
  data: Row[];
  categoryKey: string;
  barSeries: SeriesSpec[];
  lineSeries: SeriesSpec[];
  height?: number;
  format?: (value: number) => string;
  tickFormat?: (value: number) => string;
}) {
  // Resolve across the combined list so slot order stays stable.
  const all = resolveSeries([...barSeries, ...lineSeries]);
  const bars = all.slice(0, barSeries.length);
  const lines = all.slice(barSeries.length);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 12, bottom: 4, left: 4 }}
        barGap={2}
        barCategoryGap="30%"
      >
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={categoryKey} {...axisProps} dy={4} />
        <YAxis
          {...axisProps}
          width={54}
          tickFormatter={tickFormat ?? ((value: number) => format(value))}
        />
        <Tooltip
          cursor={{ fill: "color-mix(in oklab, var(--chart-grid) 55%, transparent)" }}
          content={<ChartTooltip format={format} />}
          wrapperStyle={{ outline: "none" }}
        />
        {bars.map((spec) => (
          <Bar
            key={spec.key}
            dataKey={spec.key}
            name={spec.label}
            fill={spec.color}
            radius={[4, 4, 0, 0]}
            maxBarSize={38}
          />
        ))}
        {lines.map((spec) => (
          <Line
            key={spec.key}
            type="monotone"
            dataKey={spec.key}
            name={spec.label}
            stroke={spec.color}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              strokeWidth: 2,
              stroke: CHART_INK.surface,
              fill: spec.color,
            }}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
