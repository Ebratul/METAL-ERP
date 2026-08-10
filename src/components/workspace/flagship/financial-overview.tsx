"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatTile, Delta } from "@/components/ui/stat-tile";
import { ProgressBar } from "@/components/ui/progress";
import { ChartFrame } from "@/components/charts/chart-frame";
import {
  ComboBarLineChart,
  MultiLineChart,
  SeriesBarChart,
} from "@/components/charts/cartesian";
import { DonutChart } from "@/components/charts/radial";
import { RankedBars } from "@/components/charts/specialty";
import {
  AP_AGING,
  AR_AGING,
  CASH_CONVERSION,
  EXPENSE_MIX,
  FINANCIAL_RATIOS,
  MONTHLY_FINANCE,
  PL_SUMMARY,
} from "@/lib/data/flagship";
import { CASH_FLOW_13W } from "@/lib/data/dashboard";
import { compactCurrency, currency, number, percent } from "@/lib/utils/format";
import type { FlagshipProps } from "./types";

export function FinancialOverviewWorkspace({ module, sub }: FlagshipProps) {
  const revenue = PL_SUMMARY.find((row) => row.line === "Revenue")?.value ?? 0;
  const netProfit = PL_SUMMARY.find((row) => row.line === "Net Profit")?.value ?? 0;
  const grossProfit =
    PL_SUMMARY.find((row) => row.line === "Gross Profit")?.value ?? 0;
  const arTotal = AR_AGING.reduce((sum, row) => sum + row.value, 0);
  const apTotal = AP_AGING.reduce((sum, row) => sum + row.value, 0);
  const arOverdue = AR_AGING.slice(1).reduce((sum, row) => sum + row.value, 0);

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title="Financial Overview"
        subtitle="Profit and loss, receivables, payables and working-capital health"
        icon={module.icon}
        tone={module.tone}
        badge={<Badge tone="accent">{sub.kind}</Badge>}
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
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="primary" size="md">
              <FileSpreadsheet size={15} />
              <span className="hidden sm:inline">Close Period</span>
            </Button>
          </>
        }
      />

      <section aria-label="Financial indicators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatTile
            label="Revenue"
            value={compactCurrency(revenue)}
            delta={12.5}
            caption="fiscal year to date"
            tone={1}
          />
          <StatTile
            label="Gross Profit"
            value={compactCurrency(grossProfit)}
            delta={15.8}
            caption={percent((grossProfit / revenue) * 100) + " margin"}
            tone={3}
          />
          <StatTile
            label="Net Profit"
            value={compactCurrency(netProfit)}
            delta={18.7}
            caption={percent((netProfit / revenue) * 100) + " margin"}
            tone={7}
          />
          <StatTile
            label="Receivables"
            value={compactCurrency(arTotal)}
            delta={-3.4}
            invertDelta
            caption={`${compactCurrency(arOverdue)} overdue`}
            tone={4}
          />
          <StatTile
            label="Payables"
            value={compactCurrency(apTotal)}
            delta={5.2}
            caption="due to suppliers"
            tone={2}
          />
        </div>
      </section>

      {/* ── P&L + monthly performance ──────────────────────────────────── */}
      <section
        aria-label="Profit and loss"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <Card className="xl:col-span-5">
          <CardHeader
            title="Profit & Loss Statement"
            subtitle="Fiscal year to date"
          />
          <div className="scroll-thin overflow-x-auto px-4 pb-4 sm:px-5">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Profit and loss statement, fiscal year to date
              </caption>
              <tbody>
                {PL_SUMMARY.map((row) => (
                  <tr
                    key={row.line}
                    className={cn(
                      "border-line border-b last:border-b-0",
                      (row.kind === "subtotal" || row.kind === "total") &&
                        "bg-surface-2",
                    )}
                  >
                    <th
                      scope="row"
                      className={cn(
                        "py-2.5 pr-3 text-left text-xs font-normal",
                        row.kind === "total"
                          ? "text-ink font-bold"
                          : row.kind === "subtotal"
                            ? "text-ink font-semibold"
                            : "text-ink-2",
                        row.kind === "cost" && "pl-3",
                      )}
                    >
                      {row.line}
                    </th>
                    <td
                      className={cn(
                        "tabular py-2.5 text-right text-xs",
                        row.kind === "total"
                          ? "text-ink text-sm font-bold"
                          : row.kind === "subtotal"
                            ? "text-ink font-semibold"
                            : row.value < 0
                              ? "text-down"
                              : "text-ink-2",
                      )}
                    >
                      {row.value < 0
                        ? `(${currency(Math.abs(row.value))})`
                        : currency(row.value)}
                    </td>
                    <td className="tabular text-ink-3 w-16 py-2.5 text-right text-[0.625rem]">
                      {percent((Math.abs(row.value) / revenue) * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <ChartFrame
          className="xl:col-span-7"
          title="Monthly Revenue, Cost and Profit"
          subtitle="Bars are revenue and cost of goods sold; the line is net profit"
          series={[
            { key: "revenue", label: "Revenue" },
            { key: "cogs", label: "Cost of Goods Sold" },
            { key: "netProfit", label: "Net Profit" },
          ]}
          data={MONTHLY_FINANCE}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => currency(value)}
        >
          <ComboBarLineChart
            data={MONTHLY_FINANCE}
            categoryKey="month"
            barSeries={[
              { key: "revenue", label: "Revenue" },
              { key: "cogs", label: "Cost of Goods Sold" },
            ]}
            lineSeries={[{ key: "netProfit", label: "Net Profit" }]}
            height={320}
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>
      </section>

      {/* ── Receivables / payables ─────────────────────────────────────── */}
      <section
        aria-label="Working capital"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-4"
          title="Receivables Aging"
          subtitle="Outstanding buyer invoices by age"
          series={[{ key: "value", label: "Outstanding" }]}
          data={AR_AGING}
          categoryKey="bucket"
          categoryLabel="Age Bucket"
          format={(value) => currency(value)}
          aside={
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Total AR</p>
                <p className="text-ink mt-1 text-base font-semibold">
                  {compactCurrency(arTotal)}
                </p>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Overdue</p>
                <p className="text-warning mt-1 text-base font-semibold">
                  {compactCurrency(arOverdue)}
                </p>
              </div>
            </div>
          }
        >
          <SeriesBarChart
            data={AR_AGING}
            categoryKey="bucket"
            series={[{ key: "value", label: "Outstanding" }]}
            height={230}
            layout="horizontal"
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Payables Aging"
          subtitle="Supplier dues by age"
          series={[{ key: "value", label: "Payable" }]}
          data={AP_AGING}
          categoryKey="bucket"
          categoryLabel="Age Bucket"
          format={(value) => currency(value)}
          aside={
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Total AP</p>
                <p className="text-ink mt-1 text-base font-semibold">
                  {compactCurrency(apTotal)}
                </p>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Net Position</p>
                <p className="text-good mt-1 text-base font-semibold">
                  {compactCurrency(arTotal - apTotal)}
                </p>
              </div>
            </div>
          }
        >
          <SeriesBarChart
            data={AP_AGING}
            categoryKey="bucket"
            series={[{ key: "value", label: "Payable" }]}
            height={230}
            layout="horizontal"
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="Expense Composition"
          subtitle="Where every dollar of cost goes"
          series={EXPENSE_MIX.map((row) => ({ key: row.label, label: row.label }))}
          data={EXPENSE_MIX.map((row) => ({
            category: row.label,
            ...Object.fromEntries(
              EXPENSE_MIX.map((inner) => [
                inner.label,
                inner.label === row.label ? inner.value : 0,
              ]),
            ),
          }))}
          categoryKey="category"
          categoryLabel="Expense Category"
          format={(value) => currency(value)}
          hideLegend
        >
          <div className="px-3 pb-3">
            <DonutChart
              slices={EXPENSE_MIX}
              height={215}
              format={(value) => compactCurrency(value)}
              centerLabel="Total Cost"
              centerValue={compactCurrency(
                EXPENSE_MIX.reduce((sum, row) => sum + row.value, 0),
              )}
            />
            <ul className="mt-2 flex flex-col gap-1.5">
              {EXPENSE_MIX.slice(0, 6).map((row, index) => (
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
                    {compactCurrency(row.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartFrame>
      </section>

      {/* ── Cash + ratios ──────────────────────────────────────────────── */}
      <section
        aria-label="Cash and ratios"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-5"
          title="Cash Conversion Cycle"
          subtitle="Days sales outstanding, days inventory and days payable"
          series={[
            { key: "dso", label: "DSO" },
            { key: "dio", label: "Days Inventory" },
            { key: "dpo", label: "DPO" },
          ]}
          data={CASH_CONVERSION}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => `${value} days`}
        >
          <MultiLineChart
            data={CASH_CONVERSION}
            categoryKey="month"
            series={[
              { key: "dso", label: "DSO" },
              { key: "dio", label: "Days Inventory" },
              { key: "dpo", label: "DPO" },
            ]}
            height={260}
            format={(value) => `${value} days`}
            tickFormat={(value) => `${value}d`}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-4"
          title="13-Week Cash Flow"
          subtitle="Forecast inflow against outflow"
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

        <Card className="xl:col-span-3">
          <CardHeader
            title="Financial Ratios"
            subtitle="Against internal targets"
          />
          <ul className="flex flex-col gap-2.5 px-4 pb-4 sm:px-5">
            {FINANCIAL_RATIOS.map((ratio) => {
              const attainment = (ratio.value / ratio.target) * 100;
              const good =
                ratio.label === "Debt / Equity" || ratio.label === "DSO"
                  ? ratio.value <= ratio.target
                  : ratio.value >= ratio.target;
              return (
                <li key={ratio.label}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="text-ink-2 text-[0.6875rem]">
                      {ratio.label}
                    </span>
                    <span className="flex items-baseline gap-1.5">
                      <span className="text-ink tabular text-xs font-semibold">
                        {ratio.value}
                        {ratio.unit}
                      </span>
                      <span className="text-ink-3 text-[0.625rem]">
                        / {ratio.target}
                        {ratio.unit}
                      </span>
                    </span>
                  </div>
                  <ProgressBar
                    value={Math.min(100, attainment)}
                    color={good ? "var(--status-good)" : "var(--status-warning)"}
                    height={4}
                    label={`${ratio.label} against target`}
                  />
                </li>
              );
            })}
          </ul>
        </Card>
      </section>

      {/* ── Cost drivers ───────────────────────────────────────────────── */}
      <section aria-label="Cost drivers">
        <ChartFrame
          title="Cost Drivers Ranked"
          subtitle="Largest cost categories, with share of total cost"
          series={[{ key: "value", label: "Cost" }]}
          data={EXPENSE_MIX.map((row) => ({
            category: row.label,
            value: row.value,
          }))}
          categoryKey="category"
          categoryLabel="Category"
          format={(value) => currency(value)}
          hideLegend
          aside={
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Material Share</p>
                <p className="text-ink mt-1 text-base font-semibold">
                  {percent(
                    (EXPENSE_MIX[0].value /
                      EXPENSE_MIX.reduce((s, r) => s + r.value, 0)) *
                      100,
                  )}
                </p>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Conversion Cost</p>
                <p className="text-ink mt-1 text-base font-semibold">
                  {compactCurrency(
                    EXPENSE_MIX[1].value + EXPENSE_MIX[2].value + EXPENSE_MIX[3].value,
                  )}
                </p>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Cost per 1000 pcs</p>
                <p className="text-ink mt-1 text-base font-semibold">$96.40</p>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">YoY Cost Change</p>
                <p className="mt-1">
                  <Delta value={-4.2} invert />
                </p>
              </div>
            </div>
          }
        >
          <div className="px-3 pt-1 pb-3">
            <RankedBars
              items={EXPENSE_MIX.map((row) => ({
                label: row.label,
                value: row.value,
                caption: percent(
                  (row.value / EXPENSE_MIX.reduce((s, r) => s + r.value, 0)) * 100,
                ),
              }))}
              format={(value) => compactCurrency(value)}
              highlightLabel="Raw Material"
            />
          </div>
        </ChartFrame>
      </section>

      <p className="text-ink-3 pb-4 text-[0.6875rem]">
        Figures shown are demo data. {number(MONTHLY_FINANCE.length)} months of
        movement, no backend connected.
      </p>
    </PageShell>
  );
}
