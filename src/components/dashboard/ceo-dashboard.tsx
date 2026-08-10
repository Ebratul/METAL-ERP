"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  Building2,
  CircleAlert,
  Crown,
  Download,
  Factory,
  Globe,
  Handshake,
  Package,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, LivePill } from "@/components/ui/badge";
import { Button, LinkButton } from "@/components/ui/button";
import { MiniStat, StatTile, Delta } from "@/components/ui/stat-tile";
import { ProgressBar } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/tabs";
import { ModuleIcon } from "@/components/icons/module-icon";
import { TOTAL_MODULES } from "@/lib/modules";
import { ChartFrame } from "@/components/charts/chart-frame";
import {
  ComboBarLineChart,
  MultiLineChart,
  SeriesBarChart,
  TrendAreaChart,
} from "@/components/charts/cartesian";
import { DonutChart, RadarProfile, RadialGauge } from "@/components/charts/radial";
import {
  FunnelChart,
  Heatmap,
  RankedBars,
  ScatterPlot,
} from "@/components/charts/specialty";
import {
  AiInsightsPanel,
  ApprovalsPanel,
  LiveAlertsPanel,
  QuickActionsPanel,
  SystemStatusPanel,
} from "./panels";
import {
  BUSINESS_PERFORMANCE,
  CAPACITY_HEATMAP,
  CASH_FLOW_13W,
  CASH_POSITION,
  COUNTRY_SALES,
  DEFECT_PARETO,
  ENERGY_TREND,
  HEADLINE_KPIS,
  INVENTORY_AGING,
  INVENTORY_MIX,
  LINE_OEE,
  ORDER_FUNNEL,
  ORDER_SCATTER,
  PRODUCT_FAMILIES,
  PRODUCTION_STAGES,
  QUALITY_TREND,
  REVENUE_MIX,
  SHIPMENT_STATUS,
  SUPPLIER_RADAR,
  TOP_BUYERS,
  WORKFORCE,
} from "@/lib/data/dashboard";
import {
  compactCurrency,
  compactNumber,
  currency,
  number,
  percent,
} from "@/lib/utils/format";

type Range = "month" | "quarter" | "year";

const RANGE_OPTIONS = [
  { value: "month" as const, label: "Month" },
  { value: "quarter" as const, label: "Quarter" },
  { value: "year" as const, label: "Year" },
];

const SECONDARY_STATS = [
  { label: "Total Products", value: "18,742", delta: 4.3, icon: <Package size={17} />, tone: 1 as const },
  { label: "Inventory Value", value: "$12.78M", delta: 6.7, icon: <Boxes size={17} />, tone: 3 as const },
  { label: "Low Stock Items", value: "236", delta: -2.1, invert: true, icon: <CircleAlert size={17} />, tone: 8 as const },
  { label: "Active Suppliers", value: "1,245", delta: 3.2, icon: <Handshake size={17} />, tone: 5 as const },
  { label: "Shipments in Transit", value: "156", delta: 8.4, icon: <Truck size={17} />, tone: 2 as const },
  { label: "Warehouses", value: "45", delta: 1.6, icon: <Warehouse size={17} />, tone: 4 as const },
  { label: "Plants & Branches", value: "32", delta: 2.0, icon: <Building2 size={17} />, tone: 7 as const },
  { label: "Export Countries", value: "42", delta: 5.0, icon: <Globe size={17} />, tone: 6 as const },
];

