"use client";

import { useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Badge, LivePill, type StatusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/stat-tile";
import { ProgressBar, StackedMeter } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/tabs";
import { DataTable, type Column } from "@/components/ui/data-table";
import { ChartFrame } from "@/components/charts/chart-frame";
import { MultiLineChart, SeriesBarChart } from "@/components/charts/cartesian";
import { DonutChart } from "@/components/charts/radial";
import { ScatterPlot } from "@/components/charts/specialty";
import {
  ABC_SCATTER,
  STOCK_BY_STORE,
  STOCK_ITEMS,
  TURNOVER_TREND,
  type StockItem,
} from "@/lib/data/flagship";
import { INVENTORY_AGING, INVENTORY_MIX } from "@/lib/data/dashboard";
import {
  compactCurrency,
  compactNumber,
  currency,
  number,
  percent,
} from "@/lib/utils/format";
import type { FlagshipProps } from "./types";

const STATUS_TONE: Record<StockItem["status"], StatusTone> = {
  Healthy: "good",
  Low: "warning",
  Critical: "critical",
  Excess: "info",
};

const FILTERS = [
  { value: "all" as const, label: "All" },
  { value: "low" as const, label: "Low / Critical" },
  { value: "excess" as const, label: "Excess" },
  { value: "a-class" as const, label: "A Class" },
];

export function StockSummaryWorkspace({ module, sub }: FlagshipProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");

  const rows = useMemo(() => {
    switch (filter) {
      case "low":
        return STOCK_ITEMS.filter(
          (item) => item.status === "Low" || item.status === "Critical",
        );
      case "excess":
        return STOCK_ITEMS.filter((item) => item.status === "Excess");
      case "a-class":
        return STOCK_ITEMS.filter((item) => item.abcClass === "A");
      default:
        return STOCK_ITEMS;
    }
  }, [filter]);

  const totalValue = STOCK_ITEMS.reduce((sum, item) => sum + item.value, 0);
  const lowCount = STOCK_ITEMS.filter(
    (item) => item.status === "Low" || item.status === "Critical",
  ).length;
  const excessValue = STOCK_ITEMS.filter((item) => item.status === "Excess").reduce(
    (sum, item) => sum + item.value,
    0,
  );
  const reservedValue = STOCK_ITEMS.reduce(
    (sum, item) => sum + item.reserved * item.unitCost,
    0,
  );

  const abcSplit = (["A", "B", "C"] as const).map((cls, index) => ({
    label: `Class ${cls}`,
    value: STOCK_ITEMS.filter((item) => item.abcClass === cls).reduce(
      (sum, item) => sum + item.value,
      0,
    ),
    color: `var(--series-${index + 1})`,
  }));

  const columns: Column<StockItem>[] = [
    {
      key: "code",
      header: "Item Code",
      width: "w-28",
      render: (row) => <span className="text-ink font-medium">{row.code}</span>,
    },
    {
      key: "name",
      header: "Description",
      render: (row) => (
        <span className="block max-w-[14rem] truncate">{row.name}</span>
      ),
    },
    { key: "store", header: "Store", hideOnMobile: true },
    {
      key: "abcClass",
      header: "Class",
      align: "center",
      hideOnMobile: true,
      render: (row) => <Badge tone="neutral">{row.abcClass}</Badge>,
    },
    {
      key: "onHand",
      header: "On Hand",
      align: "right",
      render: (row) => number(row.onHand),
    },
    {
      key: "reserved",
      header: "Reserved",
      align: "right",
      hideOnMobile: true,
      render: (row) => number(row.reserved),
    },
    {
      key: "available",
      header: "Available",
      align: "right",
      render: (row) => (
        <span
          className={
            row.available <= row.reorderLevel ? "text-warning font-semibold" : ""
          }
        >
          {number(row.available)}
        </span>
      ),
    },
    {
      key: "reorderLevel",
      header: "Reorder At",
      align: "right",
      hideOnMobile: true,
      render: (row) => number(row.reorderLevel),
    },
    {
      key: "coverage",
      header: "Coverage",
      width: "w-28",
      hideOnMobile: true,
      accessor: (row) => row.available / Math.max(1, row.reorderLevel),
      render: (row) => (
        <ProgressBar
          value={Math.min(
            100,
            (row.available / Math.max(1, row.reorderLevel)) * 50,
          )}
          height={5}
          color={
            row.available <= row.reorderLevel * 0.4
              ? "var(--status-critical)"
              : row.available <= row.reorderLevel
                ? "var(--status-warning)"
                : "var(--status-good)"
          }
          label={`${row.code} coverage`}
        />
      ),
    },
    {
      key: "value",
      header: "Stock Value",
      align: "right",
      render: (row) => (
        <span className="text-ink font-semibold">{compactCurrency(row.value)}</span>
      ),
    },
    {
      key: "ageDays",
      header: "Age",
      align: "right",
      hideOnMobile: true,
      render: (row) => `${row.ageDays} d`,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge tone={STATUS_TONE[row.status]} withIcon>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title="Stock Summary"
        subtitle="Company-wide stock position, valuation, coverage and ageing"
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
            <Segmented
              options={FILTERS}
              value={filter}
              onChange={setFilter}
              ariaLabel="Stock filter"
              size="md"
            />
            <Button variant="secondary" size="md">
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="primary" size="md">
              <Plus size={15} />
              <span className="hidden sm:inline">Adjustment</span>
            </Button>
          </>
        }
      />

      <section aria-label="Inventory indicators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatTile
            label="Total Stock Value"
            value={compactCurrency(totalValue)}
            delta={6.7}
            caption={`${STOCK_ITEMS.length} SKUs`}
            tone={1}
          />
          <StatTile
            label="Reserved Value"
            value={compactCurrency(reservedValue)}
            delta={12.1}
            caption="committed to orders"
            tone={7}
          />
          <StatTile
            label="Low / Critical Items"
            value={number(lowCount)}
            delta={-4.2}
            invertDelta
            caption="below reorder level"
            tone={8}
          />
          <StatTile
            label="Excess Stock"
            value={compactCurrency(excessValue)}
            delta={-8.6}
            invertDelta
            caption="above 4× reorder"
            tone={4}
          />
          <StatTile
            label="Inventory Turns"
            value={`${TURNOVER_TREND.at(-1)?.turns ?? 5.2}×`}
            delta={5.4}
            caption="target 6.0×"
            tone={3}
          />
        </div>
      </section>

      <section
        aria-label="Inventory analytics"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-5"
          title="Stock Value by Store"
          subtitle="Split by ABC class within each store"
          series={[
            { key: "raw", label: "A Class" },
            { key: "wip", label: "B Class" },
            { key: "finished", label: "C Class" },
          ]}
          data={STOCK_BY_STORE}
          categoryKey="store"
          categoryLabel="Store"
          format={(value) => currency(value)}
        >
          <SeriesBarChart
            data={STOCK_BY_STORE}
            categoryKey="store"
            series={[
              { key: "raw", label: "A Class" },
              { key: "wip", label: "B Class" },
              { key: "finished", label: "C Class" },
            ]}
            height={280}
            stacked
            layout="horizontal"
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Inventory Composition"
          subtitle="Value held by stock type"
          series={INVENTORY_MIX.map((item) => ({
            key: item.label,
            label: item.label,
          }))}
          data={INVENTORY_MIX.map((item) => ({
            type: item.label,
            ...Object.fromEntries(
              INVENTORY_MIX.map((inner) => [
                inner.label,
                inner.label === item.label ? inner.value : 0,
              ]),
            ),
          }))}
          categoryKey="type"
          categoryLabel="Stock Type"
          format={(value) => currency(value)}
          hideLegend
        >
          <div className="px-3 pb-3">
            <DonutChart
              slices={INVENTORY_MIX}
              height={215}
              format={(value) => compactCurrency(value)}
              centerLabel="Inventory"
              centerValue="$12.78M"
            />
            <div className="mt-3">
              <p className="text-ink-3 mb-1.5 text-[0.625rem]">ABC value split</p>
              <StackedMeter
                segments={abcSplit}
                height={8}
                label="ABC class split by value"
              />
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {abcSplit.map((segment) => (
                  <li
                    key={segment.label}
                    className="text-ink-2 flex items-center gap-1.5 text-[0.625rem]"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: segment.color }}
                      aria-hidden="true"
                    />
                    {segment.label} · {compactCurrency(segment.value)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-3"
          title="Stock Aging"
          subtitle="Value by age bucket"
          series={[{ key: "value", label: "Value" }]}
          data={INVENTORY_AGING}
          categoryKey="bucket"
          categoryLabel="Age Bucket"
          format={(value) => currency(value)}
          hideLegend
        >
          <SeriesBarChart
            data={INVENTORY_AGING}
            categoryKey="bucket"
            series={[{ key: "value", label: "Value" }]}
            height={280}
            layout="horizontal"
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>
      </section>

      <section
        aria-label="Turnover and classification"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-6"
          title="Inventory Turns & Days of Supply"
          subtitle="Turns and days of supply are different units, so each keeps its own chart"
          series={[{ key: "turns", label: "Inventory Turns" }]}
          data={TURNOVER_TREND}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => `${value}×`}
        >
          <MultiLineChart
            data={TURNOVER_TREND}
            categoryKey="month"
            series={[{ key: "turns", label: "Inventory Turns" }]}
            height={250}
            format={(value) => `${value}×`}
            tickFormat={(value) => `${value}×`}
            referenceValue={6}
            referenceLabel="Target 6.0×"
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-6"
          title="Stock Value vs Age"
          subtitle="Each bubble is a SKU; size is quantity on hand"
          series={ABC_SCATTER.map((group) => ({
            key: group.label,
            label: group.label,
          }))}
          data={ABC_SCATTER.flatMap((group) =>
            group.points.slice(0, 6).map((point, index) => ({
              sku: `${group.label} #${index + 1}`,
              [group.label]: point.y,
            })),
          )}
          categoryKey="sku"
          categoryLabel="SKU"
          format={(value) => `${value} days`}
          footnote="Bubbles overlap, so this is an all-pairs form: three series maximum, each with a 2px surface ring."
        >
          <ScatterPlot
            groups={ABC_SCATTER}
            height={250}
            xLabel="Stock value (USD)"
            yLabel="Age (days)"
            formatX={(value) => compactCurrency(value)}
            formatY={(value) => `${value}d`}
          />
        </ChartFrame>
      </section>

      <section aria-label="Stock records">
        <Card>
          <DataTable
            caption="Stock position by item"
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            pageSize={12}
            searchPlaceholder="Search item code, description, store…"
            footer={
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-ink-3 text-[0.625rem]">SKUs shown</p>
                  <p className="text-ink tabular mt-0.5 text-sm font-semibold">
                    {number(rows.length)}
                  </p>
                </div>
                <div>
                  <p className="text-ink-3 text-[0.625rem]">Quantity on hand</p>
                  <p className="text-ink tabular mt-0.5 text-sm font-semibold">
                    {compactNumber(rows.reduce((s, r) => s + r.onHand, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-ink-3 text-[0.625rem]">Stock value</p>
                  <p className="text-good tabular mt-0.5 text-sm font-semibold">
                    {compactCurrency(rows.reduce((s, r) => s + r.value, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-ink-3 text-[0.625rem]">Below reorder</p>
                  <p className="text-warning tabular mt-0.5 text-sm font-semibold">
                    {percent(
                      (rows.filter((r) => r.available <= r.reorderLevel).length /
                        Math.max(1, rows.length)) *
                        100,
                    )}
                  </p>
                </div>
              </div>
            }
          />
        </Card>
      </section>
    </PageShell>
  );
}
