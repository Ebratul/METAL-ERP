"use client";

import { Copy, Pencil, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/feedback";
import type { Dataset } from "@/lib/data/dataset-types";
import { formatCell, type Row } from "@/lib/data/collection";
import { daysFromToday, pick, randomInt, seeded } from "@/lib/data/rng";
import { PEOPLE } from "@/lib/data/pools";
import { shortDate } from "@/lib/utils/format";
import { StatusPicker } from "./cells";

const TRAIL_EVENTS = [
  "Record created",
  "Sent for approval",
  "Details amended",
  "Comment added by owner",
  "Attachment uploaded",
  "Status changed",
  "Reviewed by department head",
  "Linked to a parent document",
];

/** A deterministic activity trail, so every record has a believable history. */
function activityTrail(row: Row) {
  const rng = seeded(`trail:${row.id}:${String(row.code ?? "")}`);
  return Array.from({ length: 4 }, (_, index) => ({
    id: `${row.id}-trail-${index}`,
    label: pick(rng, TRAIL_EVENTS),
    actor: pick(rng, PEOPLE),
    date: daysFromToday(-randomInt(rng, index * 6 + 1, index * 6 + 9)),
  }));
}

interface RecordDetailProps {
  open: boolean;
  onClose: () => void;
  dataset: Dataset;
  row: Row | null;
  onEdit: (row: Row) => void;
  onDelete: (row: Row) => void;
  onDuplicate: (row: Row) => void;
  onStatusChange: (row: Row, status: string) => void;
}

/** The read view: every field, the status control and the record's history. */
export function RecordDetail({
  open,
  onClose,
  dataset,
  row,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
}: RecordDetailProps) {
  if (!open || !row) return null;

  const primary = dataset.fields.find((field) => field.primary);
  const trail = activityTrail(row);

  return (
    <Modal
      open
      variant="drawer"
      onClose={onClose}
      title={primary ? String(row[primary.key]) : String(row.code ?? dataset.entity)}
      subtitle={`${dataset.entity} · ${String(row.code ?? row.id)}`}
      footer={
        <>
          <Button
            variant="danger"
            onClick={() => {
              onDelete(row);
              onClose();
            }}
          >
            <Trash2 size={15} />
            Delete
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              onDuplicate(row);
              onClose();
            }}
          >
            <Copy size={15} />
            Duplicate
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onEdit(row);
              onClose();
            }}
          >
            <Pencil size={15} />
            Edit
          </Button>
        </>
      }
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="text-ink-3 text-xs">Current status</span>
        <StatusPicker
          dataset={dataset}
          row={row}
          onChange={(next) => onStatusChange(row, next)}
        />
      </div>

      <dl className="border-line divide-line divide-y border-t">
        {dataset.fields.map((field) => (
          <div
            key={field.key}
            className="flex items-baseline justify-between gap-4 py-2.5"
          >
            <dt className="text-ink-3 shrink-0 text-xs">{field.label}</dt>
            <dd className="text-ink min-w-0 text-right text-sm font-medium">
              {field.type === "date"
                ? String(row[field.key]).length >= 10
                  ? shortDate(String(row[field.key]))
                  : "—"
                : formatCell(field, row[field.key])}
            </dd>
          </div>
        ))}
      </dl>

      <section className="mt-6" aria-label="Activity">
        <h3 className="text-ink mb-3 text-xs font-semibold">Activity</h3>
        <ul className="flex flex-col gap-3">
          {trail.map((entry) => (
            <li key={entry.id} className="flex items-start gap-2.5">
              <Avatar name={entry.actor} size={26} />
              <div className="min-w-0">
                <p className="text-ink text-xs font-medium">{entry.label}</p>
                <p className="text-ink-3 text-[0.6875rem]">
                  {entry.actor} · {shortDate(entry.date)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </Modal>
  );
}
