"use client";

import { useState } from "react";
import { Activity, Gauge, RefreshCw, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PageHeader, PageShell } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge, LivePill, type StatusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatTile } from "@/components/ui/stat-tile";
import { ProgressBar } from "@/components/ui/progress";
import { Segmented } from "@/components/ui/tabs";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ComboBarLineChart, SeriesBarChart } from "@/components/charts/cartesian";
import { RadialGauge } from "@/components/charts/radial";
import { RankedBars } from "@/components/charts/specialty";
import {
  ANDON_EVENTS,
  DOWNTIME_REASONS,
  HOURLY_OUTPUT,
  MACHINES,
  SHIFT_COMPARISON,
  type MachineState,
} from "@/lib/data/flagship";
import { compactNumber, number, percent } from "@/lib/utils/format";
import type { FlagshipProps } from "./types";

const STATE_TONE: Record<MachineState, StatusTone> = {
  Running: "good",
  Idle: "neutral",
  Setup: "info",
  Breakdown: "critical",
  Maintenance: "warning",
};

const STATE_DOT: Record<MachineState, string> = {
  Running: "bg-good",
  Idle: "bg-neutral",
  Setup: "bg-info",
  Breakdown: "bg-critical",
  Maintenance: "bg-warning",
};

const CELL_FILTERS = [
  { value: "all" as const, label: "All cells" },
  { value: "Stamping" as const, label: "Stamping" },
  { value: "Plating" as const, label: "Plating" },
  { value: "Assembly" as const, label: "Assembly" },
];

