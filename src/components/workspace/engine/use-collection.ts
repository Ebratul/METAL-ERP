"use client";

import { useCallback, useMemo, useState } from "react";
import type { Dataset } from "@/lib/data/dataset-types";
import { generateRows, type CellValue, type Row } from "@/lib/data/collection";
import { DEMO_TODAY } from "@/lib/data/rng";
import { sanitizeQuery } from "@/lib/security/sanitize";

const DAY_MS = 86_400_000;

export interface Collection {
  /** Every record held by the workspace, newest first. */
  rows: Row[];
  /** Rows left after the search box and the facet filters. */
  filtered: Row[];
  query: string;
  setQuery: (value: string) => void;
  facets: Record<string, string>;
  setFacet: (key: string, value: string) => void;
  /** Date window in days around the demo date; `null` shows everything. */
  windowDays: number | null;
  setWindowDays: (days: number | null) => void;
  activeFilterCount: number;
  clearFilters: () => void;
  create: (values: Row) => Row;
  update: (id: string, values: Partial<Row>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  duplicate: (id: string) => void;
  setCell: (id: string, key: string, value: CellValue) => void;
  reset: () => void;
}

/**
 * Local state for one workspace's records.
 *
 * Rows are seeded from the dataset on first render and then owned entirely by
 * the browser — create, edit, delete and status changes all mutate this array,
 * which is what makes the KPIs and charts above the table move with the data.
 */
export function useCollection(dataset: Dataset, seedKey: string): Collection {
  const seed = useMemo(() => generateRows(dataset, seedKey), [dataset, seedKey]);

  const [rows, setRows] = useState<Row[]>(seed);
  const [query, setQuery] = useState("");
  const [facets, setFacets] = useState<Record<string, string>>({});
  const [windowDays, setWindowDays] = useState<number | null>(null);

  const setFacet = useCallback((key: string, value: string) => {
    setFacets((current) => ({ ...current, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFacets({});
    setQuery("");
  }, []);

  const filtered = useMemo(() => {
    const clean = sanitizeQuery(query).toLowerCase();
    const dateKey = dataset.dateKey;

    return rows.filter((row) => {
      for (const [key, value] of Object.entries(facets)) {
        if (value && value !== "all" && String(row[key]) !== value) return false;
      }

      if (windowDays !== null && dateKey) {
        const iso = String(row[dateKey] ?? "");
        if (iso.length >= 10) {
          const distance =
            Math.abs(Date.parse(iso) - DEMO_TODAY.getTime()) / DAY_MS;
          if (distance > windowDays) return false;
        }
      }

      if (!clean) return true;
      return Object.values(row).some((cell) =>
        String(cell).toLowerCase().includes(clean),
      );
    });
  }, [rows, query, facets, windowDays, dataset.dateKey]);

  const activeFilterCount =
    Object.values(facets).filter((value) => value && value !== "all").length +
    (query.trim() ? 1 : 0);

  const create = useCallback((values: Row) => {
    const record: Row = {
      ...values,
      id: `local-${Date.now().toString(36)}-${Math.round(performance.now())}`,
    };
    setRows((current) => [record, ...current]);
    return record;
  }, []);

  const update = useCallback((id: string, values: Partial<Row>) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...values, id } : row)),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setRows((current) => current.filter((row) => row.id !== id));
  }, []);

  const removeMany = useCallback((ids: string[]) => {
    const doomed = new Set(ids);
    setRows((current) => current.filter((row) => !doomed.has(row.id)));
  }, []);

  const duplicate = useCallback((id: string) => {
    setRows((current) => {
      const source = current.find((row) => row.id === id);
      if (!source) return current;
      const copy: Row = {
        ...source,
        id: `copy-${id}-${current.length}`,
        code: `${String(source.code ?? "COPY")}-C`,
      };
      const index = current.findIndex((row) => row.id === id);
      return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)];
    });
  }, []);

  const setCell = useCallback((id: string, key: string, value: CellValue) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    );
  }, []);

  const reset = useCallback(() => {
    setRows(seed);
    setFacets({});
    setQuery("");
    setWindowDays(null);
  }, [seed]);

  return {
    rows,
    filtered,
    query,
    setQuery,
    facets,
    setFacet,
    windowDays,
    setWindowDays,
    activeFilterCount,
    clearFilters,
    create,
    update,
    remove,
    removeMany,
    duplicate,
    setCell,
    reset,
  };
}
