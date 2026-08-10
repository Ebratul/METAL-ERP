"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/feedback";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import { compactCurrency, number, shortDate } from "@/lib/utils/format";
import type { Dataset } from "@/lib/data/dataset-types";
import { blankRow, type Row } from "@/lib/data/collection";
import { statusTone } from "./cells";
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

/**
 * A status board over the same collection the table shows. Cards move between
 * columns with the arrow buttons, which writes the new status straight back
 * into the record.
 */
export function BoardSurface({
  dataset,
  collection,
}: {
  dataset: Dataset;
  collection: Collection;
}) {
  const toast = useToast();
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [detailRow, setDetailRow] = useState<Row | null>(null);

  const statusKey = dataset.statusKey ?? "status";
  const statuses = useMemo(() => Object.keys(dataset.statusTones), [dataset]);

  const primary = dataset.fields.find((field) => field.primary);
  const groupField = dataset.fields.find((field) => field.key === dataset.groupKey);
  const valueField = dataset.fields.find((field) => field.key === dataset.valueKey);
  const dateField = dataset.fields.find((field) => field.key === dataset.dateKey);
  const ownerField = dataset.fields.find((field) => field.key === "owner");

  const columns = statuses.map((status) => ({
    status,
    cards: collection.filtered.filter((row) => String(row[statusKey]) === status),
  }));

  function move(row: Row, direction: -1 | 1) {
    const index = statuses.indexOf(String(row[statusKey]));
    const next = statuses[Math.min(statuses.length - 1, Math.max(0, index + direction))];
    if (!next || next === row[statusKey]) return;
    collection.setCell(row.id, statusKey, next);
    toast.push(`Moved to ${next}`, { tone: "info" });
  }

  return (
    <>
      <div className="scroll-thin overflow-x-auto pb-2">
        <div className="flex min-w-max gap-3">
          {columns.map((column) => {
            const tone = statusTone(dataset, column.status);
            const columnValue = valueField
              ? column.cards.reduce(
                  (sum, row) => sum + Number(row[valueField.key] ?? 0),
                  0,
                )
              : 0;

            return (
              <section
                key={column.status}
                aria-label={column.status}
                className="bg-surface-2 border-line flex w-[19rem] shrink-0 flex-col rounded-xl border"
              >
                <header className="border-line flex items-center justify-between gap-2 border-b px-3 py-2.5">
                  <span className="text-ink flex min-w-0 items-center gap-2 text-xs font-semibold">
                    <span
                      className={cn("size-2 shrink-0 rounded-full", TONE_DOT[tone])}
                      aria-hidden="true"
                    />
                    <span className="truncate">{column.status}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {valueField?.type === "currency" && columnValue > 0 ? (
                      <span className="text-ink-3 tabular text-[0.625rem]">
                        {compactCurrency(columnValue)}
                      </span>
                    ) : null}
                    <span className="bg-surface-3 text-ink-3 tabular rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold">
                      {column.cards.length}
                    </span>
                  </span>
                </header>

                <ul className="scroll-thin flex max-h-[32rem] flex-col gap-2 overflow-y-auto p-2">
                  {column.cards.slice(0, 25).map((row) => (
                    <li key={row.id}>
                      <div className="bg-surface border-line hover:border-line-strong rounded-lg border p-3 transition-colors">
                        <button
                          type="button"
                          onClick={() => setDetailRow(row)}
                          className="w-full text-left"
                        >
                          <p className="text-ink text-xs leading-snug font-medium">
                            {primary ? String(row[primary.key]) : String(row.code)}
                          </p>
                          <p className="text-ink-3 mt-1 truncate text-[0.6875rem]">
                            {String(row.code ?? "")}
                            {groupField ? ` · ${String(row[groupField.key])}` : ""}
                          </p>
                        </button>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {row.priority ? (
                            <Badge
                              tone={
                                row.priority === "High"
                                  ? "critical"
                                  : row.priority === "Medium"
                                    ? "warning"
                                    : "neutral"
                              }
                            >
                              {String(row.priority)}
                            </Badge>
                          ) : null}
                          {valueField ? (
                            <span className="text-ink tabular text-[0.6875rem] font-semibold">
                              {valueField.type === "currency"
                                ? compactCurrency(Number(row[valueField.key] ?? 0))
                                : number(Number(row[valueField.key] ?? 0))}
                            </span>
                          ) : null}
                        </div>

                        <div className="border-line mt-2.5 flex items-center justify-between gap-2 border-t pt-2.5">
                          <span className="flex min-w-0 items-center gap-1.5">
                            {ownerField ? (
                              <Avatar name={String(row[ownerField.key])} size={20} />
                            ) : null}
                            {dateField ? (
                              <span className="text-ink-3 truncate text-[0.625rem]">
                                {String(row[dateField.key]).length >= 10
                                  ? shortDate(String(row[dateField.key]))
                                  : "—"}
                              </span>
                            ) : null}
                          </span>
                          <span className="flex shrink-0 items-center gap-0.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-6"
                              aria-label={`Move ${String(row.code)} to the previous stage`}
                              onClick={() => move(row, -1)}
                            >
                              <ChevronLeft size={13} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-6"
                              aria-label={`Move ${String(row.code)} to the next stage`}
                              onClick={() => move(row, 1)}
                            >
                              <ChevronRight size={13} />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:text-critical size-6"
                              aria-label={`Delete ${String(row.code)}`}
                              onClick={() => {
                                collection.remove(row.id);
                                toast.push(`${dataset.entity} deleted`, {
                                  tone: "warning",
                                });
                              }}
                            >
                              <Trash2 size={13} />
                            </Button>
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}

                  {column.cards.length === 0 ? (
                    <li className="text-ink-3 px-2 py-8 text-center text-[0.6875rem]">
                      Nothing in this stage
                    </li>
                  ) : null}
                  {column.cards.length > 25 ? (
                    <li className="text-ink-3 px-2 py-2 text-center text-[0.625rem]">
                      +{column.cards.length - 25} more in this stage
                    </li>
                  ) : null}
                </ul>

                <div className="border-line border-t p-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full justify-center"
                    onClick={() => setFormStatus(column.status)}
                  >
                    <Plus size={13} />
                    Add to {column.status}
                  </Button>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <RecordForm
        open={formStatus !== null || editRow !== null}
        mode={editRow ? "edit" : "create"}
        dataset={dataset}
        initial={
          editRow ?? {
            ...blankRow(dataset, collection.rows),
            [statusKey]: formStatus ?? statuses[0],
          }
        }
        onClose={() => {
          setFormStatus(null);
          setEditRow(null);
        }}
        onSubmit={(row) => {
          if (editRow) {
            collection.update(editRow.id, row);
            toast.push(`${dataset.entity} updated`);
          } else {
            collection.create(row);
            toast.push(`${dataset.entity} added to ${String(row[statusKey])}`);
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
          collection.setCell(row.id, statusKey, status);
          setDetailRow({ ...row, [statusKey]: status });
        }}
      />
    </>
  );
}
