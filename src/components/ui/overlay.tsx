"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";

/**
 * Modal and side-panel primitives.
 *
 * Both close on Escape and on a backdrop click, move focus into the panel on
 * open and hand it back to the trigger on close. Body scroll is locked while
 * one is open so the page behind cannot be reached with the wheel.
 */

function useDialogBehaviour(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    returnFocus.current = document.activeElement as HTMLElement | null;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTarget = panelRef.current?.querySelector<HTMLElement>(
      "input, select, textarea, button, [tabindex]:not([tabindex='-1'])",
    );
    focusTarget?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocus.current?.focus?.();
    };
  }, [open, onClose]);

  return panelRef;
}

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Wider shell for multi-column forms. */
  size?: "md" | "lg";
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const panelRef = useDialogBehaviour(open, onClose);
  const titleId = useId();

  if (!open) return null;

  return (
    <div
      className="bg-overlay fixed inset-0 z-50 flex items-end justify-center p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "bg-surface border-line shadow-float flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border sm:rounded-2xl",
          size === "lg" ? "sm:max-w-3xl" : "sm:max-w-xl",
        )}
      >
        <header className="border-line flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-ink text-base font-semibold">
              {title}
            </h2>
            {description ? (
              <p className="text-ink-3 mt-1 text-xs">{description}</p>
            ) : null}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </header>

        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer ? (
          <footer className="border-line bg-surface-2/50 flex flex-wrap items-center justify-end gap-2 border-t px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

/** Right-hand detail panel — the record inspector. */
export function Drawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: DrawerProps) {
  const panelRef = useDialogBehaviour(open, onClose);
  const titleId = useId();

  if (!open) return null;

  return (
    <div
      className="bg-overlay fixed inset-0 z-50 flex justify-end"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-surface border-line shadow-float flex h-full w-full max-w-[30rem] flex-col overflow-hidden border-l"
      >
        <header className="border-line flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-ink truncate text-base font-semibold">
              {title}
            </h2>
            {subtitle ? (
              <p className="text-ink-3 mt-1 truncate text-xs">{subtitle}</p>
            ) : null}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0"
            aria-label="Close panel"
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </header>

        <div className="scroll-thin min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>

        {footer ? (
          <footer className="border-line bg-surface-2/50 flex flex-wrap items-center gap-2 border-t px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: "danger" | "primary";
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  tone = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={tone === "danger" ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-ink-2 text-sm leading-relaxed">{message}</p>
    </Modal>
  );
}
