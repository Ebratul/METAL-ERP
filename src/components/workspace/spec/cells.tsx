"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/feedback";
import { ProgressBar } from "@/components/ui/progress";
import { compactCurrency, number, shortDate } from "@/lib/utils/format";
import { safeCsvCell } from "@/lib/security/sanitize";
import { TONE_COLOR, formatValue, statusTone } from "@/lib/workspaces/dsl";
import type { FieldSpec, RecordRow, ResolvedSpec } from "@/lib/workspaces/types";

/** One table cell, rendered according to the field's kind. */
export function Cell({
  field,
  row,
  statuses,
}: {
  field: FieldSpec;
  row: RecordRow;
  statuses: string[];
}): ReactNode {
  const value = row[field.key];

  switch (field.kind) {
    case "code":
      return <span className="text-ink font-medium">{String(value)}</span>;

    case "status": {
      const label = String(value);
      return (
        <Badge tone={statusTone(label, statuses.indexOf(label))} withIcon>
          {label}
        </Badge>
      );
    }

    case "person":
      return (
        <span className="flex items-center gap-2">
          <Avatar name={String(value)} size={22} />
          <span className="max-w-[9rem] truncate">{String(value)}</span>
        </span>
      );

    case "money":
      return (
        <span className="text-ink font-semibold">{compactCurrency(Number(value))}</span>
      );

    case "int":
      return (
        <span className="tabular">
          {number(Number(value))}
          {field.unit ? (
            <span className="text-ink-3 ml-1 text-[0.6875rem]">{field.unit}</span>
          ) : null}
        </span>
      );

    case "float":
      return (
        <span className="tabular">
          {Number(value).toFixed(field.digits ?? 2)}
          {field.unit ? (
            <span className="text-ink-3 ml-1 text-[0.6875rem]">{field.unit}</span>
          ) : null}
        </span>
      );

    case "pct":
      return (
        <ProgressBar
          value={Number(value)}
          height={5}
          color={
            Number(value) >= 85
              ? "var(--status-good)"
              : Number(value) >= 60
                ? "var(--series-1)"
                : "var(--status-warning)"
          }
          label={`${field.label}`}
          showValue
          valueText={`${Number(value).toFixed(0)}%`}
        />
      );

    case "date":
      return <span className="whitespace-nowrap">{shortDate(String(value))}</span>;

    case "bool":
      return (
        <Badge tone={String(value) === (field.options?.[0] ?? "Yes") ? "good" : "neutral"}>
          {String(value)}
        </Badge>
      );

    default:
      return <span className="block max-w-[15rem] truncate">{String(value)}</span>;
  }
}

/** A coloured dot + label for the status, used on cards and in tight rows. */
export function StatusDot({ status, statuses }: { status: string; statuses: string[] }) {
  const tone = statusTone(status, statuses.indexOf(status));
  return (
    <span className="text-ink-2 inline-flex items-center gap-1.5 text-[0.6875rem]">
      <span
        className="size-2 shrink-0 rounded-full"
        style={{ backgroundColor: TONE_COLOR[tone] }}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

/* ── CSV export ────────────────────────────────────────────────────────── */

/**
 * Client-side export. Values go through `safeCsvCell` so a leading `=` or `+`
 * cannot turn a cell into a spreadsheet formula when the file is opened.
 */
export function exportRowsToCsv(
  spec: ResolvedSpec,
  rows: RecordRow[],
  filename: string,
) {
  const header = spec.fields.map((field) => safeCsvCell(field.label)).join(",");
  const body = rows
    .map((row) =>
      spec.fields
        .map((field) => {
          const raw = formatValue(field, row[field.key]);
          const cell = safeCsvCell(raw);
          return cell.includes(",") ? `"${cell.replace(/"/g, '""')}"` : cell;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([`${header}\n${body}`], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
