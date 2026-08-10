"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Read-and-write access to a `localStorage` key, modelled as an external store.
 *
 * The naive version of this is `useState` + a `useEffect` that reads storage on
 * mount — but that is a setState-in-effect, which triggers a second render pass
 * on every mount and is flagged by React's own lint rules. `useSyncExternalStore`
 * is the intended primitive: it reads the browser value during render on the
 * client and falls back to `serverValue` during SSR, so the server HTML and the
 * first client render always agree.
 */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  // Keep tabs in sync with each other.
  window.addEventListener("storage", onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Private mode or blocked storage — behave as if nothing was stored.
    return null;
  }
}

function write(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Non-fatal: the value still applies for this session via `emit()`.
  }
  emit();
}

/**
 * `serverValue` is what SSR renders and what the client renders on its first
 * pass, so it must be the app's documented default.
 */
export function useStoredValue<T extends string>(
  key: string,
  serverValue: T,
  isValid: (value: string) => value is T,
): [T, (next: T) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const stored = read(key);
      return stored !== null && isValid(stored) ? stored : serverValue;
    },
    () => serverValue,
  );

  const setValue = useCallback(
    (next: T) => {
      write(key, next);
    },
    [key],
  );

  return [value, setValue];
}

/** Boolean flavour for on/off preferences such as the collapsed sidebar. */
export function useStoredFlag(
  key: string,
  serverValue = false,
): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key) === "1",
    () => serverValue,
  );

  const setValue = useCallback(
    (next: boolean) => {
      write(key, next ? "1" : "0");
    },
    [key],
  );

  return [value, setValue];
}
