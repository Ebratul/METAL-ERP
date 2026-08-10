"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Plus, RotateCcw, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/ui/data-table";
import { FilterSelect } from "@/components/ui/form-controls";
import { ConfirmDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import { compactCurrency, number } from "@/lib/utils/format";
import type { Dataset, FieldDef } from "@/lib/data/dataset-types";
import { blankRow, toCsv, type Row } from "@/lib/data/collection";
import { CellValueView, StatusPicker } from "./cells";
import { RecordForm } from "./record-form";
import { RecordDetail } from "./record-detail";
import type { Collection } from "./use-collection";

/** Columns shown by default — enough to be useful, few enough to stay readable. */
function tableFields(dataset: Dataset): FieldDef[] {
  const shown = dataset.fields.filter(
    (field) => field.inTable !== false && field.type !== "textarea",
  );
  const status = shown.filter((field) => field.type === "status");
  const rest = shown.filter((field) => field.type !== "status");
  return [...rest.slice(0, 8), ...status];
}

/** Facet fields offered as dropdown filters above the table. */
function facetFields(dataset: Dataset): FieldDef[] {
  return dataset.fields
    .filter((field) => field.facet && (field.options?.length ?? 0) > 1)
    .slice(0, 4);
}

function downloadCsv(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

interface CollectionTableProps {
  dataset: Dataset;
  collection: Collection;
  caption: string;
  /** Rows per page; overview surfaces use a shorter table. */
  pageSize?: number;
  /** Hides the filter row for compact embeds. */
  compact?: boolean;
}

/**
 * The workspace's record surface: filter, search, sort, paginate, select,
 * create, view, edit, change status, delete and export — all against the
 * in-memory collection.
 */
export function CollectionTable({
  dataset,
  collection,
  caption,
  pageSize = 10,
  compact = false,
}: CollectionTableProps) {
  const toast = useToast();

  const [showFilters, setShowFilters] = useState(!compact);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [formState, setFormState] = useState<{
    mode: "create" | "edit";
    row: Row;
  } | null>(null);
  const [detailRow, setDetailRow] = useState<Row | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Row | "bulk" | null>(null);

  const fields = useMemo(() => tableFields(dataset), [dataset]);
  const facets = useMemo(() => facetFields(dataset), [dataset]);
  const primary = dataset.fields.find((field) => field.primary);

  const columns: Column<Row>[] = useMemo(() => {
    const base: Column<Row>[] = fields.map((field) => ({
      key: field.key,
      header: field.label,
      align: field.align,
      // Dates and money need room; without it the cell wraps mid-value.
      width: field.width ?? (field.type === "date" ? "w-28" : undefined),
      hideOnMobile: field.hideOnMobile,
      accessor: (row) => row[field.key],
      render: (row) =>
        field.type === "status" ? (
          <StatusPicker
            dataset={dataset}
            row={row}
            onChange={(next) => {
              collection.setCell(row.id, field.key, next);
              toast.push(`${String(row.code ?? dataset.entity)} moved to ${next}`, {
                tone: "info",
              });
            }}
          />
        ) : (
          <CellValueView dataset={dataset} field={field} value={row[field.key]} row={row} />
        ),
    }));

    base.push({
      key: "__actions",
      header: "Actions",
      sortable: false,
      align: "right",
      width: "w-28",
      render: (row) => (
        <span className="flex items-center justify-end gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label={`View ${String(row.code ?? row.id)}`}
            onClick={(event) => {
              event.stopPropagation();
              setDetailRow(row);
            }}
          >
            <Eye size={14} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label={`Edit ${String(row.code ?? row.id)}`}
            onClick={(event) => {
              event.stopPropagation();
              setFormState({ mode: "edit", row });
            }}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-ink-3 hover:text-critical size-7"
            aria-label={`Delete ${String(row.code ?? row.id)}`}
            onClick={(event) => {
              event.stopPropagation();
              setPendingDelete(row);
            }}
          >
            <Trash2 size={14} />
          </Button>
        </span>
      ),
    });

    return base;
  }, [fields, dataset, collection, toast]);

  const rows = collection.filtered;
  const totalValue = dataset.valueKey
    ? rows.reduce((sum, row) => sum + Number(row[dataset.valueKey ?? ""] ?? 0), 0)
    : 0;
  const valueField = dataset.fields.find((field) => field.key === dataset.valueKey);
  const settled = Object.entries(dataset.statusTones)
    .filter(([, tone]) => tone === "good")
    .map(([status]) => status);
  const openCount = rows.filter(
    (row) => !settled.includes(String(row[dataset.statusKey ?? "status"])),
  ).length;

  function toggleSelect(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll(ids: string[]) {
    setSelected((current) => {
      const allSelected = ids.every((id) => current.has(id));
      const next = new Set(current);
      for (const id of ids) {
        if (allSelected) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }

  function bulkStatus(status: string) {
    for (const id of selected) collection.setCell(id, dataset.statusKey ?? "status", status);
    toast.push(`${selected.size} ${dataset.plural.toLowerCase()} set to ${status}`);
    setSelected(new Set());
  }

  return (
    <>
      <Card>
        {/* ── Filter row ───────────────────────────────────────────────── */}
        {showFilters && facets.length > 0 ? (
          <div className="border-line flex flex-wrap items-center gap-2 border-b px-4 py-2.5 sm:px-5">
            <span className="text-ink-3 text-[0.6875rem] font-semibold tracking-wide uppercase">
              Filters
            </span>
            {facets.map((field) => (
              <FilterSelect
                key={field.key}
                label={field.label}
                value={collection.facets[field.key] ?? "all"}
                options={field.options ?? []}
                onChange={(value) => collection.setFacet(field.key, value)}
              />
            ))}
            {collection.activeFilterCount > 0 ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={collection.clearFilters}
                className="text-ink-3"
              >
                <X size={13} />
                Clear ({collection.activeFilterCount})
              </Button>
            ) : null}
            <span className="text-ink-3 ml-auto text-[0.6875rem]">
              {number(rows.length)} of {number(collection.rows.length)}{" "}
              {dataset.plural.toLowerCase()}
            </span>
          </div>
        ) : null}

        {/* ── Bulk action bar ──────────────────────────────────────────── */}
        {selected.size > 0 ? (
          <div className="bg-accent-soft border-line flex flex-wrap items-center gap-2 border-b px-4 py-2.5 sm:px-5">
            <span className="text-ink text-xs font-semibold">
              {selected.size} selected
            </span>
            <select
              value=""
              aria-label="Set status for selected rows"
              onChange={(event) => {
                if (event.target.value) bulkStatus(event.target.value);
              }}
              className="bg-surface border-line text-ink h-8 rounded-lg border px-2.5 text-xs outline-none"
            >
              <option value="">Set status…</option>
              {Object.keys(dataset.statusTones).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Button size="sm" variant="danger" onClick={() => setPendingDelete("bulk")}>
              <Trash2 size={13} />
              Delete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelected(new Set())}
              className="ml-auto"
            >
              Clear selection
            </Button>
          </div>
        ) : null}

        <DataTable
          caption={caption}
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          pageSize={pageSize}
          query={collection.query}
          onQueryChange={collection.setQuery}
          searchPlaceholder={`Search ${dataset.plural.toLowerCase()}…`}
          onFilter={facets.length > 0 ? () => setShowFilters((open) => !open) : undefined}
          onExport={() => {
            downloadCsv(`${dataset.id}-export.csv`, toCsv(fields, rows));
            toast.push("Export ready", {
              detail: `${rows.length} ${dataset.plural.toLowerCase()} written to CSV`,
            });
          }}
          onRowClick={(row) => setDetailRow(row)}
          selection={{
            selected,
            onToggle: toggleSelect,
            onToggleAll: toggleSelectAll,
          }}
          emptyMessage={
            collection.rows.length === 0
              ? `No ${dataset.plural.toLowerCase()} yet — create the first one.`
              : "Nothing matches the current filters."
          }
          toolbar={
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  collection.reset();
                  setSelected(new Set());
                  toast.push("Demo data restored", { tone: "info" });
                }}
                aria-label="Reset demo data"
              >
                <RotateCcw size={14} />
                <span className="hidden lg:inline">Reset</span>
              </Button>
              <Button
                size="sm"
                variant="primary"
                // The label collapses on narrow screens, so the accessible
                // name is set explicitly rather than inferred from the text.
                aria-label={`New ${dataset.entity}`}
                onClick={() =>
                  setFormState({ mode: "create", row: blankRow(dataset, collection.rows) })
                }
              >
                <Plus size={14} />
                <span className="hidden sm:inline">New {dataset.entity}</span>
              </Button>
            </>
          }
          footer={
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SummaryCell label={dataset.plural} value={number(rows.length)} />
              <SummaryCell label="Open" value={number(openCount)} tone="warning" />
              <SummaryCell
                label="Selected"
                value={number(selected.size)}
                tone={selected.size > 0 ? "good" : undefined}
              />
              <SummaryCell
                label={valueField ? `Total ${valueField.label}` : "Records"}
                value={
                  valueField?.type === "currency"
                    ? compactCurrency(totalValue)
                    : number(Math.round(totalValue))
                }
                tone="good"
              />
            </div>
          }
        />
      </Card>

      {/* ── Dialogs ──────────────────────────────────────────────────────── */}
      <RecordForm
        open={formState !== null}
        mode={formState?.mode ?? "create"}
        dataset={dataset}
        initial={formState?.row ?? blankRow(dataset, collection.rows)}
        onClose={() => setFormState(null)}
        onSubmit={(row) => {
          if (formState?.mode === "edit") {
            collection.update(formState.row.id, row);
            toast.push(`${dataset.entity} updated`, {
              detail: String(row.code ?? row.id),
            });
          } else {
            collection.create(row);
            toast.push(`${dataset.entity} created`, {
              detail: `${String(row.code ?? "")} added to ${dataset.plural.toLowerCase()}`,
            });
          }
        }}
      />

      <RecordDetail
        open={detailRow !== null}
        row={detailRow}
        dataset={dataset}
        onClose={() => setDetailRow(null)}
        onEdit={(row) => setFormState({ mode: "edit", row })}
        onDelete={(row) => {
          collection.remove(row.id);
          toast.push(`${dataset.entity} deleted`, {
            detail: String(row.code ?? row.id),
            tone: "warning",
          });
        }}
        onDuplicate={(row) => {
          collection.duplicate(row.id);
          toast.push(`${dataset.entity} duplicated`);
        }}
        onStatusChange={(row, status) => {
          collection.setCell(row.id, dataset.statusKey ?? "status", status);
          setDetailRow({ ...row, [dataset.statusKey ?? "status"]: status });
          toast.push(`Status set to ${status}`, { tone: "info" });
        }}
      />

      <ConfirmDialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        title={
          pendingDelete === "bulk"
            ? `Delete ${selected.size} ${dataset.plural.toLowerCase()}?`
            : `Delete this ${dataset.entity.toLowerCase()}?`
        }
        message={
          pendingDelete === "bulk" || pendingDelete === null
            ? "The selected records will be removed from this demo workspace."
            : `${String(
                pendingDelete[primary?.key ?? "code"] ?? pendingDelete.code ?? "",
              )} will be removed from this demo workspace.`
        }
        onConfirm={() => {
          if (pendingDelete === "bulk") {
            collection.removeMany([...selected]);
            toast.push(`${selected.size} records deleted`, { tone: "warning" });
            setSelected(new Set());
          } else if (pendingDelete) {
            collection.remove(pendingDelete.id);
            toast.push(`${dataset.entity} deleted`, {
              detail: String(pendingDelete.code ?? pendingDelete.id),
              tone: "warning",
            });
          }
        }}
      />
    </>
  );
}

function SummaryCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "warning";
}) {
  return (
    <div>
      <p className="text-ink-3 truncate text-[0.625rem]">{label}</p>
      <p
        className={cn(
          "text-ink tabular mt-0.5 text-sm font-semibold",
          tone === "good" && "text-good",
          tone === "warning" && "text-warning",
        )}
      >
        {value}
      </p>
    </div>
  );
}
