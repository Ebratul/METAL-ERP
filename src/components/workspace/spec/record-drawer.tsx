"use client";

import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Printer,
  Trash2,
} from "lucide-react";
import { Drawer } from "@/components/ui/overlay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/feedback";
import { cn } from "@/lib/utils/cn";
import { seeded, pick, randomInt, daysFromToday } from "@/lib/data/rng";
import { shortDate } from "@/lib/utils/format";
import { PEOPLE, TONE_COLOR, formatValue, statusTone } from "@/lib/workspaces/dsl";
import type { RecordRow, ResolvedSpec } from "@/lib/workspaces/types";

/** A plausible audit trail for one record, stable per record id. */
function activityFor(row: RecordRow, spec: ResolvedSpec) {
  const rng = seeded(`activity:${row.id}:${spec.ref}`);
  const events = [
    "Record created",
    "Details amended",
    "Sent for approval",
    "Attachment uploaded",
    `Status set to ${row[spec.statusField.key]}`,
  ];
  return events.map((label, index) => ({
    id: `${row.id}-ev-${index}`,
    label,
    actor: pick(rng, PEOPLE),
    at: daysFromToday(-randomInt(rng, 1, 60) - (events.length - index) * 2),
  }));
}

export function RecordDrawer({
  spec,
  row,
  open,
  onClose,
  onEdit,
  onDelete,
  onAdvance,
  onPrint,
}: {
  spec: ResolvedSpec;
  row: RecordRow | null;
  open: boolean;
  onClose: () => void;
  onEdit: (row: RecordRow) => void;
  onDelete: (row: RecordRow) => void;
  onAdvance: (row: RecordRow, direction: 1 | -1) => void;
  /** Present on workspaces that can produce a printed proforma invoice. */
  onPrint?: (row: RecordRow) => void;
}) {
  if (!row) return null;

  const status = String(row[spec.statusField.key]);
  const statusIndex = spec.statuses.indexOf(status);
  const tone = statusTone(status, statusIndex);
  const activity = activityFor(row, spec);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={String(row[spec.codeField.key])}
      subtitle={`${spec.entity} · ${spec.primaryTextField ? row[spec.primaryTextField.key] : ""}`}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={() => onEdit(row)}>
            <Pencil size={14} />
            Edit
          </Button>
          {onPrint ? (
            <Button variant="secondary" size="sm" onClick={() => onPrint(row)}>
              <Printer size={14} />
              Print PI
            </Button>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            disabled={statusIndex <= 0}
            onClick={() => onAdvance(row, -1)}
          >
            <ChevronLeft size={14} />
            Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={statusIndex >= spec.statuses.length - 1}
            onClick={() => onAdvance(row, 1)}
          >
            Advance
            <ChevronRight size={14} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ml-auto"
            onClick={() => onDelete(row)}
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Status pipeline */}
        <section aria-label="Status pipeline">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-ink-3 text-[0.6875rem] tracking-wide uppercase">
              Pipeline
            </p>
            <Badge tone={tone} withIcon>
              {status}
            </Badge>
          </div>
          <ol className="flex flex-wrap items-center gap-1.5">
            {spec.statuses.map((step, index) => {
              const reached = index <= statusIndex;
              return (
                <li key={step} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.625rem] font-medium",
                      reached ? "text-ink" : "text-ink-3 bg-surface-2",
                    )}
                    style={
                      reached
                        ? {
                            backgroundColor: `color-mix(in oklab, ${
                              TONE_COLOR[statusTone(step, index)]
                            } 22%, transparent)`,
                          }
                        : undefined
                    }
                  >
                    {step}
                  </span>
                  {index < spec.statuses.length - 1 ? (
                    <ChevronRight size={11} className="text-ink-3" aria-hidden="true" />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>

        {/* Field detail */}
        <section aria-label="Record detail">
          <p className="text-ink-3 mb-1 text-[0.6875rem] tracking-wide uppercase">
            {spec.entity} detail
          </p>
          <dl className="divide-line divide-y">
            {spec.fields.map((field) => (
              <div
                key={field.key}
                className="flex items-baseline justify-between gap-4 py-2"
              >
                <dt className="text-ink-3 shrink-0 text-xs">{field.label}</dt>
                <dd className="text-ink min-w-0 text-right text-sm font-medium">
                  {field.kind === "status" ? (
                    <Badge tone={tone} withIcon>
                      {status}
                    </Badge>
                  ) : field.kind === "person" ? (
                    <span className="flex items-center justify-end gap-2">
                      <Avatar name={String(row[field.key])} size={20} />
                      {String(row[field.key])}
                    </span>
                  ) : (
                    formatValue(field, row[field.key])
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Activity */}
        <section aria-label="Activity trail">
          <p className="text-ink-3 mb-2 text-[0.6875rem] tracking-wide uppercase">
            Activity
          </p>
          <ul className="flex flex-col gap-3">
            {activity.map((event) => (
              <li key={event.id} className="flex items-start gap-2.5">
                <Avatar name={event.actor} size={24} />
                <div className="min-w-0">
                  <p className="text-ink text-xs font-medium">{event.label}</p>
                  <p className="text-ink-3 text-[0.6875rem]">
                    {event.actor} · {shortDate(event.at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Drawer>
  );
}
