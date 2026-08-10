"use client";

import { useMemo, useState } from "react";
import { Download, Plus, TriangleAlert } from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, LivePill, type StatusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/stat-tile";
import { ProgressBar } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/feedback";
import { DataTable, type Column } from "@/components/ui/data-table";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ComboBarLineChart, SeriesBarChart } from "@/components/charts/cartesian";
import { DonutChart, RadialGauge } from "@/components/charts/radial";
import { RankedBars } from "@/components/charts/specialty";
import {
  BACKLOG_AGING,
  ORDER_BOOK_TREND,
  ORDER_STATUS_MIX,
  SALES_ORDERS,
  type OrderStatus,
  type SalesOrder,
} from "@/lib/data/flagship";
import {
  compactCurrency,
  compactNumber,
  currency,
  number,
  percent,
  shortDate,
} from "@/lib/utils/format";
import type { FlagshipProps } from "./types";

const STATUS_TONE: Record<OrderStatus, StatusTone> = {
  Confirmed: "info",
  "In Production": "info",
  Plating: "accent",
  Packing: "accent",
  "Ready to Ship": "good",
  Shipped: "good",
  "On Hold": "critical",
};

const FILTERS = [
  { value: "all" as const, label: "All" },
  { value: "open" as const, label: "Open" },
  { value: "risk" as const, label: "At Risk" },
  { value: "shipped" as const, label: "Shipped" },
];

