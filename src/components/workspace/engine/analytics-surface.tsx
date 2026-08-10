"use client";

import { useMemo } from "react";
import { ChartFrame } from "@/components/charts/chart-frame";
import {
  ComboBarLineChart,
  MultiLineChart,
  SeriesBarChart,
} from "@/components/charts/cartesian";
import { DonutChart, RadialGauge } from "@/components/charts/radial";
import { FunnelChart, RankedBars } from "@/components/charts/specialty";
import { ProgressBar } from "@/components/ui/progress";
import {
  compactCurrency,
  compactNumber,
  number,
  percent,
} from "@/lib/utils/format";
import type { Dataset } from "@/lib/data/dataset-types";
import { groupBy, monthlyTrend, statusBreakdown, type Row } from "@/lib/data/collection";

const TONE_COLOR: Record<string, string> = {
  good: "var(--status-good)",
  warning: "var(--status-warning)",
  serious: "var(--status-serious)",
  critical: "var(--status-critical)",
  info: "var(--status-info)",
  accent: "var(--accent)",
  neutral: "var(--status-neutral)",
};

/**
 * Every chart here reads the *filtered* rows, so the analytics move with the
 * table above them — filter to one buyer and the whole surface re-scopes.
 */
export function AnalyticsSurface({
  dataset,
  rows,
  tone,
  variant = "full",
}: {
  dataset: Dataset;
  rows: Row[];
  tone: number;
  /** "compact" drops the lower half for list workspaces. */
  variant?: "full" | "compact";
}) {
  const trend = useMemo(() => monthlyTrend(dataset, rows), [dataset, rows]);
  const groups = useMemo(
    () => groupBy(rows, dataset.groupKey, dataset.valueKey),
    [rows, dataset],
  );
  const statuses = useMemo(() => statusBreakdown(dataset, rows), [dataset, rows]);

  const groupField = dataset.fields.find((field) => field.key === dataset.groupKey);
  const valueField = dataset.fields.find((field) => field.key === dataset.valueKey);
  const isCurrency = valueField?.type === "currency";
  const formatValue = (value: number) =>
    isCurrency ? compactCurrency(value) : compactNumber(value);

  const settledShare = statuses
    .filter(({ status }) => dataset.statusTones[status] === "good")
    .reduce((sum, entry) => sum + entry.share, 0);

  const funnel = useMemo(() => {
    const ordered = Object.keys(dataset.statusTones);
    let remaining = rows.length;
    return ordered.slice(0, 5).map((status) => {
      const count = statuses.find((entry) => entry.status === status)?.value ?? 0;
      const stage = { label: status, value: Math.max(count, 0) || remaining };
      remaining = Math.max(0, remaining - count);
      return stage;
    });
  }, [dataset, rows.length, statuses]);

  const totalValue = rows.reduce(
    (sum, row) => sum + Number(row[dataset.valueKey ?? ""] ?? 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <ChartFrame
        className="xl:col-span-7"
        title={`${dataset.plural} Over Time`}
        subtitle="Volume raised each period against the volume settled"
        series={[
          { key: "volume", label: `${dataset.plural} Raised` },
          { key: "settled", label: "Settled" },
        ]}
        data={trend}
        categoryKey="month"
        categoryLabel="Period"
        format={(value) => number(value)}
      >
        <ComboBarLineChart
          data={trend}
          categoryKey="month"
          barSeries={[{ key: "volume", label: `${dataset.plural} Raised` }]}
          lineSeries={[{ key: "settled", label: "Settled" }]}
          height={280}
          format={(value) => number(value)}
          tickFormat={(value) => compactNumber(value)}
        />
      </ChartFrame>

      <ChartFrame
        className="xl:col-span-5"
        title="Status Mix"
        subtitle={`How the ${rows.length} visible ${dataset.plural.toLowerCase()} are distributed`}
        series={statuses.map((entry) => ({ key: entry.status, label: entry.status }))}
        data={statuses.map((entry) => ({ status: entry.status, value: entry.value }))}
        categoryKey="status"
        categoryLabel="Status"
        format={(value) => number(value)}
        hideLegend
      >
        <div className="px-3 pb-3">
          <DonutChart
            slices={statuses
              .filter((entry) => entry.value > 0)
              .map((entry) => ({
                label: entry.status,
                value: entry.value,
                color: TONE_COLOR[dataset.statusTones[entry.status] ?? "neutral"],
              }))}
            height={210}
            format={(value) => number(value)}
            centerLabel="Records"
            centerValue={number(rows.length)}
          />
          <ul className="mt-2 flex flex-col gap-1.5">
            {statuses.map((entry) => (
              <li
                key={entry.status}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-ink-2 flex min-w-0 items-center gap-1.5 text-[0.6875rem]">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        TONE_COLOR[dataset.statusTones[entry.status] ?? "neutral"],
                    }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{entry.status}</span>
                </span>
                <span className="text-ink tabular shrink-0 text-[0.6875rem] font-semibold">
                  {number(entry.value)} · {percent(entry.share, 0)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </ChartFrame>

      {groups.length > 0 ? (
        <ChartFrame
          className="xl:col-span-7"
          title={`By ${groupField?.label ?? "Category"}`}
          subtitle={
            valueField
              ? `Record count and total ${valueField.label.toLowerCase()}`
              : "Record count by category"
          }
          series={[
            { key: "value", label: "Records" },
            ...(valueField ? [{ key: "secondary", label: valueField.label }] : []),
          ]}
          data={groups}
          categoryKey="category"
          categoryLabel={groupField?.label ?? "Category"}
          format={(value) => number(value)}
        >
          <SeriesBarChart
            data={groups}
            categoryKey="category"
            series={[{ key: "value", label: "Records" }]}
            height={Math.max(220, groups.length * 34)}
            layout="horizontal"
            format={(value) => number(value)}
            tickFormat={(value) => compactNumber(value)}
          />
        </ChartFrame>
      ) : null}

      <div className="flex flex-col gap-4 xl:col-span-5">
        <ChartFrame
          title="Settlement Health"
          subtitle="Share of records in a settled state"
          series={[{ key: "score", label: "Settled" }]}
          data={[{ metric: "Settled", score: Math.round(settledShare) }]}
          categoryKey="metric"
          categoryLabel="Metric"
          format={(value) => percent(value)}
          hideLegend
        >
          <div className="px-3 pb-3">
            <RadialGauge
              value={Math.round(settledShare)}
              label="Settled share"
              caption={`${number(rows.length)} ${dataset.plural.toLowerCase()} in view`}
              color={`var(--series-${tone})`}
              height={180}
            />
          </div>
        </ChartFrame>

        <ChartFrame
          title={valueField ? `Top by ${valueField.label}` : "Top Categories"}
          subtitle="Highest contributors in the current view"
          series={[{ key: "secondary", label: valueField?.label ?? "Records" }]}
          data={groups.slice(0, 5)}
          categoryKey="category"
          categoryLabel={groupField?.label ?? "Category"}
          format={formatValue}
          hideLegend
        >
          <div className="px-3 pt-1 pb-3">
            <RankedBars
              items={groups.slice(0, 5).map((entry) => ({
                label: entry.category,
                value: valueField ? entry.secondary : entry.value,
              }))}
              format={formatValue}
            />
          </div>
        </ChartFrame>
      </div>

      {variant === "full" ? (
        <>
          <ChartFrame
            className="xl:col-span-8"
            title={
              valueField
                ? `${valueField.label} Movement`
                : `${dataset.plural} Movement`
            }
            subtitle="Period view with the running average as the reference line"
            series={[
              { key: "value", label: valueField?.label ?? "Value" },
              { key: "volume", label: "Records" },
            ]}
            data={trend}
            categoryKey="month"
            categoryLabel="Period"
            format={formatValue}
          >
            <MultiLineChart
              data={trend}
              categoryKey="month"
              series={[{ key: "value", label: valueField?.label ?? "Value" }]}
              height={260}
              format={formatValue}
              tickFormat={(value) => compactNumber(value)}
              referenceValue={
                trend.reduce((sum, point) => sum + point.value, 0) / trend.length
              }
              referenceLabel="Average"
            />
          </ChartFrame>

          <ChartFrame
            className="xl:col-span-4"
            title="Stage Funnel"
            subtitle="How records fall through the status ladder"
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

          <div className="xl:col-span-12">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {groups.slice(0, 4).map((entry, index) => (
                <div key={entry.category} className="bg-surface-2 rounded-lg p-3">
                  <p className="text-ink-3 truncate text-[0.625rem]">
                    {entry.category}
                  </p>
                  <p className="text-ink mt-1 text-base font-semibold">
                    {valueField ? formatValue(entry.secondary) : number(entry.value)}
                  </p>
                  <ProgressBar
                    value={
                      totalValue > 0 && valueField
                        ? (entry.secondary / totalValue) * 100
                        : (entry.value / Math.max(1, rows.length)) * 100
                    }
                    color={`var(--series-${index + 1})`}
                    height={4}
                    className="mt-2"
                    label={entry.category}
                  />
                  <p className="text-ink-3 mt-1 text-[0.625rem]">
                    {number(entry.value)} {dataset.plural.toLowerCase()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
