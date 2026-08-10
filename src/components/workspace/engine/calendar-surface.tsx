"use client";

import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/feedback";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import { shortDate } from "@/lib/utils/format";
import { DEMO_TODAY, WEEKDAYS } from "@/lib/data/rng";
import type { Dataset } from "@/lib/data/dataset-types";
import { blankRow, type Row } from "@/lib/data/collection";
import { StatusBadge, statusTone } from "./cells";
import { RecordForm } from "./record-form";
import { RecordDetail } from "./record-detail";
import type { Collection } from "./use-collection";

const TONE_DOT: Record<string, string> = {
  good: "bg-good",
  warning: "bg-warning",
  serious: "bg-serious",
  critical: "bg-critical",
  info: "bg-info",
  accent: "bg-accent",
  neutral: "bg-neutral",
};

const MONTH_LABEL = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * A month calendar over the collection's date field. Days carry the records
 * scheduled on them; picking a day filters the agenda beneath the grid.
 */
export function CalendarSurface({
  dataset,
  collection,
}: {
  dataset: Dataset;
  collection: Collection;
}) {
  const toast = useToast();
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [formDate, setFormDate] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [detailRow, setDetailRow] = useState<Row | null>(null);

  const dateKey = dataset.dateKey ?? "date";
  const primary = dataset.fields.find((field) => field.primary);
  const dateField = dataset.fields.find((field) => field.key === dateKey);

  const cursor = useMemo(() => {
    const base = new Date(DEMO_TODAY);
    return new Date(
      Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + monthOffset, 1),
    );
  }, [monthOffset]);

  const year = cursor.getUTCFullYear();
  const month = cursor.getUTCMonth();
  const leading = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const dayCount = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const byDate = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const row of collection.filtered) {
      const iso = String(row[dateKey] ?? "").slice(0, 10);
      if (iso.length !== 10) continue;
      const bucket = map.get(iso) ?? [];
      bucket.push(row);
      map.set(iso, bucket);
    }
    return map;
  }, [collection.filtered, dateKey]);

  const todayIso = DEMO_TODAY.toISOString().slice(0, 10);
  const agendaRows = selectedDay
    ? (byDate.get(selectedDay) ?? [])
    : collection.filtered
        .filter((row) => String(row[dateKey] ?? "") >= todayIso)
        .sort((a, b) => String(a[dateKey]).localeCompare(String(b[dateKey])))
        .slice(0, 12);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader
            title={MONTH_LABEL.format(cursor)}
            subtitle={`${dataset.plural} by ${dateField?.label.toLowerCase() ?? "date"}`}
            icon={<CalendarDays size={16} />}
            action={
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  aria-label="Previous month"
                  onClick={() => setMonthOffset((value) => value - 1)}
                >
                  <ChevronLeft size={15} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setMonthOffset(0);
                    setSelectedDay(null);
                  }}
                >
                  Today
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  aria-label="Next month"
                  onClick={() => setMonthOffset((value) => value + 1)}
                >
                  <ChevronRight size={15} />
                </Button>
              </div>
            }
          />

          <div className="px-4 pb-4 sm:px-5">
            <div className="mb-1 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((day) => (
                <span
                  key={day}
                  className="text-ink-3 py-1 text-center text-[0.625rem] font-semibold tracking-wide uppercase"
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: leading }, (_, index) => (
                <span key={`pad-${index}`} className="h-16 rounded-lg" />
              ))}

              {Array.from({ length: dayCount }, (_, index) => {
                const day = index + 1;
                const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
                const rows = byDate.get(iso) ?? [];
                const isToday = iso === todayIso;
                const isSelected = iso === selectedDay;

                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedDay(isSelected ? null : iso)}
                    aria-pressed={isSelected}
                    aria-label={`${shortDate(iso)} — ${rows.length} ${dataset.plural.toLowerCase()}`}
                    className={cn(
                      "flex h-16 flex-col items-start gap-1 rounded-lg border p-1.5 text-left transition-colors",
                      isSelected
                        ? "border-[var(--border-accent)] bg-accent-soft"
                        : "border-line hover:bg-surface-2",
                      isToday && !isSelected && "border-line-strong",
                    )}
                  >
                    <span
                      className={cn(
                        "tabular text-[0.6875rem] font-semibold",
                        isToday ? "text-accent-ink" : "text-ink-2",
                      )}
                    >
                      {day}
                    </span>
                    {rows.length > 0 ? (
                      <>
                        <span className="flex flex-wrap gap-0.5">
                          {rows.slice(0, 4).map((row) => (
                            <span
                              key={row.id}
                              className={cn(
                                "size-1.5 rounded-full",
                                TONE_DOT[
                                  statusTone(
                                    dataset,
                                    String(row[dataset.statusKey ?? "status"]),
                                  )
                                ],
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </span>
                        <span className="text-ink-3 mt-auto text-[0.625rem]">
                          {rows.length} item{rows.length > 1 ? "s" : ""}
                        </span>
                      </>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader
            title={selectedDay ? shortDate(selectedDay) : "Upcoming"}
            subtitle={
              selectedDay
                ? `${agendaRows.length} scheduled on this day`
                : `Next ${dataset.plural.toLowerCase()} from today`
            }
            action={
              <Button
                size="sm"
                variant="primary"
                onClick={() => setFormDate(selectedDay ?? todayIso)}
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Schedule</span>
              </Button>
            }
          />

          {agendaRows.length === 0 ? (
            <EmptyState
              title="Nothing scheduled"
              description="Pick another day or schedule a new entry for this date."
            />
          ) : (
            <ul className="border-line divide-line divide-y border-t">
              {agendaRows.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => setDetailRow(row)}
                    className="hover:bg-surface-2 flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors sm:px-5"
                  >
                    <span className="min-w-0">
                      <span className="text-ink block truncate text-xs font-medium">
                        {primary ? String(row[primary.key]) : String(row.code)}
                      </span>
                      <span className="text-ink-3 mt-0.5 block truncate text-[0.6875rem]">
                        {String(row.code ?? "")} ·{" "}
                        {String(row[dateKey]).length >= 10
                          ? shortDate(String(row[dateKey]))
                          : "—"}
                      </span>
                    </span>
                    <StatusBadge
                      dataset={dataset}
                      value={String(row[dataset.statusKey ?? "status"])}
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="border-line flex items-center justify-between gap-2 border-t px-4 py-3 sm:px-5">
            <span className="text-ink-3 text-[0.6875rem]">
              {collection.filtered.length} {dataset.plural.toLowerCase()} in view
            </span>
            {selectedDay ? (
              <Badge tone="accent">Filtered to {shortDate(selectedDay)}</Badge>
            ) : null}
          </div>
        </Card>
      </div>

      <RecordForm
        open={formDate !== null || editRow !== null}
        mode={editRow ? "edit" : "create"}
        dataset={dataset}
        initial={
          editRow ?? {
            ...blankRow(dataset, collection.rows),
            [dateKey]: formDate ?? todayIso,
          }
        }
        onClose={() => {
          setFormDate(null);
          setEditRow(null);
        }}
        onSubmit={(row) => {
          if (editRow) {
            collection.update(editRow.id, row);
            toast.push(`${dataset.entity} updated`);
          } else {
            collection.create(row);
            toast.push(`${dataset.entity} scheduled`, {
              detail: shortDate(String(row[dateKey])),
            });
          }
        }}
      />

      <RecordDetail
        open={detailRow !== null}
        row={detailRow}
        dataset={dataset}
        onClose={() => setDetailRow(null)}
        onEdit={(row) => setEditRow(row)}
        onDelete={(row) => {
          collection.remove(row.id);
          toast.push(`${dataset.entity} deleted`, { tone: "warning" });
        }}
        onDuplicate={(row) => {
          collection.duplicate(row.id);
          toast.push(`${dataset.entity} duplicated`);
        }}
        onStatusChange={(row, status) => {
          collection.setCell(row.id, dataset.statusKey ?? "status", status);
          setDetailRow({ ...row, [dataset.statusKey ?? "status"]: status });
        }}
      />
    </>
  );
}
