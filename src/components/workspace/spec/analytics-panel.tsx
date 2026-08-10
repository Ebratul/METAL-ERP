"use client";

import { useMemo } from "react";
import { ChartFrame } from "@/components/charts/chart-frame";
import {
  MultiLineChart,
  SeriesBarChart,
  TrendAreaChart,
} from "@/components/charts/cartesian";
import { DonutChart, RadialGauge } from "@/components/charts/radial";
import { FunnelChart, RankedBars } from "@/components/charts/specialty";
import { ProgressBar } from "@/components/ui/progress";
import {
  compactCurrency,
  compactNumber,
  currency,
  number,
  percent,
} from "@/lib/utils/format";
import { groupBy, monthlySeries, statusSplit } from "@/lib/workspaces/derive";
import type { RecordRow, ResolvedSpec } from "@/lib/workspaces/types";

/**
 * Every chart here reads the live rows, so the analytics move the moment a
 * record is created, edited or deleted.
 */
export function AnalyticsPanel({
  spec,
  rows,
  seedKey,
  tone,
}: {
  spec: ResolvedSpec;
  rows: RecordRow[];
  seedKey: string;
  tone: number;
}) {
  const months = useMemo(() => monthlySeries(spec, rows, seedKey), [spec, rows, seedKey]);
  const statuses = useMemo(() => statusSplit(spec, rows), [spec, rows]);

  const isMoney = spec.measure?.kind === "money";
  const measureLabel = spec.measure?.label ?? "Records";
  const fmt = (value: number) =>
    isMoney ? currency(value) : `${number(value)}${spec.measure?.unit ? ` ${spec.measure.unit}` : ""}`;
  const tick = (value: number) =>
    isMoney ? compactCurrency(value) : compactNumber(value);

  const primaryDim = spec.enumFields[0];
  const secondaryDim = spec.enumFields[1] ?? spec.enumFields[0];

  const byPrimary = useMemo(
    () => (primaryDim ? groupBy(rows, primaryDim, spec.measure, 8) : []),
    [rows, primaryDim, spec.measure],
  );
  const bySecondary = useMemo(
    () => (secondaryDim ? groupBy(rows, secondaryDim, spec.measure, 5) : []),
    [rows, secondaryDim, spec.measure],
  );

  const total = rows.length || 1;
  const closed = statuses
    .filter((point) => point.tone === "good")
    .reduce((sum, point) => sum + point.value, 0);

  // Status order is the pipeline order, so counts at or past each stage read as
  // a funnel of how far work has progressed.
  const funnel = spec.statuses.map((status, index) => ({
    label: status,
    value: rows.filter((row) => {
      const rowIndex = spec.statuses.indexOf(String(row[spec.statusField.key]));
      return rowIndex >= index;
    }).length,
  }));

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <ChartFrame
        className="xl:col-span-8"
        title={`${measureLabel} — Twelve Month Trend`}
        subtitle={`Total against the share already ${spec.statuses.at(-1)?.toLowerCase() ?? "closed"}`}
        series={[
          { key: "total", label: `Total ${measureLabel}` },
          { key: "completed", label: "Closed" },
        ]}
        data={months}
        categoryKey="month"
        categoryLabel="Month"
        format={fmt}
      >
        <TrendAreaChart
          data={months}
          categoryKey="month"
          series={[
            { key: "total", label: `Total ${measureLabel}` },
            { key: "completed", label: "Closed" },
          ]}
          height={280}
          format={fmt}
          tickFormat={tick}
        />
      </ChartFrame>

      <ChartFrame
        className="xl:col-span-4"
        title="Status Mix"
        subtitle="Share of records by current status"
        series={statuses.map((point) => ({ key: point.label, label: point.label }))}
        data={statuses.map((point) => ({ status: point.label, value: point.value }))}
        categoryKey="status"
        categoryLabel="Status"
        format={(value) => number(value)}
        hideLegend
      >
        <div className="px-3 pb-3">
          <DonutChart
            slices={statuses.map((point) => ({
              label: point.label,
              value: point.value,
              color: point.color,
            }))}
            height={210}
            format={(value) => number(value)}
            centerLabel="Records"
            centerValue={number(rows.length)}
          />
          <ul className="mt-2 flex flex-col gap-1.5">
            {statuses.map((point) => (
              <li key={point.label} className="flex items-center justify-between gap-2">
                <span className="text-ink-2 flex min-w-0 items-center gap-1.5 text-[0.6875rem]">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: point.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{point.label}</span>
                </span>
                <span className="text-ink tabular shrink-0 text-[0.6875rem] font-semibold">
                  {number(point.value)} · {percent((point.value / total) * 100, 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </ChartFrame>

      {primaryDim ? (
        <ChartFrame
          className="xl:col-span-7"
          title={`${measureLabel} by ${primaryDim.label}`}
          subtitle="Where the volume concentrates"
          series={[{ key: "value", label: measureLabel }]}
          data={byPrimary}
          categoryKey="category"
          categoryLabel={primaryDim.label}
          format={fmt}
        >
          <SeriesBarChart
            data={byPrimary}
            categoryKey="category"
            series={[{ key: "value", label: measureLabel }]}
            height={280}
            layout="horizontal"
            format={fmt}
            tickFormat={tick}
          />
        </ChartFrame>
      ) : null}

      <ChartFrame
        className="xl:col-span-5"
        title="Record Volume by Month"
        subtitle="How many records land in each month"
        series={[{ key: "count", label: "Records" }]}
        data={months}
        categoryKey="month"
        categoryLabel="Month"
        format={(value) => number(value)}
      >
        <SeriesBarChart
          data={months}
          categoryKey="month"
          series={[{ key: "count", label: "Records" }]}
          height={280}
          format={(value) => number(value)}
          tickFormat={(value) => compactNumber(value)}
        />
      </ChartFrame>

      <ChartFrame
        className="xl:col-span-4"
        title="Pipeline Progression"
        subtitle="Records that have reached each stage"
        series={[{ key: "value", label: "Records" }]}
        data={funnel.map((stage) => ({ stage: stage.label, value: stage.value }))}
        categoryKey="stage"
        categoryLabel="Stage"
        format={(value) => number(value)}
        hideLegend
      >
        <div className="px-3 py-3">
          <FunnelChart stages={funnel} format={(value) => number(value)} />
        </div>
      </ChartFrame>

      <ChartFrame
        className="xl:col-span-4"
        title={`Top ${secondaryDim?.label ?? "Contributors"}`}
        subtitle={`Ranked by ${measureLabel.toLowerCase()}`}
        series={[{ key: "value", label: measureLabel }]}
        data={bySecondary}
        categoryKey="category"
        categoryLabel={secondaryDim?.label ?? "Category"}
        format={fmt}
        hideLegend
      >
        <div className="px-3 pt-1 pb-3">
          <RankedBars
            items={bySecondary.map((item) => ({
              label: item.category,
              value: item.value,
              caption: `${item.count} records`,
            }))}
            format={tick}
          />
        </div>
      </ChartFrame>

      <ChartFrame
        className="xl:col-span-4"
        title="Completion Health"
        subtitle="Closed share against the 85% target"
        series={[{ key: "value", label: "Completion" }]}
        data={[{ metric: "Completion", value: Math.round((closed / total) * 100) }]}
        categoryKey="metric"
        categoryLabel="Metric"
        format={(value) => percent(value)}
        hideLegend
      >
        <div className="px-4 pb-4">
          <RadialGauge
            value={Math.round((closed / total) * 100)}
            label="Completion rate"
            caption="Target ≥ 85%"
            color={`var(--series-${((tone - 1) % 8) + 1})`}
            height={175}
          />
          <div className="mt-2 flex flex-col gap-2">
            {statuses.slice(0, 3).map((point) => (
              <div key={point.label}>
                <div className="text-ink-3 flex items-center justify-between text-[0.625rem]">
                  <span className="truncate">{point.label}</span>
                  <span className="tabular">
                    {percent((point.value / total) * 100, 0)}
                  </span>
                </div>
                <ProgressBar
                  value={(point.value / total) * 100}
                  color={point.color}
                  height={4}
                  className="mt-1"
                  label={point.label}
                />
              </div>
            ))}
          </div>
        </div>
      </ChartFrame>

      <ChartFrame
        className="xl:col-span-12"
        title="Open vs Closed Movement"
        subtitle="Monthly split of the headline measure, with the twelve-month average"
        series={[
          { key: "open", label: "Open" },
          { key: "completed", label: "Closed" },
        ]}
        data={months}
        categoryKey="month"
        categoryLabel="Month"
        format={fmt}
      >
        <MultiLineChart
          data={months}
          categoryKey="month"
          series={[
            { key: "open", label: "Open" },
            { key: "completed", label: "Closed" },
          ]}
          height={260}
          format={fmt}
          tickFormat={tick}
          referenceValue={
            months.reduce((sum, month) => sum + month.total, 0) / (months.length || 1)
          }
          referenceLabel="12-month average"
        />
      </ChartFrame>
    </div>
  );
}
