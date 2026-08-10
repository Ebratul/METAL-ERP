"use client";

import { useState } from "react";
import { CircleAlert, RotateCcw, Save, Send } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { shortDate } from "@/lib/utils/format";
import type { Dataset } from "@/lib/data/dataset-types";
import { blankRow, formatCell, type CellValue, type Row } from "@/lib/data/collection";
import { StatusBadge } from "./cells";
import {
  FieldControl,
  coerceDraft,
  formFields,
  validateDraft,
} from "./field-control";
import { RecordDetail } from "./record-detail";
import type { Collection } from "./use-collection";

/**
 * The data-entry workspace: a full document form on the left, the entries it
 * has produced on the right. Saving a draft and submitting for approval both
 * write into the same collection, with different starting statuses.
 */
export function FormSurface({
  dataset,
  collection,
  title,
  description,
}: {
  dataset: Dataset;
  collection: Collection;
  title: string;
  description: string;
}) {
  const toast = useToast();
  const fields = formFields(dataset);
  const statuses = Object.keys(dataset.statusTones);
  const draftStatus =
    statuses.find((status) => dataset.statusTones[status] === "neutral") ??
    statuses[statuses.length - 1];
  const submitStatus =
    statuses.find((status) => dataset.statusTones[status] === "warning") ??
    statuses.find((status) => dataset.statusTones[status] === "info") ??
    statuses[0];

  const [draft, setDraft] = useState<Row>(() => blankRow(dataset, collection.rows));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [detailRow, setDetailRow] = useState<Row | null>(null);

  const primary = dataset.fields.find((field) => field.primary);
  const dateField = dataset.fields.find((field) => field.key === dataset.dateKey);
  const recent = collection.rows.slice(0, 6);

  function setValue(key: string, value: CellValue) {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function save(status: string, message: string) {
    const found = validateDraft(fields, draft);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.push("Check the highlighted fields", {
        detail: `${Object.keys(found).length} field(s) need attention`,
        tone: "warning",
      });
      return;
    }

    const record = coerceDraft(fields, {
      ...draft,
      [dataset.statusKey ?? "status"]: status,
    });
    collection.create(record);
    toast.push(message, { detail: String(record.code ?? "") });
    setDraft(blankRow(dataset, [record, ...collection.rows]));
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader title={title} subtitle={description} />

          <form
            className="grid grid-cols-1 gap-4 px-4 pb-4 sm:grid-cols-2 sm:px-5"
            onSubmit={(event) => {
              event.preventDefault();
              save(submitStatus, `${dataset.entity} submitted for approval`);
            }}
          >
            {fields.map((field) => (
              <FieldControl
                key={field.key}
                field={field}
                value={draft[field.key]}
                error={errors[field.key]}
                entity={dataset.entity}
                onChange={(value) => setValue(field.key, value)}
              />
            ))}

            <div className="border-line flex flex-wrap items-center gap-2 border-t pt-4 sm:col-span-2">
              <Button
                variant="primary"
                size="md"
                type="button"
                onClick={() => save(draftStatus, `${dataset.entity} saved as draft`)}
              >
                <Save size={15} />
                Save Draft
              </Button>
              <Button variant="secondary" size="md" type="submit">
                <Send size={15} />
                Submit for Approval
              </Button>
              <Button
                variant="ghost"
                size="md"
                type="button"
                onClick={() => {
                  setDraft(blankRow(dataset, collection.rows));
                  setErrors({});
                  toast.push("Form cleared", { tone: "info" });
                }}
              >
                <RotateCcw size={15} />
                Reset
              </Button>
              <p className="text-ink-3 ml-auto flex items-center gap-1.5 text-[0.6875rem]">
                <CircleAlert size={12} aria-hidden="true" />
                Saved to this browser session only
              </p>
            </div>
          </form>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader
            title="Recent Entries"
            subtitle={`Last ${recent.length} ${dataset.plural.toLowerCase()} captured here`}
            action={<Badge tone="accent">{collection.rows.length}</Badge>}
          />
          <ul className="border-line divide-line divide-y border-t">
            {recent.map((row) => (
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
                      {String(row.code ?? "")}
                      {dateField && String(row[dateField.key]).length >= 10
                        ? ` · ${shortDate(String(row[dateField.key]))}`
                        : ""}
                      {dataset.valueKey
                        ? ` · ${formatCell(
                            dataset.fields.find(
                              (field) => field.key === dataset.valueKey,
                            )!,
                            row[dataset.valueKey],
                          )}`
                        : ""}
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
        </Card>
      </div>

      <RecordDetail
        open={detailRow !== null}
        row={detailRow}
        dataset={dataset}
        onClose={() => setDetailRow(null)}
        onEdit={(row) => {
          setDraft(row);
          toast.push("Loaded into the form", {
            detail: "Edit the values and save again",
            tone: "info",
          });
        }}
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
