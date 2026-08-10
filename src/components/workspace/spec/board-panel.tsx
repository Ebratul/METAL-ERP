"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/feedback";
import { FilterSelect } from "@/components/ui/form-controls";
import { cn } from "@/lib/utils/cn";
import { compactCurrency, shortDate } from "@/lib/utils/format";
import { TONE_COLOR, compactValue, statusTone } from "@/lib/workspaces/dsl";
import type { RecordRow, ResolvedSpec } from "@/lib/workspaces/types";

/**
 * Kanban over the same rows the table shows. Cards move with the arrow
 * controls — a pointer-drag implementation would need a keyboard equivalent to
 * be usable, and the arrows already give both.
 */
export function BoardPanel({
  spec,
  rows,
  onView,
  onAdvance,
  onCreate,
}: {
  spec: ResolvedSpec;
  rows: RecordRow[];
  onView: (row: RecordRow) => void;
  onAdvance: (row: RecordRow, direction: 1 | -1) => void;
  onCreate: () => void;
}) {
  const ownerField = spec.fields.find((field) => field.kind === "person");
  const [ownerFilter, setOwnerFilter] = useState("");

  const owners = useMemo(() => {
    if (!ownerField) return [];
    return [...new Set(rows.map((row) => String(row[ownerField.key])))].sort();
  }, [rows, ownerField]);

  const visible = useMemo(
    () =>
      ownerField && ownerFilter
        ? rows.filter((row) => row[ownerField.key] === ownerFilter)
        : rows,
    [rows, ownerField, ownerFilter],
  );

  const columns = spec.statuses.map((status, index) => ({
    status,
    tone: statusTone(status, index),
    cards: visible.filter((row) => row[spec.statusField.key] === status),
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-ink-3 text-xs">
          {visible.length} {visible.length === 1 ? "card" : "cards"} across{" "}
          {spec.statuses.length} stages
        </p>
        <div className="ml-auto flex items-center gap-2">
          {ownerField ? (
            <FilterSelect
              label={ownerField.label}
              value={ownerFilter}
              options={owners}
              onChange={setOwnerFilter}
            />
          ) : null}
          <Button size="sm" variant="primary" onClick={onCreate}>
            <Plus size={14} />
            New {spec.entity}
          </Button>
        </div>
      </div>

      <div className="scroll-thin overflow-x-auto pb-2">
        <div className="flex min-w-max gap-3">
          {columns.map((column, columnIndex) => (
            <section
              key={column.status}
              aria-label={column.status}
              className="bg-surface-2 border-line flex w-[19rem] shrink-0 flex-col rounded-xl border"
            >
              <header className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span className="text-ink flex items-center gap-2 text-xs font-semibold">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: TONE_COLOR[column.tone] }}
                    aria-hidden="true"
                  />
                  {column.status}
                </span>
                <span className="bg-surface-3 text-ink-3 tabular rounded-full px-1.5 py-0.5 text-[0.625rem] font-semibold">
                  {column.cards.length}
                </span>
              </header>

              <ul className="scroll-thin flex max-h-[34rem] flex-col gap-2 overflow-y-auto px-2 pb-2">
                {column.cards.slice(0, 18).map((card) => (
                  <li
                    key={card.id}
                    className="bg-surface border-line hover:border-line-strong rounded-lg border p-3 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onView(card)}
                      className="w-full text-left"
                    >
                      <p className="text-ink-3 text-[0.625rem]">
                        {String(card[spec.codeField.key])}
                      </p>
                      <p className="text-ink mt-0.5 text-xs leading-snug font-medium">
                        {spec.primaryTextField
                          ? String(card[spec.primaryTextField.key])
                          : spec.entity}
                      </p>
                    </button>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {spec.enumFields.slice(1, 3).map((field) => (
                        <Badge key={field.key} tone="accent">
                          {String(card[field.key])}
                        </Badge>
                      ))}
                    </div>

                    <div className="border-line mt-2.5 flex items-center justify-between gap-2 border-t pt-2.5">
                      <span className="flex min-w-0 items-center gap-1.5">
                        {ownerField ? (
                          <Avatar name={String(card[ownerField.key])} size={20} />
                        ) : null}
                        {spec.dateField ? (
                          <span className="text-ink-3 text-[0.625rem]">
                            {shortDate(String(card[spec.dateField.key]))}
                          </span>
                        ) : null}
                      </span>
                      <span className="text-ink tabular shrink-0 text-[0.6875rem] font-semibold">
                        {spec.measure
                          ? spec.measure.kind === "money"
                            ? compactCurrency(Number(card[spec.measure.key]))
                            : compactValue(spec.measure, card[spec.measure.key])
                          : null}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        aria-label={`Move ${card[spec.codeField.key]} back`}
                        disabled={columnIndex === 0}
                        onClick={() => onAdvance(card, -1)}
                      >
                        <ChevronLeft size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7"
                        aria-label={`Move ${card[spec.codeField.key]} forward`}
                        disabled={columnIndex === spec.statuses.length - 1}
                        onClick={() => onAdvance(card, 1)}
                      >
                        <ChevronRight size={14} />
                      </Button>
                      <span
                        className={cn(
                          "text-ink-3 ml-auto text-[0.625rem]",
                          columnIndex === spec.statuses.length - 1 && "text-good",
                        )}
                      >
                        Stage {columnIndex + 1}/{spec.statuses.length}
                      </span>
                    </div>
                  </li>
                ))}

                {column.cards.length === 0 ? (
                  <li className="text-ink-3 px-2 py-8 text-center text-[0.6875rem]">
                    Nothing in this stage
                  </li>
                ) : null}
                {column.cards.length > 18 ? (
                  <li className="text-ink-3 px-2 py-2 text-center text-[0.625rem]">
                    +{column.cards.length - 18} more in this stage
                  </li>
                ) : null}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
