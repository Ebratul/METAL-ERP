"use client";

import { useMemo, useState } from "react";
import {
  CheckSquare,
  Download,
  Eye,
  Pencil,
  Plus,
  Printer,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/ui/data-table";
import { FilterSelect } from "@/components/ui/form-controls";
import { cn } from "@/lib/utils/cn";
import { compactCurrency, number } from "@/lib/utils/format";
import { isNumericField } from "@/lib/workspaces/dsl";
import { plural } from "@/lib/workspaces/derive";
import type { RecordRow, ResolvedSpec } from "@/lib/workspaces/types";
import { Cell, exportRowsToCsv } from "./cells";

interface RecordsPanelProps {
  spec: ResolvedSpec;
  rows: RecordRow[];
  title: string;
  onView: (row: RecordRow) => void;
  onEdit: (row: RecordRow) => void;
  onDelete: (ids: string[]) => void;
  onStatus: (ids: string[], status: string) => void;
  onCreate: () => void;
  exportName: string;
  /** Present on workspaces that can produce a printed proforma invoice. */
  onPrint?: (row: RecordRow) => void;
}

export function RecordsPanel({
  spec,
  rows,
  title,
  onView,
  onEdit,
  onDelete,
  onStatus,
  onCreate,
  exportName,
  onPrint,
}: RecordsPanelProps) {
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  // The first enum-ish field doubles as the secondary filter dimension.
  const categoryField = spec.enumFields[0];

  const categoryOptions = useMemo(() => {
    if (!categoryField) return [];
    return [...new Set(rows.map((row) => String(row[categoryField.key])))].sort();
  }, [rows, categoryField]);

  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        if (statusFilter && row[spec.statusField.key] !== statusFilter) return false;
        if (
          categoryFilter &&
          categoryField &&
          row[categoryField.key] !== categoryFilter
        ) {
          return false;
        }
        return true;
      }),
    [rows, statusFilter, categoryFilter, categoryField, spec.statusField.key],
  );

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggleRow(id: string) {
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  }

  function toggleAll() {
    setSelected((current) =>
      current.length === filtered.length ? [] : filtered.map((row) => row.id),
    );
  }

  const columns: Column<RecordRow>[] = [
    {
      key: "__select",
      header: "",
      width: "w-9",
      sortable: false,
      accessor: () => "",
      render: (row) => (
        <button
          type="button"
          aria-label={`Select ${row[spec.codeField.key]}`}
          aria-pressed={selectedSet.has(row.id)}
          onClick={(event) => {
            event.stopPropagation();
            toggleRow(row.id);
          }}
          className={cn(
            "flex items-center transition-colors",
            selectedSet.has(row.id) ? "text-accent-ink" : "text-ink-3 hover:text-ink-2",
          )}
        >
          {selectedSet.has(row.id) ? <CheckSquare size={15} /> : <Square size={15} />}
        </button>
      ),
    },
    ...spec.fields.map<Column<RecordRow>>((field, index) => ({
      key: field.key,
      header: field.label,
      align: isNumericField(field) ? "right" : "left",
      // Keep the reference, the subject and the status on small screens.
      hideOnMobile: index > 1 && field.kind !== "status",
      width: field.kind === "pct" ? "w-32" : undefined,
      accessor: (row) => row[field.key],
      render: (row) => <Cell field={field} row={row} statuses={spec.statuses} />,
    })),
    {
      key: "__actions",
      header: "Actions",
      align: "right",
      sortable: false,
      width: onPrint ? "w-36" : "w-28",
      accessor: () => "",
      render: (row) => (
        <span className="flex items-center justify-end gap-0.5">
          {onPrint ? (
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              aria-label={`Print ${row[spec.codeField.key]}`}
              onClick={(event) => {
                event.stopPropagation();
                onPrint(row);
              }}
            >
              <Printer size={14} />
            </Button>
          ) : null}
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label={`View ${row[spec.codeField.key]}`}
            onClick={(event) => {
              event.stopPropagation();
              onView(row);
            }}
          >
            <Eye size={14} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-7"
            aria-label={`Edit ${row[spec.codeField.key]}`}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(row);
            }}
          >
            <Pencil size={14} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="hover:text-critical size-7"
            aria-label={`Delete ${row[spec.codeField.key]}`}
            onClick={(event) => {
              event.stopPropagation();
              onDelete([row.id]);
              setSelected((current) => current.filter((id) => id !== row.id));
            }}
          >
            <Trash2 size={14} />
          </Button>
        </span>
      ),
    },
  ];

  const measureKey = spec.measure?.key;
  const measureTotal = measureKey
    ? filtered.reduce((sum, row) => sum + Number(row[measureKey] ?? 0), 0)
    : 0;

  return (
    <Card>
      {selected.length > 0 ? (
        <div className="border-line bg-accent-soft flex flex-wrap items-center gap-2 border-b px-4 py-2.5 sm:px-5">
          <span className="text-ink text-xs font-semibold">
            {selected.length} selected
          </span>
          <select
            aria-label="Set status for selected records"
            defaultValue=""
            onChange={(event) => {
              if (!event.target.value) return;
              onStatus(selected, event.target.value);
              event.target.value = "";
              setSelected([]);
            }}
            className="bg-surface border-line text-ink h-8 rounded-lg border px-2 text-xs outline-none"
          >
            <option value="">Change status…</option>
            {spec.statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              onDelete(selected);
              setSelected([]);
            }}
          >
            <Trash2 size={14} />
            Delete
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
            <X size={14} />
            Clear
          </Button>
        </div>
      ) : null}

      <DataTable
        caption={title}
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        onRowClick={onView}
        searchPlaceholder={`Search ${plural(spec.entity).toLowerCase()}…`}
        toolbar={
          <>
            <FilterSelect
              label="Status"
              value={statusFilter}
              options={spec.statuses}
              onChange={setStatusFilter}
            />
            {categoryField ? (
              <FilterSelect
                label={categoryField.label}
                value={categoryFilter}
                options={categoryOptions}
                onChange={setCategoryFilter}
              />
            ) : null}
            <Button size="sm" variant="ghost" onClick={toggleAll}>
              <CheckSquare size={14} />
              <span className="hidden sm:inline">Select all</span>
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => exportRowsToCsv(spec, filtered, exportName)}
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" variant="primary" onClick={onCreate}>
              <Plus size={14} />
              <span className="hidden sm:inline">New {spec.entity}</span>
            </Button>
          </>
        }
        footer={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCell label="Showing" value={`${number(filtered.length)} of ${number(rows.length)}`} />
            {spec.measure ? (
              <SummaryCell
                label={`Total ${spec.measure.label}`}
                value={
                  spec.measure.kind === "money"
                    ? compactCurrency(measureTotal)
                    : `${number(Math.round(measureTotal))}${spec.measure.unit ? ` ${spec.measure.unit}` : ""}`
                }
                tone="good"
              />
            ) : null}
            <SummaryCell
              label="Filters"
              value={
                statusFilter || categoryFilter
                  ? [statusFilter, categoryFilter].filter(Boolean).join(" · ")
                  : "None applied"
              }
            />
            <div className="flex items-end">
              {statusFilter || categoryFilter ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setStatusFilter("");
                    setCategoryFilter("");
                  }}
                >
                  <X size={13} />
                  Reset filters
                </Button>
              ) : (
                <Badge tone="accent">Live demo data</Badge>
              )}
            </div>
          </div>
        }
      />
    </Card>
  );
}

function SummaryCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good";
}) {
  return (
    <div className="min-w-0">
      <p className="text-ink-3 text-[0.625rem]">{label}</p>
      <p
        className={cn(
          "text-ink tabular mt-0.5 truncate text-sm font-semibold",
          tone === "good" && "text-good",
        )}
      >
        {value}
      </p>
    </div>
  );
}
