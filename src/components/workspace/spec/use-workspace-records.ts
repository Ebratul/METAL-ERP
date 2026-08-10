"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  commit,
  getStore,
  mutate,
  nextSequence as advanceSequence,
  readServerSnapshot,
  readSnapshot,
  resetStore,
  subscribe,
} from "@/lib/workspaces/record-store";
import type { RecordRow, ResolvedSpec } from "@/lib/workspaces/types";

/**
 * The workspace's record store.
 *
 * Everything a spec workspace does — create, edit, delete, bulk status change —
 * lands here, and every chart reads back from the same array. There is no
 * backend in this build, so the rows live in `localStorage` under a key derived
 * from the route: fill in a form, reload the page, and the record is still
 * there. The header's reload control clears the key and restores the demo data.
 */
export function useWorkspaceRecords(spec: ResolvedSpec, seedKey: string) {
  const store = useMemo(() => getStore(spec, seedKey), [spec, seedKey]);

  const rows = useSyncExternalStore(
    useCallback((onStoreChange) => subscribe(store, onStoreChange), [store]),
    useCallback(() => readSnapshot(store), [store]),
    useCallback(() => readServerSnapshot(store), [store]),
  );

  const nextSequence = useCallback(() => advanceSequence(store), [store]);

  const create = useCallback(
    (row: RecordRow) => {
      mutate(store, (current) => [row, ...current]);
    },
    [store],
  );

  const update = useCallback(
    (id: string, next: RecordRow) => {
      mutate(store, (current) =>
        current.map((row) => (row.id === id ? { ...next, id } : row)),
      );
    },
    [store],
  );

  const remove = useCallback(
    (ids: string[]) => {
      const doomed = new Set(ids);
      mutate(store, (current) => current.filter((row) => !doomed.has(row.id)));
    },
    [store],
  );

  const setStatus = useCallback(
    (ids: string[], status: string) => {
      const targets = new Set(ids);
      mutate(store, (current) =>
        current.map((row) =>
          targets.has(row.id) ? { ...row, [spec.statusField.key]: status } : row,
        ),
      );
    },
    [store, spec.statusField.key],
  );

  /** Move a record one step along the status pipeline. */
  const advance = useCallback(
    (id: string, direction: 1 | -1 = 1) => {
      mutate(store, (current) =>
        current.map((row) => {
          if (row.id !== id) return row;
          const index = spec.statuses.indexOf(String(row[spec.statusField.key]));
          const nextIndex = Math.min(
            spec.statuses.length - 1,
            Math.max(0, (index === -1 ? 0 : index) + direction),
          );
          return { ...row, [spec.statusField.key]: spec.statuses[nextIndex] };
        }),
      );
    },
    [store, spec.statusField.key, spec.statuses],
  );

  /** Overwrite the whole set — used by bulk actions and imports. */
  const replaceAll = useCallback(
    (next: RecordRow[]) => {
      commit(store, next);
    },
    [store],
  );

  const reset = useCallback(() => {
    resetStore(store);
  }, [store]);

  return useMemo(
    () => ({
      rows,
      create,
      update,
      remove,
      setStatus,
      advance,
      replaceAll,
      reset,
      nextSequence,
    }),
    [rows, create, update, remove, setStatus, advance, replaceAll, reset, nextSequence],
  );
}
