"use client";

import { Download, ShieldCheck } from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, LivePill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/stat-tile";
import { ProgressBar } from "@/components/ui/progress";
import { ChartFrame } from "@/components/charts/chart-frame";
import { MultiLineChart, SeriesBarChart } from "@/components/charts/cartesian";
import { DonutChart, RadarProfile, RadialGauge } from "@/components/charts/radial";
import { FunnelChart, RankedBars } from "@/components/charts/specialty";
import {
  AQL_RESULTS,
  CAPA_STATUS,
  COPQ_BREAKDOWN,
  FPY_CONTROL,
  NCR_BY_SOURCE,
  SUPPLIER_PPM,
} from "@/lib/data/flagship";
import { DEFECT_PARETO, QUALITY_TREND, SUPPLIER_RADAR } from "@/lib/data/dashboard";
import { compactCurrency, currency, number, percent } from "@/lib/utils/format";
import type { FlagshipProps } from "./types";

export function QualityDashboardWorkspace({ module, sub }: FlagshipProps) {
  const latestFpy = FPY_CONTROL.at(-1)?.fpy ?? 95;
  const totalCopq = COPQ_BREAKDOWN.reduce((sum, row) => sum + row.value, 0);
  const totalNcr = NCR_BY_SOURCE.reduce((sum, row) => sum + row.value, 0);
  const totalDefects = DEFECT_PARETO.reduce((sum, row) => sum + row.value, 0);
  const capaTotal = CAPA_STATUS.reduce((sum, row) => sum + row.value, 0);
  const overdueCapa = CAPA_STATUS.find((row) => row.label === "Overdue")?.value ?? 0;

  const inspectionFunnel = [
    { label: "Lots Presented", value: 2_486 },
    { label: "Inspected", value: 2_412 },
    { label: "Passed AQL", value: 2_184 },
    { label: "Reinspected", value: 148 },
    { label: "Released", value: 2_296 },
  ];

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title="Quality Dashboard"
        subtitle="First-pass yield, non-conformance, CAPA and the cost of poor quality"
        icon={module.icon}
        tone={module.tone}
        badge={
          <>
            <Badge tone="accent">{sub.kind}</Badge>
            <LivePill />
          </>
        }
        crumbs={[
          { label: "Home", href: "/dashboard" },
          { label: "Modules", href: "/modules" },
          { label: module.short, href: `/m/${module.slug}` },
          { label: sub.name },
        ]}
        action={
          <>
            <Button variant="secondary" size="md">
              <Download size={15} />
              <span className="hidden sm:inline">Quality Report</span>
            </Button>
            <Button variant="primary" size="md">
              <ShieldCheck size={15} />
              <span className="hidden sm:inline">Raise NCR</span>
            </Button>
          </>
        }
      />

      <section aria-label="Quality indicators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatTile
            label="First Pass Yield"
            value={percent(latestFpy, 2)}
            delta={1.8}
            caption="target 95.0%"
            tone={3}
          />
          <StatTile
            label="Open NCRs"
            value={number(totalNcr)}
            delta={-6.4}
            invertDelta
            caption="across all sources"
            tone={8}
          />
          <StatTile
            label="Cost of Poor Quality"
            value={compactCurrency(totalCopq)}
            delta={-9.2}
            invertDelta
            caption="3.6% of revenue"
            tone={2}
          />
          <StatTile
            label="CAPA Overdue"
            value={number(overdueCapa)}
            delta={-14.3}
            invertDelta
            caption={`of ${capaTotal} total`}
            tone={4}
          />
          <StatTile
            label="Defects Logged"
            value={number(totalDefects)}
            delta={-4.8}
            invertDelta
            caption="this quarter"
            tone={5}
          />
        </div>
      </section>

      <section
        aria-label="Yield control"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-8"
          title="First Pass Yield — Control Chart"
          subtitle="Weekly FPY against the 95% specification limit"
          series={[{ key: "fpy", label: "First Pass Yield" }]}
          data={FPY_CONTROL}
          categoryKey="period"
          categoryLabel="Week"
          format={(value) => percent(value, 2)}
          footnote="A single series needs no legend box — the title names it. The reference rule is a solid hairline, never dashed."
        >
          <MultiLineChart
            data={FPY_CONTROL}
            categoryKey="period"
            series={[{ key: "fpy", label: "First Pass Yield" }]}
            height={280}
            format={(value) => percent(value, 2)}
            tickFormat={(value) => `${value}%`}
            referenceValue={95}
            referenceLabel="Spec limit 95%"
          />
        </ChartFrame>

        <Card className="xl:col-span-4">
          <CardHeader
            title="Quality Health"
            subtitle="Composite against the buyer standard"
          />
          <div className="px-4 pb-4 sm:px-5">
            <RadialGauge
              value={latestFpy}
              label="First Pass Yield"
              caption="Rolling 4-week average"
              color={
                latestFpy >= 95 ? "var(--status-good)" : "var(--status-warning)"
              }
              height={180}
            />
            <ul className="mt-3 flex flex-col gap-2.5">
              {CAPA_STATUS.map((item) => (
                <li key={item.label}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <Badge tone={item.tone} withIcon>
                      {item.label}
                    </Badge>
                    <span className="text-ink tabular text-xs font-semibold">
                      {number(item.value)}
                    </span>
                  </div>
                  <ProgressBar
                    value={(item.value / capaTotal) * 100}
                    color={`var(--status-${item.tone})`}
                    height={4}
                    label={`CAPA ${item.label}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <section
        aria-label="Defect analysis"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-4"
          title="Defect Pareto"
          subtitle="Which defects drive the volume"
          series={[{ key: "value", label: "Occurrences" }]}
          data={DEFECT_PARETO.map((row) => ({
            defect: row.label,
            value: row.value,
          }))}
          categoryKey="defect"
          categoryLabel="Defect"
          format={(value) => number(value)}
          hideLegend
        >
          <div className="px-3 pt-1 pb-3">
            <RankedBars
              items={DEFECT_PARETO}
              format={(value) => number(value)}
              highlightLabel="Plating Peel-off"
            />
          </div>
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Supplier Quality (PPM)"
          subtitle="Defective parts per million by supplier"
          series={[{ key: "value", label: "PPM" }]}
          data={SUPPLIER_PPM.map((row) => ({
            supplier: row.label,
            value: row.value,
          }))}
          categoryKey="supplier"
          categoryLabel="Supplier"
          format={(value) => `${number(value)} ppm`}
          hideLegend
        >
          <div className="px-3 pt-1 pb-3">
            <RankedBars
              items={[...SUPPLIER_PPM].sort((a, b) => b.value - a.value)}
              format={(value) => number(value)}
              highlightLabel="Shanghai Die & Tool"
            />
          </div>
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="NCR by Source"
          subtitle="Where non-conformances are caught"
          series={NCR_BY_SOURCE.map((row) => ({
            key: row.label,
            label: row.label,
          }))}
          data={NCR_BY_SOURCE.map((row) => ({
            source: row.label,
            ...Object.fromEntries(
              NCR_BY_SOURCE.map((inner) => [
                inner.label,
                inner.label === row.label ? inner.value : 0,
              ]),
            ),
          }))}
          categoryKey="source"
          categoryLabel="Source"
          format={(value) => number(value)}
          hideLegend
        >
          <div className="px-3 pb-3">
            <DonutChart
              slices={NCR_BY_SOURCE}
              height={220}
              format={(value) => `${value} NCRs`}
              centerLabel="Total NCRs"
              centerValue={number(totalNcr)}
            />
            <ul className="mt-2 flex flex-col gap-1.5">
              {NCR_BY_SOURCE.map((row, index) => (
                <li key={row.label} className="flex items-center justify-between gap-2">
                  <span className="text-ink-2 flex min-w-0 items-center gap-1.5 text-[0.6875rem]">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: `var(--series-${index + 1})` }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{row.label}</span>
                  </span>
                  <span className="text-ink tabular shrink-0 text-[0.6875rem] font-semibold">
                    {number(row.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartFrame>
      </section>

      <section
        aria-label="Inspection and cost"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-5"
          title="AQL Inspection Results"
          subtitle="Lots passed, failed and re-inspected each month"
          series={[
            { key: "passed", label: "Passed" },
            { key: "failed", label: "Failed" },
            { key: "reinspected", label: "Re-inspected" },
          ]}
          data={AQL_RESULTS}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => `${number(value)} lots`}
        >
          <SeriesBarChart
            data={AQL_RESULTS}
            categoryKey="month"
            series={[
              { key: "passed", label: "Passed" },
              { key: "failed", label: "Failed" },
              { key: "reinspected", label: "Re-inspected" },
            ]}
            height={270}
            stacked
            format={(value) => `${number(value)} lots`}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Cost of Poor Quality"
          subtitle="Where quality failure money goes"
          series={COPQ_BREAKDOWN.map((row) => ({
            key: row.label,
            label: row.label,
          }))}
          data={COPQ_BREAKDOWN.map((row) => ({
            category: row.label,
            ...Object.fromEntries(
              COPQ_BREAKDOWN.map((inner) => [
                inner.label,
                inner.label === row.label ? inner.value : 0,
              ]),
            ),
          }))}
          categoryKey="category"
          categoryLabel="Cost Category"
          format={(value) => currency(value)}
          hideLegend
        >
          <div className="px-3 pb-3">
            <DonutChart
              slices={COPQ_BREAKDOWN}
              height={220}
              format={(value) => compactCurrency(value)}
              centerLabel="Total COPQ"
              centerValue={compactCurrency(totalCopq)}
            />
          </div>
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-3"
          title="Inspection Funnel"
          subtitle="Lot flow from presentation to release"
          series={[{ key: "value", label: "Lots" }]}
          data={inspectionFunnel.map((stage) => ({
            stage: stage.label,
            value: stage.value,
          }))}
          categoryKey="stage"
          categoryLabel="Stage"
          format={(value) => number(value)}
          hideLegend
        >
          <div className="px-3 py-3">
            <FunnelChart
              stages={inspectionFunnel}
              format={(value) => number(value)}
            />
          </div>
        </ChartFrame>
      </section>

      <section
        aria-label="Quality trend and supplier capability"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-7"
          title="Rejection, Rework and Yield"
          subtitle="Twelve-month movement — all three measured in percent"
          series={[
            { key: "firstPassYield", label: "First Pass Yield" },
            { key: "rejectionRate", label: "Rejection Rate" },
            { key: "reworkRate", label: "Rework Rate" },
          ]}
          data={QUALITY_TREND}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => percent(value, 2)}
        >
          <MultiLineChart
            data={QUALITY_TREND}
            categoryKey="month"
            series={[
              { key: "firstPassYield", label: "First Pass Yield" },
              { key: "rejectionRate", label: "Rejection Rate" },
              { key: "reworkRate", label: "Rework Rate" },
            ]}
            height={270}
            format={(value) => percent(value, 2)}
            tickFormat={(value) => `${value}%`}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-5"
          title="Supplier Capability Profile"
          subtitle="Best-performing supplier against the base average"
          series={[
            { key: "top", label: "Top Supplier" },
            { key: "average", label: "Base Average" },
          ]}
          data={SUPPLIER_RADAR}
          categoryKey="dimension"
          categoryLabel="Dimension"
          format={(value) => `${value}/100`}
        >
          <RadarProfile
            data={SUPPLIER_RADAR}
            series={[
              { key: "top", label: "Top Supplier" },
              { key: "average", label: "Base Average" },
            ]}
            height={270}
            format={(value) => `${value}/100`}
          />
        </ChartFrame>
      </section>
    </PageShell>
  );
}
