import { generateRows } from "./dsl";
import type { RecordRow, ResolvedSpec } from "./types";

/**
 * Persistent record store for spec workspaces.
 *
 * This build ships without a backend, so `localStorage` *is* the database: a
 * record created, edited or deleted in any workspace is written under its own
 * key and read back on the next visit. One store exists per workspace route.
 *
 * Hydration matters here. The server renders the seeded demo dataset, so the
 * store exposes two snapshots — `seeded` for the server and the hydrating
 * client render, and the persisted array for every render after that. React's
 * `useSyncExternalStore` picks the right one at the right moment, which is why
 * the hook below reads through this module rather than through `useState`.
 */

const PREFIX = "metal-erp:records:";

interface Payload {
  /** Field keys and statuses the rows were written against. */
  signature: string;
  sequence: number;
  rows: RecordRow[];
}

interface Store {
  storageKey: string;
  signature: string;
  /** Deterministic demo rows — what the server rendered. */
  seeded: RecordRow[];
  /** Cached live snapshot. `null` until first read on the client. */
  snapshot: RecordRow[] | null;
  sequence: number;
  listeners: Set<() => void>;
}

const stores = new Map<string, Store>();

/**
 * Rows written against an older version of the spec would render as empty
 * columns, so the signature is stored alongside them and checked on read.
 */
function signatureOf(spec: ResolvedSpec): string {
  return `${spec.fields.map((field) => field.key).join(",")}|${spec.statuses.join(",")}`;
}

export function getStore(spec: ResolvedSpec, seedKey: string): Store {
  const existing = stores.get(seedKey);
  const signature = signatureOf(spec);
  if (existing && existing.signature === signature) return existing;

  const store: Store = {
    storageKey: `${PREFIX}${seedKey}`,
    signature,
    seeded: generateRows(spec, seedKey),
    snapshot: null,
    sequence: 0,
    listeners: new Set(),
  };
  stores.set(seedKey, store);
  return store;
}

function isRecordRow(value: unknown): value is RecordRow {
  if (typeof value !== "object" || value === null) return false;
  const id = (value as { id?: unknown }).id;
  return typeof id === "string" && id.length > 0;
}

function load(store: Store): RecordRow[] | null {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(store.storageKey);
  } catch {
    // Private mode or blocked storage — fall back to the demo dataset.
    return null;
  }
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw) as Partial<Payload>;
    if (payload.signature !== store.signature) return null;
    if (!Array.isArray(payload.rows) || !payload.rows.every(isRecordRow)) return null;
    store.sequence = typeof payload.sequence === "number" ? payload.sequence : 0;
    return payload.rows;
  } catch {
    return null;
  }
}

function save(store: Store, rows: RecordRow[]) {
  const payload: Payload = {
    signature: store.signature,
    sequence: store.sequence,
    rows,
  };
  try {
    window.localStorage.setItem(store.storageKey, JSON.stringify(payload));
  } catch {
    // Quota exceeded or blocked — the rows still apply for this session.
  }
}

function emit(store: Store) {
  for (const listener of store.listeners) listener();
}

/** The live array. Stable between calls so `useSyncExternalStore` is happy. */
export function readSnapshot(store: Store): RecordRow[] {
  if (store.snapshot === null) {
    store.snapshot = load(store) ?? store.seeded;
  }
  return store.snapshot;
}

export function readServerSnapshot(store: Store): RecordRow[] {
  return store.seeded;
}

export function subscribe(store: Store, onStoreChange: () => void): () => void {
  store.listeners.add(onStoreChange);

  // Another tab writing the same workspace invalidates our cached snapshot.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== store.storageKey) return;
    store.snapshot = null;
    emit(store);
  };
  window.addEventListener("storage", onStorage);

  return () => {
    store.listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** Replace the rows, persist them and wake every subscriber. */
export function commit(store: Store, next: RecordRow[]) {
  store.snapshot = next;
  save(store, next);
  emit(store);
}

export function mutate(store: Store, update: (rows: RecordRow[]) => RecordRow[]) {
  commit(store, update(readSnapshot(store)));
}

/** Monotonic per-workspace counter, persisted so ids stay unique across reloads. */
export function nextSequence(store: Store): number {
  store.sequence += 1;
  save(store, readSnapshot(store));
  return store.sequence;
}

/** Throw away everything saved here and go back to the demo dataset. */
export function resetStore(store: Store) {
  try {
    window.localStorage.removeItem(store.storageKey);
  } catch {
    // Nothing persisted to clear — the in-memory reset below still applies.
  }
  store.sequence = 0;
  store.snapshot = store.seeded;
  emit(store);
}

export type { Store as RecordStore };
