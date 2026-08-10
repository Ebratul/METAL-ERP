"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "./button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Buttons pinned to the bottom of the dialog. */
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
  /** Slides in from the right instead of centring — used for detail views. */
  variant?: "dialog" | "drawer";
}

const SIZE: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

/**
 * A modal that mounts only while open, so its content starts fresh every time
 * and there is no stale state to reset. Escape closes it, the backdrop closes
 * it, and focus moves into the panel on open.
 */
export function Modal(props: ModalProps) {
  if (!props.open) return null;
  return <ModalPanel {...props} />;
}

function ModalPanel({
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  variant = "dialog",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex px-4",
        variant === "drawer"
          ? "items-stretch justify-end px-0"
          : "items-start justify-center pt-[7vh]",
      )}
      role="presentation"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <button
        type="button"
        aria-label={`Close ${title}`}
        onClick={onClose}
        className="bg-overlay absolute inset-0 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "bg-surface border-line shadow-float relative flex w-full flex-col overflow-hidden outline-none",
          variant === "drawer"
            ? "animate-rise h-full max-w-lg border-l"
            : cn("animate-rise max-h-[86vh] rounded-xl border", SIZE[size]),
        )}
      >
        <header className="border-line flex items-start justify-between gap-3 border-b px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-ink truncate text-sm font-semibold">{title}</h2>
            {subtitle ? (
              <p className="text-ink-3 mt-0.5 truncate text-xs">{subtitle}</p>
            ) : null}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="size-8 shrink-0"
            onClick={onClose}
            aria-label="Close"
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

/** A confirmation step for destructive actions. */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Delete",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-ink-2 text-sm leading-relaxed">{message}</p>
    </Modal>
  );
}