export function ShopFloorWorkspace({ module, sub }: FlagshipProps) {
  const [cell, setCell] = useState<(typeof CELL_FILTERS)[number]["value"]>("all");

  const machines =
    cell === "all" ? MACHINES : MACHINES.filter((machine) => machine.cell === cell);

  const running = MACHINES.filter((m) => m.state === "Running").length;
  const down = MACHINES.filter((m) => m.state === "Breakdown").length;
  const plantOee =
    MACHINES.reduce((sum, m) => sum + m.oee, 0) / MACHINES.length;
  const totalOutput = MACHINES.reduce((sum, m) => sum + m.output, 0);
  const totalTarget = MACHINES.reduce((sum, m) => sum + m.target, 0);

  const stateCounts = (
    ["Running", "Idle", "Setup", "Breakdown", "Maintenance"] as MachineState[]
  ).map((state) => ({
    state,
    count: MACHINES.filter((m) => m.state === state).length,
  }));

  return (
    <PageShell className="flex flex-col gap-5">
      <PageHeader
        title="Shop Floor Control"
        subtitle="Live machine state, output against plan and downtime as it happens"
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
              options={CELL_FILTERS}
              value={cell}
              onChange={setCell}
              ariaLabel="Production cell"
              size="md"
            />
            <Button variant="secondary" size="md">
              <RefreshCw size={15} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </>
        }
      />

      <section aria-label="Shop floor indicators">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <StatTile
            label="Machines Running"
            value={`${running} / ${MACHINES.length}`}
            delta={4.2}
            caption="live state"
            tone={3}
            icon={<Activity size={17} />}
          />
          <StatTile
            label="Plant OEE"
            value={percent(plantOee)}
            delta={2.8}
            caption="world class ≥ 85%"
            tone={1}
            icon={<Gauge size={17} />}
          />
          <StatTile
            label="Output Today"
            value={`${compactNumber(totalOutput)} pcs`}
            delta={6.4}
            caption={`plan ${compactNumber(totalTarget)}`}
            tone={7}
          />
          <StatTile
            label="Machines Down"
            value={number(down)}
            delta={-12.5}
            invertDelta
            caption="breakdown state"
            tone={8}
          />
          <StatTile
            label="Plan Attainment"
            value={percent((totalOutput / totalTarget) * 100)}
            delta={3.1}
            caption="output vs target"
            tone={5}
            icon={<Thermometer size={17} />}
          />
        </div>
      </section>

      {/* ── Machine grid ───────────────────────────────────────────────── */}
      <section aria-label="Machine status">
        <Card>
          <CardHeader
            title="Machine Status"
            subtitle={`${machines.length} machines${cell === "all" ? "" : ` in ${cell}`}`}
            action={
              <div className="flex flex-wrap items-center gap-3">
                {stateCounts.map((item) => (
                  <span
                    key={item.state}
                    className="text-ink-2 inline-flex items-center gap-1.5 text-[0.6875rem]"
                  >
                    <span
                      className={cn("size-2 rounded-full", STATE_DOT[item.state])}
                      aria-hidden="true"
                    />
                    {item.state} ({item.count})
                  </span>
                ))}
              </div>
            }
          />
          <ul className="grid grid-cols-1 gap-2.5 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:px-5">
            {machines.map((machine) => (
              <li
                key={machine.id}
                className="bg-surface-2 border-line rounded-lg border p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-ink text-sm font-semibold">{machine.name}</p>
                    <p className="text-ink-3 text-[0.625rem]">
                      {machine.cell} · {machine.job}
                    </p>
                  </div>
                  <Badge tone={STATE_TONE[machine.state]} withIcon>
                    {machine.state}
                  </Badge>
                </div>

                <div className="mt-2.5">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-ink-3 text-[0.625rem]">Output vs target</span>
                    <span className="text-ink tabular text-[0.6875rem] font-semibold">
                      {compactNumber(machine.output)} / {compactNumber(machine.target)}
                    </span>
                  </div>
                  <ProgressBar
                    value={(machine.output / machine.target) * 100}
                    height={5}
                    color={
                      machine.state === "Breakdown"
                        ? "var(--status-critical)"
                        : machine.output / machine.target > 0.9
                          ? "var(--status-good)"
                          : "var(--series-1)"
                    }
                    label={`${machine.name} output`}
                  />
                </div>

                <dl className="border-line mt-2.5 grid grid-cols-3 gap-1 border-t pt-2.5">
                  <div>
                    <dt className="text-ink-3 text-[0.5625rem]">OEE</dt>
                    <dd className="text-ink tabular text-[0.6875rem] font-semibold">
                      {percent(machine.oee)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-3 text-[0.5625rem]">Cycle</dt>
                    <dd
                      className={cn(
                        "tabular text-[0.6875rem] font-semibold",
                        machine.cycleTime > machine.standardCycle
                          ? "text-warning"
                          : "text-ink",
                      )}
                    >
                      {machine.cycleTime}s
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-3 text-[0.5625rem]">Temp</dt>
                    <dd className="text-ink tabular text-[0.6875rem] font-semibold">
                      {machine.temperature}°C
                    </dd>
                  </div>
                </dl>

                <p className="text-ink-3 mt-2 truncate text-[0.625rem]">
                  Operator: {machine.operator}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* ── Charts ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Production analytics"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-7"
          title="Hourly Output vs Plan"
          subtitle="Pieces produced each hour of the current shift, with rejections"
          series={[
            { key: "plan", label: "Plan" },
            { key: "actual", label: "Actual" },
            { key: "rejected", label: "Rejected" },
          ]}
          data={HOURLY_OUTPUT}
          categoryKey="hour"
          categoryLabel="Hour"
          format={(value) => `${number(value)} pcs`}
        >
          <ComboBarLineChart
            data={HOURLY_OUTPUT}
            categoryKey="hour"
            barSeries={[
              { key: "plan", label: "Plan" },
              { key: "actual", label: "Actual" },
            ]}
            lineSeries={[{ key: "rejected", label: "Rejected" }]}
            height={300}
            format={(value) => `${number(value)} pcs`}
            tickFormat={(value) => compactNumber(value)}
          />
        </ChartFrame>

        <div className="flex flex-col gap-4 xl:col-span-5">
          <ChartFrame
            title="Downtime Pareto"
            subtitle="Minutes lost by reason this week"
            series={[{ key: "value", label: "Minutes" }]}
            data={DOWNTIME_REASONS.map((row) => ({
              reason: row.label,
              value: row.value,
            }))}
            categoryKey="reason"
            categoryLabel="Reason"
            format={(value) => `${number(value)} min`}
            hideLegend
          >
            <div className="px-3 pt-1 pb-3">
              <RankedBars
                items={DOWNTIME_REASONS}
                format={(value) => `${number(value)} min`}
                highlightLabel="Die Change / Setup"
              />
            </div>
          </ChartFrame>

          <Card>
            <CardHeader
              title="Andon Board"
              subtitle="Live escalations from the floor"
              action={<LivePill />}
            />
            <ul className="flex flex-col">
              {ANDON_EVENTS.map((event) => (
                <li
                  key={event.id}
                  className="border-line flex items-start gap-3 border-t px-4 py-2.5 sm:px-5"
                >
                  <Badge tone={event.tone} withIcon>
                    {event.line}
                  </Badge>
                  <span className="text-ink-2 min-w-0 flex-1 truncate text-xs">
                    {event.message}
                  </span>
                  <span className="text-ink-3 shrink-0 text-[0.625rem]">
                    {event.age}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <section
        aria-label="Shift performance"
        className="grid grid-cols-1 gap-4 xl:grid-cols-12"
      >
        <ChartFrame
          className="xl:col-span-8"
          title="Shift Comparison"
          subtitle="Output by shift — efficiency and rejection are shown as their own measures"
          series={[{ key: "output", label: "Output (pcs)" }]}
          data={SHIFT_COMPARISON}
          categoryKey="shift"
          categoryLabel="Shift"
          format={(value) => `${number(value)} pcs`}
          footnote="Output, efficiency and rejection have different units, so only output is plotted — the others sit in the table view and the tiles."
        >
          <SeriesBarChart
            data={SHIFT_COMPARISON}
            categoryKey="shift"
            series={[{ key: "output", label: "Output (pcs)" }]}
            height={240}
            layout="horizontal"
            format={(value) => `${number(value)} pcs`}
            tickFormat={(value) => compactNumber(value)}
          />
        </ChartFrame>

        <Card className="xl:col-span-4">
          <CardHeader title="Shift Efficiency" subtitle="Earned hours against clocked hours" />
          <div className="flex flex-col gap-3 px-4 pb-4 sm:px-5">
            {SHIFT_COMPARISON.map((shift, index) => (
              <div key={shift.shift}>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="text-ink-2 text-xs">{shift.shift}</span>
                  <span className="text-ink tabular text-xs font-semibold">
                    {percent(shift.efficiency)}
                  </span>
                </div>
                <ProgressBar
                  value={shift.efficiency}
                  color={`var(--series-${index + 1})`}
                  height={6}
                  label={`${shift.shift} efficiency`}
                />
                <p className="text-ink-3 mt-1 text-[0.625rem]">
                  Rejection {percent(shift.rejection)} · Output{" "}
                  {compactNumber(shift.output)} pcs
                </p>
              </div>
            ))}
            <div className="border-line mt-1 border-t pt-3">
              <RadialGauge
                value={plantOee}
                label="Plant OEE"
                caption="Availability × performance × quality"
                color="var(--series-3)"
                height={160}
              />
            </div>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
