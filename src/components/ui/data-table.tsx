"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Download,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { sanitizeQuery } from "@/lib/security/sanitize";
import { Button } from "./button";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  /** Tailwind width class, e.g. "w-40". */
  width?: string;
  sortable?: boolean;
  /** Raw comparable/searchable value. Falls back to `row[key]`. */
  accessor?: (row: T) => string | number;
  /** Cell renderer. Falls back to the accessor value as text. */
  render?: (row: T) => ReactNode;
  /** Hide below the `md` breakpoint to keep narrow screens readable. */
  hideOnMobile?: boolean;
}

/** Multi-select support. Omit it and the checkbox column is not rendered. */
export interface TableSelection {
  selected: ReadonlySet<string>;
  onToggle: (id: string) => void;
  /** Called with every id on the current page. */
  onToggleAll: (ids: string[]) => void;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  /** Stable React key per row. */
  rowKey: (row: T, index: number) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  /** Extra controls rendered in the toolbar (filters, export). */
  toolbar?: ReactNode;
  /** Sticky summary strip under the table. */
  footer?: ReactNode;
  emptyMessage?: string;
  className?: string;
  /** Caption for screen readers describing what the table contains. */
  caption: string;
  dense?: boolean;
  onRowClick?: (row: T) => void;
  /** Renders the Export button when supplied. */
  onExport?: () => void;
  /** Renders the column-filter button when supplied. */
  onFilter?: () => void;
  /** Owns the search box instead of the table's internal state. */
  query?: string;
  onQueryChange?: (value: string) => void;
  selection?: TableSelection;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

function rawValue<T>(row: T, column: Column<T>): string | number {
  if (column.accessor) return column.accessor(row);
  const value = (row as Record<string, unknown>)[column.key];
  if (typeof value === "number" || typeof value === "string") return value;
  return "";
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  searchable = true,
  searchPlaceholder = "Search…",
  pageSize: initialPageSize = 10,
  toolbar,
  footer,
  emptyMessage = "Nothing matches the current filters.",
  className,
  caption,
  dense = false,
  onRowClick,
  onExport,
  onFilter,
  query: controlledQuery,
  onQueryChange,
  selection,
}: DataTableProps<T>) {
  const [internalQuery, setInternalQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const searchId = useId();

  // The search box is controlled by the caller when it also drives filters
  // above the table; otherwise the table owns it.
  const query = controlledQuery ?? internalQuery;
  const setQuery = onQueryChange ?? setInternalQuery;

  const filtered = useMemo(() => {
    // A controlled query means the caller has already filtered `rows`.
    if (onQueryChange) return rows;
    // The query is only ever used for in-memory string comparison and is
    // rendered as text, never as markup — sanitising here keeps control
    // characters out of the comparison and out of any echoed label.
    const q = sanitizeQuery(query).toLowerCase();
    if (!q) return rows;
    return rows.filter((row) =>
      columns.some((column) =>
        String(rawValue(row, column)).toLowerCase().includes(q),
      ),
    );
  }, [query, rows, columns, onQueryChange]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const column = columns.find((c) => c.key === sort.key);
    if (!column) return filtered;

    return [...filtered].sort((a, b) => {
      const av = rawValue(a, column);
      const bv = rawValue(b, column);
      let result: number;
      if (typeof av === "number" && typeof bv === "number") result = av - bv;
      else result = String(av).localeCompare(String(bv), "en");
      return sort.dir === "asc" ? result : -result;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const pageIds = pageRows.map((row, index) => rowKey(row, index));

  function toggleSort(key: string) {
    setPage(0);
    setSort((current) => {
      if (!current || current.key !== key) return { key, dir: "asc" };
      if (current.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {(searchable || toolbar) && (
        <div className="border-line flex flex-wrap items-center gap-2 border-b px-4 py-3 sm:px-5">
          {searchable ? (
            <div className="relative min-w-[12rem] flex-1 sm:max-w-xs">
              <Search
                size={15}
                className="text-ink-3 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(0);
                }}
                placeholder={searchPlaceholder}
                aria-label={`Search ${caption}`}
                maxLength={120}
                autoComplete="off"
                spellCheck={false}
                className="bg-surface-2 border-line text-ink placeholder:text-ink-3 h-9 w-full rounded-lg border pr-3 pl-9 text-sm outline-none focus:border-[var(--border-accent)]"
              />
            </div>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            {toolbar}
            {onFilter ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={onFilter}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal size={14} />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            ) : null}
            {onExport ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={onExport}
                aria-label="Export table data"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export</span>
              </Button>
            ) : null}
          </div>
        </div>
      )}

      {/* Wide tables scroll inside their own container — the page body never
          scrolls horizontally. */}
      <div className="scroll-thin overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-surface-2 border-line border-b">
              {selection ? (
                <th scope="col" className="w-10 py-2.5 pr-2 pl-4 sm:pl-5">
                  <input
                    type="checkbox"
                    className="accent-accent size-3.5 cursor-pointer align-middle"
                    aria-label="Select all rows on this page"
                    checked={
                      pageIds.length > 0 &&
                      pageIds.every((id) => selection.selected.has(id))
                    }
                    onChange={() => selection.onToggleAll(pageIds)}
                  />
                </th>
              ) : null}
              {columns.map((column) => {
                const isSorted = sort?.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      isSorted
                        ? sort.dir === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
                    className={cn(
                      "text-ink-3 px-3 py-2.5 text-[0.6875rem] font-semibold tracking-wide uppercase first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5",
                      column.align === "right" && "text-right",
                      column.align === "center" && "text-center",
                      column.align !== "right" &&
                        column.align !== "center" &&
                        "text-left",
                      column.width,
                      column.hideOnMobile && "hidden md:table-cell",
                    )}
                  >
                    {column.sortable === false ? (
                      column.header
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className={cn(
                          "hover:text-ink inline-flex items-center gap-1 transition-colors",
                          isSorted && "text-ink",
                          column.align === "right" && "flex-row-reverse",
                        )}
                      >
                        {column.header}
                        <ChevronsUpDown
                          size={12}
                          className={cn("shrink-0", isSorted ? "opacity-100" : "opacity-40")}
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selection ? 1 : 0)}
                  className="text-ink-3 px-4 py-12 text-center text-sm"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pageRows.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-line hover:bg-surface-2/60 border-b transition-colors last:border-b-0",
                    onRowClick && "cursor-pointer",
                    selection?.selected.has(rowKey(row, index)) && "bg-accent-soft/40",
                  )}
                >
                  {selection ? (
                    <td className="w-10 py-2 pr-2 pl-4 sm:pl-5">
                      <input
                        type="checkbox"
                        className="accent-accent size-3.5 cursor-pointer align-middle"
                        aria-label={`Select row ${index + 1}`}
                        checked={selection.selected.has(rowKey(row, index))}
                        onClick={(event) => event.stopPropagation()}
                        onChange={() => selection.onToggle(rowKey(row, index))}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "text-ink-2 px-3 first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5",
                        dense ? "py-2" : "py-3",
                        column.align === "right" && "tabular text-right",
                        column.align === "center" && "text-center",
                        column.hideOnMobile && "hidden md:table-cell",
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : String(rawValue(row, column))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {footer ? (
        <div className="border-line border-t px-4 py-3 sm:px-5">{footer}</div>
      ) : null}

      <div className="border-line flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 sm:px-5">
        <div className="text-ink-3 flex items-center gap-2 text-xs">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(0);
            }}
            aria-label="Rows per page"
            className="bg-surface-2 border-line text-ink h-7 rounded-md border px-2 text-xs outline-none"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>
            of <span className="tabular text-ink-2">{sorted.length}</span> entries
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            aria-label="Previous page"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft size={15} />
          </Button>
          <span className="text-ink-2 tabular px-2 text-xs">
            {safePage + 1} / {pageCount}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            aria-label="Next page"
            disabled={safePage >= pageCount - 1}
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          >
            <ChevronRight size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
}