export function CeoDashboard() {
  // One filter row scoping the whole surface — never a per-card filter.
  const [range, setRange] = useState<Range>("year");

  const totalRevenue = BUSINESS_PERFORMANCE.reduce((sum, row) => sum + row.revenue, 0);
  const totalProfit = BUSINESS_PERFORMANCE.reduce((sum, row) => sum + row.profit, 0);
  const totalExpenses = BUSINESS_PERFORMANCE.reduce((sum, row) => sum + row.expenses, 0);
  const netCashFlow = CASH_FLOW_13W.reduce((sum, row) => sum + row.net, 0);

  const perfSlice =
    range === "month"
      ? BUSINESS_PERFORMANCE.slice(-1)
      : range === "quarter"
        ? BUSINESS_PERFORMANCE.slice(-3)
        : BUSINESS_PERFORMANCE;

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title="CEO Command Center"
        subtitle="Real-time overview of your entire business"
        icon="LayoutDashboard"
        tone={7}
        badge={<LivePill />}
        crumbs={[{ label: "Home", href: "/dashboard" }, { label: "CEO Command Center" }]}
        action={
          <>
            <Segmented
              options={RANGE_OPTIONS}
              value={range}
              onChange={setRange}
              ariaLabel="Reporting period"
              size="md"
            />
            <Button variant="secondary" size="md">
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <LinkButton href="/modules" variant="primary" size="md">
              <Crown size={15} />
              <span className="hidden sm:inline">All {TOTAL_MODULES} Modules</span>
            </LinkButton>
          </>
        }
      />

      {/* ── Headline KPIs ──────────────────────────────────────────────── */}
      <section aria-label="Headline performance indicators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {HEADLINE_KPIS.map((kpi) => (
            <StatTile
              key={kpi.id}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              invertDelta={kpi.invertDelta}
              caption={kpi.caption}
              tone={kpi.tone}
              trend={kpi.trend}
              icon={<ModuleIcon name={kpi.icon} size={17} />}
            />
          ))}
        </div>
      </section>

      {/* ── Performance + composition + cash ───────────────────────────── */}
      <section
        aria-label="Financial performance"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-7"
          title="Business Performance"
          subtitle="Revenue, profit and expenses on one scale"
          series={[
            { key: "revenue", label: "Revenue" },
            { key: "profit", label: "Profit" },
            { key: "expenses", label: "Expenses" },
          ]}
          data={perfSlice}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => currency(value)}
          footnote="All three measures share one currency axis — a second y-scale would invent a correlation that isn't in the data."
        >
          <MultiLineChart
            data={perfSlice}
            categoryKey="month"
            series={[
              { key: "revenue", label: "Revenue" },
              { key: "profit", label: "Profit" },
              { key: "expenses", label: "Expenses" },
            ]}
            height={280}
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-5"
          title="Revenue Composition"
          subtitle="Where the $24.57M comes from"
          series={REVENUE_MIX.map((slice) => ({
            key: slice.label,
            label: slice.label,
          }))}
          data={REVENUE_MIX.map((slice) => ({
            source: slice.label,
            ...Object.fromEntries(
              REVENUE_MIX.map((inner) => [
                inner.label,
                inner.label === slice.label ? inner.value : 0,
              ]),
            ),
          }))}
          categoryKey="source"
          categoryLabel="Source"
          format={(value) => currency(value)}
          hideLegend
        >
          <div className="grid grid-cols-1 items-center gap-4 px-3 pb-2 sm:grid-cols-2">
            <DonutChart
              slices={REVENUE_MIX}
              height={220}
              format={(value) => compactCurrency(value)}
              centerLabel="Total Revenue"
              centerValue="$24.57M"
              centerCaption="FY 2025–26"
            />
            <ul className="flex flex-col gap-2.5">
              {REVENUE_MIX.map((slice, index) => {
                const share = (slice.value / 24_570_000) * 100;
                return (
                  <li key={slice.label}>
                    <div className="mb-1 flex items-baseline justify-between gap-2">
                      <span className="text-ink-2 flex min-w-0 items-center gap-1.5 text-[0.6875rem]">
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: `var(--series-${index + 1})` }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{slice.label}</span>
                      </span>
                      <span className="text-ink tabular shrink-0 text-[0.6875rem] font-semibold">
                        {compactCurrency(slice.value)}
                      </span>
                    </div>
                    <ProgressBar
                      value={share}
                      color={`var(--series-${index + 1})`}
                      height={4}
                      label={`${slice.label} share`}
                      showValue
                      valueText={percent(share)}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </ChartFrame>
      </section>

      {/* ── Financial summary strip ────────────────────────────────────── */}
      <section aria-label="Financial summary" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-4">
          <CardHeader title="Cash Position" subtitle="As of today" icon={<ModuleIcon name="Banknote" size={16} />} />
          <ul className="flex flex-col gap-2 px-4 pb-3 sm:px-5">
            {CASH_POSITION.map((item) => (
              <li
                key={item.label}
                className="bg-surface-2 flex items-center gap-3 rounded-lg p-3"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `color-mix(in oklab, var(--series-${item.tone}) 16%, transparent)`,
                    color: `var(--series-${item.tone})`,
                  }}
                >
                  <ModuleIcon name={item.icon} size={15} />
                </span>
                <span className="text-ink-2 min-w-0 flex-1 truncate text-xs">
                  {item.label}
                </span>
                <span
                  className={`tabular shrink-0 text-sm font-semibold ${
                    item.value < 0 ? "text-down" : "text-ink"
                  }`}
                >
                  {compactCurrency(item.value)}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-line bg-accent-soft mx-4 mb-4 rounded-lg border px-3 py-3 sm:mx-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-ink-2 text-xs font-medium">Net Cash Flow</span>
              <span className="text-ink text-lg font-semibold">
                {compactCurrency(netCashFlow)}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-ink-3 text-[0.625rem]">13-week rolling</span>
              <Delta value={9.4} />
            </div>
          </div>
        </Card>

        <ChartFrame
          className="xl:col-span-8"
          title="Cash Flow Forecast"
          subtitle="13-week rolling inflow against outflow"
          series={[
            { key: "inflow", label: "Inflow" },
            { key: "outflow", label: "Outflow" },
          ]}
          data={CASH_FLOW_13W}
          categoryKey="week"
          categoryLabel="Week"
          format={(value) => currency(value)}
        >
          <SeriesBarChart
            data={CASH_FLOW_13W}
            categoryKey="week"
            series={[
              { key: "inflow", label: "Inflow" },
              { key: "outflow", label: "Outflow" },
            ]}
            height={260}
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>
      </section>

      {/* ── Secondary KPI strip ────────────────────────────────────────── */}
      <section aria-label="Operational counts">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
          {SECONDARY_STATS.map((stat) => (
            <MiniStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
              delta={stat.delta}
              invertDelta={stat.invert}
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>
      </section>

      {/* ── Markets, products, alerts ──────────────────────────────────── */}
      <section aria-label="Market performance" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-5"
          title="Sales by Country"
          subtitle="Revenue share across export markets"
          series={[{ key: "revenue", label: "Revenue" }]}
          data={COUNTRY_SALES.map((row) => ({
            country: row.country,
            revenue: row.revenue,
            orders: row.orders,
          }))}
          categoryKey="country"
          categoryLabel="Country"
          format={(value) => currency(value)}
        >
          <div className="px-3 pt-1 pb-3">
            <RankedBars
              items={COUNTRY_SALES.map((row) => ({
                label: row.country,
                value: row.revenue,
                caption: `${row.growth > 0 ? "+" : ""}${row.growth}%`,
              }))}
              format={(value) => compactCurrency(value)}
            />
          </div>
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Product Family Mix"
          subtitle="Revenue by accessory family"
          series={PRODUCT_FAMILIES.map((item) => ({
            key: item.label,
            label: item.label,
          }))}
          data={PRODUCT_FAMILIES.map((item) => ({
            family: item.label,
            ...Object.fromEntries(
              PRODUCT_FAMILIES.map((inner) => [
                inner.label,
                inner.label === item.label ? inner.value : 0,
              ]),
            ),
          }))}
          categoryKey="family"
          categoryLabel="Family"
          format={(value) => currency(value)}
          hideLegend
        >
          <div className="px-3 pb-3">
            <DonutChart
              slices={PRODUCT_FAMILIES}
              height={230}
              format={(value) => compactCurrency(value)}
              centerLabel="Families"
              centerValue="7"
              centerCaption="$24.57M total"
            />
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {PRODUCT_FAMILIES.slice(0, 6).map((item, index) => (
                <li
                  key={item.label}
                  className="text-ink-2 flex items-center gap-1.5 text-[0.6875rem]"
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: `var(--series-${index + 1})` }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </ChartFrame>

        <div className="xl:col-span-3">
          <LiveAlertsPanel />
        </div>
      </section>

      {/* ── Order pipeline + buyers ────────────────────────────────────── */}
      <section aria-label="Order pipeline" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-5"
          title="Order Pipeline"
          subtitle="Inquiry to shipment conversion"
          series={[{ key: "value", label: "Count" }]}
          data={ORDER_FUNNEL.map((stage) => ({
            stage: stage.label,
            value: stage.value,
          }))}
          categoryKey="stage"
          categoryLabel="Stage"
          format={(value) => number(value)}
          footnote="Stages are ordered, so they take a single-hue ordinal ramp rather than eight categorical colours."
        >
          <div className="px-3 py-3">
            <FunnelChart
              stages={ORDER_FUNNEL}
              format={(value) => number(value)}
            />
          </div>
        </ChartFrame>

        <Card className="xl:col-span-7">
          <CardHeader
            title="Top Performing Buyers"
            subtitle="By revenue this fiscal year"
            icon={<Users size={16} />}
            action={
              <Link
                href="/m/crm-marketing/accounts"
                className="text-accent-ink inline-flex items-center gap-1 text-xs font-medium"
              >
                All buyers
                <ArrowUpRight size={12} />
              </Link>
            }
          />
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[38rem] border-collapse text-sm">
              <caption className="sr-only">
                Top performing buyers by revenue, orders, margin and growth
              </caption>
              <thead>
                <tr className="bg-surface-2 border-line border-y">
                  <th scope="col" className="text-ink-3 px-4 py-2 text-left text-[0.6875rem] font-semibold tracking-wide uppercase sm:px-5">
                    Buyer
                  </th>
                  <th scope="col" className="text-ink-3 px-3 py-2 text-left text-[0.6875rem] font-semibold tracking-wide uppercase">
                    Country
                  </th>
                  <th scope="col" className="text-ink-3 px-3 py-2 text-right text-[0.6875rem] font-semibold tracking-wide uppercase">
                    Revenue
                  </th>
                  <th scope="col" className="text-ink-3 px-3 py-2 text-right text-[0.6875rem] font-semibold tracking-wide uppercase">
                    Orders
                  </th>
                  <th scope="col" className="text-ink-3 px-3 py-2 text-right text-[0.6875rem] font-semibold tracking-wide uppercase">
                    Margin
                  </th>
                  <th scope="col" className="text-ink-3 px-4 py-2 text-right text-[0.6875rem] font-semibold tracking-wide uppercase sm:px-5">
                    Growth
                  </th>
                </tr>
              </thead>
              <tbody>
                {TOP_BUYERS.map((buyer) => (
                  <tr
                    key={buyer.name}
                    className="border-line hover:bg-surface-2/60 border-b transition-colors last:border-b-0"
                  >
                    <th scope="row" className="px-4 py-2.5 text-left sm:px-5">
                      <span className="text-ink block text-xs font-medium">
                        {buyer.name}
                      </span>
                      <span className="mt-0.5 block">
                        <Badge
                          tone={
                            buyer.status === "At Risk"
                              ? "warning"
                              : buyer.status === "New"
                                ? "info"
                                : "good"
                          }
                          withIcon
                        >
                          {buyer.status}
                        </Badge>
                      </span>
                    </th>
                    <td className="text-ink-2 px-3 py-2.5 text-xs">{buyer.country}</td>
                    <td className="text-ink tabular px-3 py-2.5 text-right text-xs font-semibold">
                      {compactCurrency(buyer.revenue)}
                    </td>
                    <td className="text-ink-2 tabular px-3 py-2.5 text-right text-xs">
                      {number(buyer.orders)}
                    </td>
                    <td className="text-ink-2 tabular px-3 py-2.5 text-right text-xs">
                      {percent(buyer.margin)}
                    </td>
                    <td className="px-4 py-2.5 text-right sm:px-5">
                      <Delta value={buyer.growth} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* ── Manufacturing ──────────────────────────────────────────────── */}
      <section aria-label="Manufacturing performance" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-4"
          title="Line OEE"
          subtitle="Availability × performance × quality"
          series={[
            { key: "availability", label: "Availability" },
            { key: "performance", label: "Performance" },
            { key: "quality", label: "Quality" },
          ]}
          data={LINE_OEE}
          categoryKey="line"
          categoryLabel="Line"
          format={(value) => percent(value)}
        >
          <div className="flex flex-col items-center gap-3 px-3 pb-3">
            <RadialGauge
              value={85.5}
              label="Plant OEE"
              caption="World-class benchmark: 85%"
              color="var(--series-3)"
              height={170}
            />
            <ul className="w-full">
              {LINE_OEE.map((line) => (
                <li key={line.line} className="flex items-center gap-2 py-1">
                  <span className="text-ink-2 w-24 shrink-0 truncate text-[0.6875rem]">
                    {line.line}
                  </span>
                  <ProgressBar
                    value={line.oee}
                    color={
                      line.oee >= 85
                        ? "var(--status-good)"
                        : line.oee >= 75
                          ? "var(--status-warning)"
                          : "var(--status-critical)"
                    }
                    height={5}
                    className="min-w-0 flex-1"
                    label={`${line.line} OEE`}
                    showValue
                    valueText={percent(line.oee)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-5"
          title="Machine Capacity Utilisation"
          subtitle="Percent of available hours used, by line and weekday"
          series={[{ key: "value", label: "Utilisation" }]}
          data={CAPACITY_HEATMAP.cells.map((cell) => ({
            slot: `${cell.row} · ${cell.column}`,
            value: cell.value,
          }))}
          categoryKey="slot"
          categoryLabel="Line · Day"
          format={(value) => percent(value, 0)}
          hideLegend
        >
          <div className="px-3 pt-1 pb-3">
            <Heatmap
              cells={CAPACITY_HEATMAP.cells}
              rows={CAPACITY_HEATMAP.rows}
              columns={CAPACITY_HEATMAP.columns}
              format={(value) => `${value.toFixed(0)}%`}
            />
          </div>
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-3"
          title="Production Flow"
          subtitle="Pieces cleared per stage"
          series={[{ key: "value", label: "Pieces" }]}
          data={PRODUCTION_STAGES.map((stage) => ({
            stage: stage.label,
            value: stage.value,
          }))}
          categoryKey="stage"
          categoryLabel="Stage"
          format={(value) => compactNumber(value)}
        >
          <div className="px-3 py-3">
            <FunnelChart
              stages={PRODUCTION_STAGES}
              format={(value) => compactNumber(value)}
            />
          </div>
        </ChartFrame>
      </section>

      {/* ── Quality ────────────────────────────────────────────────────── */}
      <section aria-label="Quality performance" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-7"
          title="Quality Trend"
          subtitle="Rejection, rework and first-pass yield — all in percent"
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
            height={260}
            format={(value) => percent(value, 2)}
            tickFormat={(value) => `${value}%`}
            referenceValue={95}
            referenceLabel="FPY target 95%"
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-5"
          title="Defect Pareto"
          subtitle="Top defect drivers this quarter"
          series={[{ key: "value", label: "Occurrences" }]}
          data={DEFECT_PARETO.map((item) => ({
            defect: item.label,
            value: item.value,
          }))}
          categoryKey="defect"
          categoryLabel="Defect"
          format={(value) => number(value)}
          footnote="One measure, nominal categories — every bar takes the same hue. Colouring by value would re-encode bar length."
        >
          <div className="px-3 pt-1 pb-3">
            <RankedBars
              items={DEFECT_PARETO.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              format={(value) => number(value)}
              highlightLabel="Plating Peel-off"
            />
          </div>
        </ChartFrame>
      </section>

      {/* ── Inventory + supply ─────────────────────────────────────────── */}
      <section aria-label="Inventory and supply" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-4"
          title="Inventory Composition"
          subtitle="$12.78M held across stock types"
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
              height={220}
              format={(value) => compactCurrency(value)}
              centerLabel="Inventory Value"
              centerValue="$12.78M"
            />
            <ul className="mt-2 flex flex-col gap-1.5">
              {INVENTORY_MIX.map((item, index) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-ink-2 flex min-w-0 items-center gap-1.5 text-[0.6875rem]">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: `var(--series-${index + 1})` }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  <span className="text-ink tabular shrink-0 text-[0.6875rem] font-semibold">
                    {compactCurrency(item.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Stock Aging"
          subtitle="Value held by age bucket"
          series={[{ key: "value", label: "Value" }]}
          data={INVENTORY_AGING}
          categoryKey="bucket"
          categoryLabel="Age Bucket"
          format={(value) => currency(value)}
          footnote="Age buckets are ordered, so the reader should see the order — but with one series, slot 1 plus the axis order carries it."
        >
          <SeriesBarChart
            data={INVENTORY_AGING}
            categoryKey="bucket"
            series={[{ key: "value", label: "Value" }]}
            height={240}
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Supplier Capability"
          subtitle="Top supplier against the supplier-base average"
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
            height={250}
            format={(value) => `${value}/100`}
          />
        </ChartFrame>
      </section>

      {/* ── Margin scatter + energy + shipment ─────────────────────────── */}
      <section aria-label="Margin, energy and logistics" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <ChartFrame
          className="xl:col-span-5"
          title="Order Value vs Margin"
          subtitle="Each bubble is one order; size is quantity"
          series={ORDER_SCATTER.map((group) => ({
            key: group.label,
            label: group.label,
          }))}
          data={ORDER_SCATTER.flatMap((group) =>
            group.points.slice(0, 8).map((point, index) => ({
              order: `${group.label} #${index + 1}`,
              [group.label]: point.y,
            })),
          )}
          categoryKey="order"
          categoryLabel="Order"
          format={(value) => percent(value)}
          footnote="Scatter is an all-pairs form: any two marks can touch, so it carries a three-series cap rather than the usual eight."
        >
          <ScatterPlot
            groups={ORDER_SCATTER}
            height={280}
            xLabel="Order value (USD)"
            yLabel="Margin %"
            formatX={(value) => compactCurrency(value)}
            formatY={(value) => `${value}%`}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Energy Consumption"
          subtitle="Purchased and self-generated, in kWh equivalent"
          series={[
            { key: "electricity", label: "Grid Electricity" },
            { key: "gas", label: "Natural Gas" },
            { key: "solar", label: "Solar Generation" },
          ]}
          data={ENERGY_TREND}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => `${number(value)} kWh`}
        >
          <TrendAreaChart
            data={ENERGY_TREND}
            categoryKey="month"
            series={[
              { key: "electricity", label: "Grid Electricity" },
              { key: "gas", label: "Natural Gas" },
              { key: "solar", label: "Solar Generation" },
            ]}
            height={250}
            stacked
            format={(value) => `${number(value)} kWh`}
            tickFormat={(value) => compactNumber(value)}
          />
        </ChartFrame>

        <Card className="xl:col-span-3">
          <CardHeader
            title="Shipment Status"
            subtitle="1,536 shipments this quarter"
            icon={<Truck size={16} />}
          />
          <div className="flex flex-col gap-3 px-4 pb-4 sm:px-5">
            {SHIPMENT_STATUS.map((item) => {
              const total = SHIPMENT_STATUS.reduce((sum, s) => sum + s.value, 0);
              const share = (item.value / total) * 100;
              return (
                <div key={item.label}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <Badge tone={item.tone} withIcon>
                      {item.label}
                    </Badge>
                    <span className="text-ink tabular text-xs font-semibold">
                      {number(item.value)}
                    </span>
                  </div>
                  <ProgressBar
                    value={share}
                    color={`var(--status-${item.tone})`}
                    height={5}
                    label={`${item.label} share`}
                    showValue
                    valueText={percent(share)}
                  />
                </div>
              );
            })}
            <div className="border-line mt-1 border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="text-ink-3 text-xs">Workforce present</span>
                <span className="text-ink text-sm font-semibold">
                  {number(WORKFORCE.present)} / {number(WORKFORCE.total)}
                </span>
              </div>
              <ProgressBar
                value={WORKFORCE.attendanceRate}
                color="var(--series-3)"
                height={5}
                className="mt-2"
                label="Attendance rate"
                showValue
                valueText={percent(WORKFORCE.attendanceRate)}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* ── Intelligence + governance ──────────────────────────────────── */}
      <section aria-label="Insights and governance" className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-5">
          <AiInsightsPanel />
        </div>
        <div className="xl:col-span-4">
          <ApprovalsPanel />
        </div>
        <div className="flex flex-col gap-4 xl:col-span-3">
          <SystemStatusPanel />
          <QuickActionsPanel />
        </div>
      </section>

      {/* ── Expense composition ────────────────────────────────────────── */}
      <section aria-label="Cost structure">
        <ChartFrame
          title="Revenue, Profit and Expense by Month"
          subtitle="Bars are revenue and expenses; the line is profit — one shared currency scale"
          series={[
            { key: "revenue", label: "Revenue" },
            { key: "expenses", label: "Expenses" },
            { key: "profit", label: "Profit" },
          ]}
          data={BUSINESS_PERFORMANCE}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => currency(value)}
          aside={
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryStat label="Total Revenue" value={compactCurrency(totalRevenue)} tone={1} />
              <SummaryStat label="Total Expenses" value={compactCurrency(totalExpenses)} tone={2} />
              <SummaryStat label="Net Profit" value={compactCurrency(totalProfit)} tone={3} />
              <SummaryStat
                label="Profit Margin"
                value={percent((totalProfit / totalRevenue) * 100)}
                tone={7}
              />
            </div>
          }
        >
          <ComboBarLineChart
            data={BUSINESS_PERFORMANCE}
            categoryKey="month"
            barSeries={[
              { key: "revenue", label: "Revenue" },
              { key: "expenses", label: "Expenses" },
            ]}
            lineSeries={[{ key: "profit", label: "Profit" }]}
            height={300}
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>
      </section>

      <footer className="text-ink-3 flex flex-wrap items-center justify-between gap-2 pt-2 pb-4 text-[0.6875rem]">
        <span>
          Smart Metal Garments Accessories ERP · AI Powered World Class Enterprise
          Edition
        </span>
        <span className="flex items-center gap-2">
          <Factory size={12} aria-hidden="true" />
          Demo data — no backend connected
        </span>
      </footer>
    </PageShell>
  );
}

function SummaryStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}) {
  return (
    <div className="bg-surface-2 rounded-lg p-3">
      <p className="text-ink-3 text-[0.625rem]">{label}</p>
      <p
        className="mt-1 text-base font-semibold"
        style={{ color: `var(--series-${tone})` }}
      >
        {value}
      </p>
    </div>
  );
}