export function OrderBookWorkspace({ module, sub }: FlagshipProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("all");

  const rows = useMemo(() => {
    switch (filter) {
      case "open":
        return SALES_ORDERS.filter((order) => order.status !== "Shipped");
      case "risk":
        return SALES_ORDERS.filter((order) => order.atRisk);
      case "shipped":
        return SALES_ORDERS.filter((order) => order.status === "Shipped");
      default:
        return SALES_ORDERS;
    }
  }, [filter]);

  const totalValue = SALES_ORDERS.reduce((sum, order) => sum + order.value, 0);
  const openValue = SALES_ORDERS.filter((o) => o.status !== "Shipped").reduce(
    (sum, order) => sum + order.value,
    0,
  );
  const atRisk = SALES_ORDERS.filter((order) => order.atRisk);
  const shipped = SALES_ORDERS.filter((order) => order.status === "Shipped").length;
  const otif = (shipped / SALES_ORDERS.length) * 100;

  const byBuyer = Object.entries(
    SALES_ORDERS.reduce<Record<string, number>>((acc, order) => {
      acc[order.buyer] = (acc[order.buyer] ?? 0) + order.value;
      return acc;
    }, {}),
  )
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);

  const columns: Column<SalesOrder>[] = [
    {
      key: "orderNo",
      header: "Order No.",
      width: "w-28",
      render: (row) => (
        <span className="flex items-center gap-1.5">
          <span className="text-ink font-semibold">{row.orderNo}</span>
          {row.atRisk ? (
            <TriangleAlert
              size={12}
              className="text-critical shrink-0"
              aria-label="At risk"
            />
          ) : null}
        </span>
      ),
    },
    {
      key: "buyer",
      header: "Buyer",
      render: (row) => (
        <span className="flex items-center gap-2">
          <Avatar name={row.buyer} size={22} />
          <span className="min-w-0">
            <span className="text-ink block max-w-[11rem] truncate text-xs font-medium">
              {row.buyer}
            </span>
            <span className="text-ink-3 block text-[0.625rem]">{row.country}</span>
          </span>
        </span>
      ),
    },
    {
      key: "product",
      header: "Product / Style",
      hideOnMobile: true,
      render: (row) => (
        <span className="min-w-0">
          <span className="block max-w-[13rem] truncate">{row.product}</span>
          <span className="text-ink-3 block text-[0.625rem]">{row.style}</span>
        </span>
      ),
    },
    {
      key: "quantity",
      header: "Qty (pcs)",
      align: "right",
      render: (row) => number(row.quantity),
    },
    {
      key: "unitPrice",
      header: "Unit $",
      align: "right",
      hideOnMobile: true,
      render: (row) => `$${row.unitPrice.toFixed(3)}`,
    },
    {
      key: "value",
      header: "Order Value",
      align: "right",
      render: (row) => (
        <span className="text-ink font-semibold">{compactCurrency(row.value)}</span>
      ),
    },
    {
      key: "progress",
      header: "Progress",
      width: "w-32",
      hideOnMobile: true,
      render: (row) => (
        <ProgressBar
          value={row.progress}
          height={5}
          color={
            row.progress === 100
              ? "var(--status-good)"
              : row.atRisk
                ? "var(--status-critical)"
                : "var(--series-1)"
          }
          label={`${row.orderNo} progress`}
          showValue
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge tone={STATUS_TONE[row.status]}>{row.status}</Badge>,
    },
    {
      key: "shipDate",
      header: "Ship Date",
      align: "right",
      hideOnMobile: true,
      accessor: (row) => row.daysToShip,
      render: (row) => (
        <span className="min-w-0">
          <span className="block">{shortDate(row.shipDate)}</span>
          <span
            className={`block text-[0.625rem] ${
              row.daysToShip < 0
                ? "text-critical"
                : row.daysToShip < 8
                  ? "text-warning"
                  : "text-ink-3"
            }`}
          >
            {row.daysToShip < 0
              ? `${Math.abs(row.daysToShip)}d overdue`
              : `in ${row.daysToShip}d`}
          </span>
        </span>
      ),
    },
    {
      key: "merchandiser",
      header: "Merchandiser",
      hideOnMobile: true,
    },
  ];

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title="Order Book"
        subtitle="Every live sales order with production progress and delivery commitment"
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
              ariaLabel="Order filter"
              size="md"
            />
            <Button variant="secondary" size="md">
              <Download size={15} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="primary" size="md">
              <Plus size={15} />
              <span className="hidden sm:inline">New Order</span>
            </Button>
          </>
        }
      />

      <section aria-label="Order book indicators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatTile
            label="Order Book Value"
            value={compactCurrency(totalValue)}
            delta={11.4}
            caption={`${SALES_ORDERS.length} orders`}
            tone={1}
          />
          <StatTile
            label="Open Value"
            value={compactCurrency(openValue)}
            delta={6.2}
            caption="not yet shipped"
            tone={7}
          />
          <StatTile
            label="Orders at Risk"
            value={number(atRisk.length)}
            delta={-8.4}
            invertDelta
            caption="late or on hold"
            tone={8}
          />
          <StatTile
            label="Shipped Orders"
            value={number(shipped)}
            delta={9.1}
            caption="this fiscal year"
            tone={3}
          />
          <StatTile
            label="Avg Order Value"
            value={compactCurrency(totalValue / SALES_ORDERS.length)}
            delta={4.8}
            caption="per confirmed order"
            tone={5}
          />
        </div>
      </section>

      <section
        aria-label="Order book analytics"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-7"
          title="Booked vs Shipped"
          subtitle="Monthly order intake against shipped value, with carried backlog"
          series={[
            { key: "booked", label: "Booked" },
            { key: "shipped", label: "Shipped" },
            { key: "backlog", label: "Backlog" },
          ]}
          data={ORDER_BOOK_TREND}
          categoryKey="month"
          categoryLabel="Month"
          format={(value) => currency(value)}
        >
          <ComboBarLineChart
            data={ORDER_BOOK_TREND}
            categoryKey="month"
            barSeries={[
              { key: "booked", label: "Booked" },
              { key: "shipped", label: "Shipped" },
            ]}
            lineSeries={[{ key: "backlog", label: "Backlog" }]}
            height={300}
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>

        <ChartFrame
          className="xl:col-span-5"
          title="Backlog Aging"
          subtitle="Open order value by how long it has been due"
          series={[{ key: "value", label: "Value" }]}
          data={BACKLOG_AGING}
          categoryKey="bucket"
          categoryLabel="Age Bucket"
          format={(value) => currency(value)}
          aside={
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Total Backlog</p>
                <p className="text-ink mt-1 text-base font-semibold">
                  {compactCurrency(
                    BACKLOG_AGING.reduce((sum, row) => sum + row.value, 0),
                  )}
                </p>
              </div>
              <div className="bg-surface-2 rounded-lg p-3">
                <p className="text-ink-3 text-[0.625rem]">Overdue Value</p>
                <p className="text-critical mt-1 text-base font-semibold">
                  {compactCurrency(
                    BACKLOG_AGING.slice(1).reduce((sum, row) => sum + row.value, 0),
                  )}
                </p>
              </div>
            </div>
          }
        >
          <SeriesBarChart
            data={BACKLOG_AGING}
            categoryKey="bucket"
            series={[{ key: "value", label: "Value" }]}
            height={240}
            format={(value) => currency(value)}
            tickFormat={(value) => compactCurrency(value)}
          />
        </ChartFrame>
      </section>

      <section
        aria-label="Order distribution"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-4"
          title="Order Status Mix"
          subtitle="Where the order book sits right now"
          series={ORDER_STATUS_MIX.map((item) => ({
            key: item.label,
            label: item.label,
          }))}
          data={ORDER_STATUS_MIX.map((item) => ({
            status: item.label,
            ...Object.fromEntries(
              ORDER_STATUS_MIX.map((inner) => [
                inner.label,
                inner.label === item.label ? inner.value : 0,
              ]),
            ),
          }))}
          categoryKey="status"
          categoryLabel="Status"
          format={(value) => number(value)}
          hideLegend
        >
          <div className="px-3 pb-3">
            <DonutChart
              slices={ORDER_STATUS_MIX}
              height={220}
              format={(value) => `${value} orders`}
              centerLabel="Total Orders"
              centerValue={number(SALES_ORDERS.length)}
            />
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
              {ORDER_STATUS_MIX.slice(0, 6).map((item, index) => (
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

        <ChartFrame
          className="xl:col-span-5"
          title="Buyer Concentration"
          subtitle="Order value by buyer — top buyer share is a risk metric"
          series={[{ key: "value", label: "Order Value" }]}
          data={byBuyer.map((row) => ({ buyer: row.label, value: row.value }))}
          categoryKey="buyer"
          categoryLabel="Buyer"
          format={(value) => currency(value)}
        >
          <div className="px-3 pt-1 pb-3">
            <RankedBars
              items={byBuyer.map((row) => ({
                label: row.label,
                value: row.value,
                caption: percent((row.value / totalValue) * 100),
              }))}
              format={(value) => compactCurrency(value)}
              highlightLabel={byBuyer[0]?.label}
            />
          </div>
        </ChartFrame>

        <Card className="xl:col-span-3">
          <CardHeader
            title="Delivery Performance"
            subtitle="On-time in-full against the 95% commitment"
          />
          <div className="px-4 pb-4 sm:px-5">
            <RadialGauge
              value={otif}
              label="OTIF"
              caption="Target 95%"
              color={otif >= 95 ? "var(--status-good)" : "var(--status-warning)"}
              height={180}
            />
            <ul className="mt-2 flex flex-col gap-2">
              {[
                { label: "Shipped on time", value: shipped, tone: "good" as const },
                { label: "Currently at risk", value: atRisk.length, tone: "critical" as const },
                {
                  label: "Due within 7 days",
                  value: SALES_ORDERS.filter(
                    (o) => o.daysToShip >= 0 && o.daysToShip <= 7,
                  ).length,
                  tone: "warning" as const,
                },
              ].map((item) => (
                <li
                  key={item.label}
                  className="flex items-center justify-between gap-2"
                >
                  <Badge tone={item.tone} withIcon>
                    {item.label}
                  </Badge>
                  <span className="text-ink tabular text-sm font-semibold">
                    {number(item.value)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </section>

      <section aria-label="Order records">
        <Card>
          <DataTable
            caption="Sales order book"
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            pageSize={12}
            searchPlaceholder="Search order, buyer, product, style…"
            footer={
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <p className="text-ink-3 text-[0.625rem]">Orders shown</p>
                  <p className="text-ink tabular mt-0.5 text-sm font-semibold">
                    {number(rows.length)}
                  </p>
                </div>
                <div>
                  <p className="text-ink-3 text-[0.625rem]">Total quantity</p>
                  <p className="text-ink tabular mt-0.5 text-sm font-semibold">
                    {compactNumber(rows.reduce((s, r) => s + r.quantity, 0))} pcs
                  </p>
                </div>
                <div>
                  <p className="text-ink-3 text-[0.625rem]">Total value</p>
                  <p className="text-good tabular mt-0.5 text-sm font-semibold">
                    {compactCurrency(rows.reduce((s, r) => s + r.value, 0))}
                  </p>
                </div>
                <div>
                  <p className="text-ink-3 text-[0.625rem]">At risk</p>
                  <p className="text-critical tabular mt-0.5 text-sm font-semibold">
                    {number(rows.filter((r) => r.atRisk).length)}
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
