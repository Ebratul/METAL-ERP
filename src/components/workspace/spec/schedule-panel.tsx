"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CalendarClock } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/feedback";
import { DEMO_TODAY, hashSeed } from "@/lib/data/rng";
import { dayMonth, shortDate } from "@/lib/utils/format";
import { TONE_COLOR, compactValue, statusTone } from "@/lib/workspaces/dsl";
import type { RecordRow, ResolvedSpec } from "@/lib/workspaces/types";

const RANGE_OPTIONS = [
  { value: "all" as const, label: "All" },
  { value: "upcoming" as const, label: "Upcoming" },
  { value: "overdue" as const, label: "Overdue" },
];

type Range = (typeof RANGE_OPTIONS)[number]["value"];

const DAY_MS = 86_400_000;

function toTime(iso: string): number {
  const time = new Date(`${iso}T00:00:00Z`).getTime();
  return Number.isFinite(time) ? time : DEMO_TODAY.getTime();
}

/** Stable activity duration per record — the same row always draws the same bar. */
function durationDays(row: RecordRow): number {
  return 3 + (hashSeed(row.id) % 12);
}

export function SchedulePanel({
  spec,
  rows,
  onView,
}: {
  spec: ResolvedSpec;
  rows: RecordRow[];
  onView: (row: RecordRow) => void;
}) {
  const [range, setRange] = useState<Range>("all");
  const dateKey = spec.dateField?.key ?? "docDate";
  const today = DEMO_TODAY.getTime();

  const scoped = useMemo(() => {
    const sorted = [...rows].sort(
      (a, b) => toTime(String(a[dateKey])) - toTime(String(b[dateKey])),
    );
    if (range === "upcoming") {
      return sorted.filter((row) => toTime(String(row[dateKey])) >= today);
    }
    if (range === "overdue") {
      return sorted.filter(
        (row) =>
          toTime(String(row[dateKey])) < today &&
          statusTone(
            String(row[spec.statusField.key]),
            spec.statuses.indexOf(String(row[spec.statusField.key])),
          ) !== "good",
      );
    }
    return sorted;
  }, [rows, dateKey, range, today, spec.statusField.key, spec.statuses]);

  const bars = scoped.slice(0, 16);

  const window = useMemo(() => {
    if (bars.length === 0) return { start: today, span: 30 * DAY_MS };
    const starts = bars.map((row) => toTime(String(row[dateKey])));
    const ends = bars.map(
      (row) => toTime(String(row[dateKey])) + durationDays(row) * DAY_MS,
    );
    const start = Math.min(...starts);
    const end = Math.max(...ends);
    return { start, span: Math.max(DAY_MS * 7, end - start) };
  }, [bars, dateKey, today]);

  const ticks = Array.from({ length: 5 }, (_, index) => {
    const time = window.start + (window.span / 4) * index;
    return new Date(time).toISOString().slice(0, 10);
  });

  const todayOffset = ((today - window.start) / window.span) * 100;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-8">
        <CardHeader
          title={`${spec.entity} Schedule`}
          subtitle="Planned window per record, with today marked on the axis"
          icon={<CalendarDays size={16} />}
          action={
            <Segmented
              options={RANGE_OPTIONS}
              value={range}
              onChange={setRange}
              ariaLabel="Schedule range"
            />
          }
        />

        {bars.length === 0 ? (
          <EmptyState
            title="Nothing scheduled in this range"
            description="Switch the range or add a record to populate the timeline."
          />
        ) : (
          <div className="scroll-thin overflow-x-auto px-4 pb-4 sm:px-5">
            <div className="min-w-[38rem]">
              <div className="text-ink-3 mb-2 flex justify-between text-[0.625rem]">
                {ticks.map((tick) => (
                  <span key={tick}>{dayMonth(tick)}</span>
                ))}
              </div>

              <ul className="flex flex-col gap-1.5">
                {bars.map((row) => {
                  const status = String(row[spec.statusField.key]);
                  const tone = statusTone(status, spec.statuses.indexOf(status));
                  const start = toTime(String(row[dateKey]));
                  const left = ((start - window.start) / window.span) * 100;
                  const width = Math.max(
                    4,
                    ((durationDays(row) * DAY_MS) / window.span) * 100,
                  );

                  return (
                    <li key={row.id} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onView(row)}
                        className="text-ink-2 hover:text-ink w-36 shrink-0 truncate text-left text-xs transition-colors"
                      >
                        {String(row[spec.codeField.key])}
                      </button>
                      <div className="relative h-7 min-w-0 flex-1">
                        <span
                          className="absolute inset-y-0 w-px"
                          style={{
                            left: `${Math.min(100, Math.max(0, todayOffset))}%`,
                            backgroundColor: "var(--chart-axis)",
                          }}
                          aria-hidden="true"
                        />
                        <div
                          className="absolute inset-y-0 flex items-center overflow-hidden rounded-md px-2"
                          style={{
                            left: `${Math.max(0, Math.min(96, left))}%`,
                            width: `${width}%`,
                            backgroundColor: `color-mix(in oklab, ${TONE_COLOR[tone]} 26%, transparent)`,
                            borderLeft: `3px solid ${TONE_COLOR[tone]}`,
                          }}
                        >
                          <span className="text-ink-2 truncate text-[0.625rem]">
                            {spec.primaryTextField
                              ? String(row[spec.primaryTextField.key])
                              : status}
                          </span>
                        </div>
                      </div>
                      <span className="hidden w-24 shrink-0 text-right sm:block">
                        <Badge tone={tone}>{status}</Badge>
                      </span>
                    </li>
                  );
                })}
              </ul>

              {scoped.length > bars.length ? (
                <p className="text-ink-3 mt-3 text-[0.6875rem]">
                  Showing the first {bars.length} of {scoped.length} records in this
                  range.
                </p>
              ) : null}
            </div>
          </div>
        )}
      </Card>

      <Card className="xl:col-span-4">
        <CardHeader
          title="Agenda"
          subtitle="Nearest dates first"
          icon={<CalendarClock size={16} />}
        />
        <ul className="flex flex-col">
          {scoped.slice(0, 9).map((row) => {
            const status = String(row[spec.statusField.key]);
            const tone = statusTone(status, spec.statuses.indexOf(status));
            const overdue = toTime(String(row[dateKey])) < today && tone !== "good";

            return (
              <li key={row.id} className="border-line border-t first:border-t-0">
                <button
                  type="button"
                  onClick={() => onView(row)}
                  className="hover:bg-surface-2/60 flex w-full items-start gap-3 px-4 py-3 text-left transition-colors sm:px-5"
                >
                  <span
                    className="mt-1 size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: TONE_COLOR[tone] }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="text-ink block truncate text-xs font-medium">
                      {spec.primaryTextField
                        ? String(row[spec.primaryTextField.key])
                        : String(row[spec.codeField.key])}
                    </span>
                    <span className="text-ink-3 mt-0.5 block text-[0.6875rem]">
                      {String(row[spec.codeField.key])} ·{" "}
                      {shortDate(String(row[dateKey]))}
                      {overdue ? " · overdue" : ""}
                    </span>
                  </span>
                  {spec.measure ? (
                    <span className="text-ink tabular shrink-0 text-[0.6875rem] font-semibold">
                      {compactValue(spec.measure, row[spec.measure.key])}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
          {scoped.length === 0 ? (
            <li className="text-ink-3 px-5 py-8 text-center text-xs">
              No records in this range.
            </li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
