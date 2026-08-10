"use client";

import { HardDriveDownload, Printer, Save, Upload } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { statusTone } from "@/lib/workspaces/dsl";
import { shortDate } from "@/lib/utils/format";
import { plural } from "@/lib/workspaces/derive";
import type { RecordRow, ResolvedSpec } from "@/lib/workspaces/types";
import { RecordFields, type DraftState } from "./record-form";

/**
 * The full-page entry surface. Same draft state and validation as the create
 * modal — this is the layout `form` submodules land on first.
 */
export function EntryPanel({
  spec,
  draft,
  rows,
  onSubmit,
  onView,
  onPrint,
}: {
  spec: ResolvedSpec;
  draft: DraftState;
  rows: RecordRow[];
  /** Returns the saved row, or `null` when validation stopped the save. */
  onSubmit: (submitForApproval: boolean) => RecordRow | null;
  onView: (row: RecordRow) => void;
  /** Present on workspaces that can produce a printed proforma invoice. */
  onPrint?: (row: RecordRow) => void;
}) {
  const recent = rows.slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-8">
        <CardHeader
          title={`New ${spec.entity}`}
          subtitle={`Capture a ${spec.entity.toLowerCase()} — every field is validated before it joins the register.`}
        />
        <form
          className="px-4 pb-4 sm:px-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(false);
          }}
        >
          <RecordFields spec={spec} draft={draft} />

          <div className="border-line mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
            <Button variant="primary" size="md" type="submit">
              <Save size={15} />
              Save {spec.entity}
            </Button>
            <Button variant="secondary" size="md" onClick={() => onSubmit(true)}>
              <Upload size={15} />
              Submit for approval
            </Button>
            {onPrint ? (
              <Button
                variant="secondary"
                size="md"
                onClick={() => {
                  const saved = onSubmit(false);
                  if (saved) onPrint(saved);
                }}
              >
                <Printer size={15} />
                Save &amp; print
              </Button>
            ) : null}
            <Button variant="ghost" size="md" onClick={() => draft.reset()}>
              Reset
            </Button>
            <p className="text-ink-3 ml-auto flex items-center gap-1.5 text-[0.6875rem]">
              <HardDriveDownload size={12} aria-hidden="true" />
              Saved in this browser — no backend connected
            </p>
          </div>
        </form>
      </Card>

      <Card className="xl:col-span-4">
        <CardHeader
          title={`Recent ${plural(spec.entity)}`}
          subtitle="The latest entries in this register"
        />
        <ul className="flex flex-col">
          {recent.map((row) => {
            const status = String(row[spec.statusField.key]);
            return (
              <li
                key={row.id}
                className="border-line flex items-center border-t pr-2 first:border-t-0 sm:pr-3"
              >
                <button
                  type="button"
                  onClick={() => onView(row)}
                  className="hover:bg-surface-2/60 flex min-w-0 flex-1 items-start justify-between gap-3 px-4 py-3 text-left transition-colors sm:px-5"
                >
                  <span className="min-w-0">
                    <span className="text-ink block truncate text-xs font-medium">
                      {spec.primaryTextField
                        ? String(row[spec.primaryTextField.key])
                        : String(row[spec.codeField.key])}
                    </span>
                    <span className="text-ink-3 mt-0.5 block text-[0.6875rem]">
                      {String(row[spec.codeField.key])}
                      {spec.dateField
                        ? ` · ${shortDate(String(row[spec.dateField.key]))}`
                        : ""}
                    </span>
                  </span>
                  <Badge tone={statusTone(status, spec.statuses.indexOf(status))}>
                    {status}
                  </Badge>
                </button>
                {onPrint ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7 shrink-0"
                    aria-label={`Print ${row[spec.codeField.key]}`}
                    onClick={() => onPrint(row)}
                  >
                    <Printer size={14} />
                  </Button>
                ) : null}
              </li>
            );
          })}
          {recent.length === 0 ? (
            <li className="text-ink-3 px-5 py-8 text-center text-xs">
              No records yet — the first entry will appear here.
            </li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
