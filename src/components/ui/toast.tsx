"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CircleAlert, CircleCheck, Info, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ToastTone = "success" | "info" | "warning";

export interface Toast {
  id: number;
  message: string;
  detail?: string;
  tone: ToastTone;
}

const TONE_ICON = {
  success: CircleCheck,
  info: Info,
  warning: CircleAlert,
} as const;

const TONE_CLASS: Record<ToastTone, string> = {
  success: "text-good",
  info: "text-info",
  warning: "text-warning",
};

const TONE_STYLE: Record<ToastTone, string> = {
  success: "border-[var(--status-good)] text-good",
  info: "border-[var(--status-info)] text-info",
  warning: "border-[var(--status-warning)] text-warning",
};

/* ── Provider-based queue ─────────────────────────────────────────────────
 * Used by the workspace engine, whose surfaces sit deep enough that threading
 * a queue down through props would be noise.
 * ------------------------------------------------------------------------ */

interface ToastApi {
  push: (message: string, options?: { detail?: string; tone?: ToastTone }) => void;
}

const ToastContext = createContext<ToastApi>({ push: () => {} });

/** Confirms an action happened — the app has no backend, so this is the receipt. */
export function useToast(): ToastApi {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback<ToastApi["push"]>(
    (message, options) => {
      const id = nextId.current;
      nextId.current += 1;

      setToasts((current) => [
        ...current.slice(-3),
        { id, message, detail: options?.detail, tone: options?.tone ?? "success" },
      ]);

      // Auto-dismiss is a timer against an external system, not render state.
      window.setTimeout(() => dismiss(id), 3_600);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
      >
        {toasts.map((toast) => {
          const Icon = TONE_ICON[toast.tone];
          return (
            <div
              key={toast.id}
              className="bg-surface border-line shadow-float animate-rise pointer-events-auto flex items-start gap-2.5 rounded-lg border px-3.5 py-3"
            >
              <Icon
                size={16}
                className={cn("mt-0.5 shrink-0", TONE_CLASS[toast.tone])}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-ink text-xs font-semibold">{toast.message}</p>
                {toast.detail ? (
                  <p className="text-ink-3 mt-0.5 text-[0.6875rem] leading-snug">
                    {toast.detail}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="text-ink-3 hover:text-ink shrink-0 rounded p-0.5"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/* ── Local queue ──────────────────────────────────────────────────────────
 * Used by spec workspaces, which render their own stack.
 * ------------------------------------------------------------------------ */

/**
 * A tiny local toast queue. Deliberately not a global provider — each workspace
 * owns its own feedback stack, so nothing leaks between routes.
 */
export function useToasts(timeout = 3200) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const timers = useRef<number[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: ToastTone = "success") => {
      counter.current += 1;
      const id = counter.current;
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      const timer = window.setTimeout(() => dismiss(id), timeout);
      timers.current.push(timer);
    },
    [dismiss, timeout],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const timer of pending) window.clearTimeout(timer);
    };
  }, []);

  return { toasts, push, dismiss };
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((toast) => {
        const Icon = TONE_ICON[toast.tone];
        return (
          <div
            key={toast.id}
            className={cn(
              "bg-surface shadow-float pointer-events-auto flex items-start gap-2.5 rounded-xl border border-l-[3px] px-3.5 py-3",
              "border-line",
              TONE_STYLE[toast.tone],
            )}
          >
            <Icon size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-ink min-w-0 flex-1 text-xs leading-relaxed">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="text-ink-3 hover:text-ink shrink-0 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
