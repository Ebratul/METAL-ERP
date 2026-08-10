"use client";

import { Badge, type StatusTone } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/feedback";
import { shortDate } from "@/lib/utils/format";
import type { Dataset, FieldDef, Tone } from "@/lib/data/dataset-types";
import { formatCell, type CellValue, type Row } from "@/lib/data/collection";

const PRIORITY_TONE: Record<string, StatusTone> = {
  High: "critical",
  Medium: "warning",
  Low: "neutral",
};

export function statusTone(dataset: Dataset, value: string): StatusTone {
  return (dataset.statusTones[value] as Tone | undefined) ?? "neutral";
}

/** The badge used wherever a record's state is shown read-only. */
export function StatusBadge({
  dataset,
  value,
}: {
  dataset: Dataset;
  value: string;
}) {
  return (
    <Badge tone={statusTone(dataset, value)} withIcon>
      {value}
    </Badge>
  );
}

/**
 * A status badge that is also a control. The native `<select>` sits invisibly
 * over the badge, so the visual stays on-brand while keyboard users, screen
 * readers and touch users get real select behaviour.
 */
export function StatusPicker({
  dataset,
  row,
  onChange,
}: {
  dataset: Dataset;
  row: Row;
  onChange: (next: string) => void;
}) {
  const key = dataset.statusKey ?? "status";
  const value = String(row[key] ?? "");
  const options = Object.keys(dataset.statusTones);

  return (
    <span className="relative inline-flex">
      <Badge tone={statusTone(dataset, value)} withIcon className="pr-2.5">
        {value}
      </Badge>
      <select
        value={value}
        aria-label={`Change status of ${String(row.code ?? row.id)}`}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          event.stopPropagation();
          onChange(event.target.value);
        }}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </span>
  );
}

/** How one field renders inside a table cell or a detail row. */
export function CellValueView({
  dataset,
  field,
  value,
  row,
}: {
  dataset: Dataset;
  field: FieldDef;
  value: CellValue;
  row: Row;
}) {
  if (field.type === "status") {
    return <StatusBadge dataset={dataset} value={String(value)} />;
  }

  if (field.key === "priority") {
    return (
      <Badge tone={PRIORITY_TONE[String(value)] ?? "neutral"}>{String(value)}</Badge>
    );
  }

  if (field.type === "progress") {
    const numeric = Number(value);
    return (
      <ProgressBar
        value={numeric}
        height={5}
        color={
          numeric >= 96
            ? "var(--status-good)"
            : numeric >= 50
              ? "var(--series-1)"
              : "var(--status-warning)"
        }
        label={`${String(row.code ?? row.id)} ${field.label}`}
        showValue
      />
    );
  }

  if (field.type === "date") {
    const iso = String(value);
    return (
      <span className="whitespace-nowrap">
        {iso.length >= 10 ? shortDate(iso) : "—"}
      </span>
    );
  }

  if (field.primary) {
    return (
      <span className="text-ink block max-w-[15rem] truncate font-medium">
        {String(value)}
      </span>
    );
  }

  if (field.key === "owner" || field.type === "text") {
    return (
      <span className="flex items-center gap-2">
        <Avatar name={String(value)} size={20} />
        <span className="max-w-[10rem] truncate">{String(value)}</span>
      </span>
    );
  }

  if (field.type === "currency" || field.type === "number") {
    return (
      <span className={field.type === "currency" ? "text-ink font-semibold" : undefined}>
        {formatCell(field, value)}
      </span>
    );
  }

  return <span>{formatCell(field, value)}</span>;
}
