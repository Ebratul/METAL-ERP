"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Printer, X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PiDocument } from "@/lib/pi/document";
import { DEFAULT_PI_OPTIONS, type PiPrintOptions } from "@/lib/pi/options";
import { PiDocumentSheet } from "./pi-document";

/**
 * Full-screen preview of the printed PI, with the browser's own print dialog
 * behind the Print button — which is also how a PDF is produced ("Save as PDF"
 * in the destination list). The sheet is portalled to `<body>` so the print
 * stylesheet can hide the application around it and leave the document alone.
 *
 * It takes a finished document rather than a record: the register builds one
 * from the row it is printing, the PI studio hands over the one being edited,
 * and neither needs to know how the other assembled it.
 */

const ZOOM_STEPS = [0.5, 0.65, 0.8, 1, 1.25];

/** A4 is 210mm ≈ 794px at 96dpi; the preview shrinks to fit narrower screens. */
const SHEET_WIDTH = 794;

function subscribeToResize(onStoreChange: () => void) {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

/**
 * Viewport width read as an external store rather than mirrored into state —
 * no effect, no cascading render, and SSR gets a stable desktop default.
 */
function useViewportWidth(): number {
  return useSyncExternalStore(
    subscribeToResize,
    () => window.innerWidth,
    () => SHEET_WIDTH + 64,
  );
}

export function PiPrintOverlay({
  doc,
  options = DEFAULT_PI_OPTIONS,
  open,
  onClose,
}: {
  doc: PiDocument | null;
  options?: PiPrintOptions;
  open: boolean;
  /** Must be stable — the overlay subscribes to it for the Escape key. */
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState<number | null>(null);
  const viewport = useViewportWidth();

  const fitScale = Math.min(1, Math.max(0.32, (viewport - 64) / SHEET_WIDTH));
  const scale = zoom ?? fitScale;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.dataset.printing = "pi";
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      delete document.body.dataset.printing;
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  // Only ever open from a user action, so `document` is always available here.
  if (!open || !doc || typeof document === "undefined") return null;

  const zoomIndex = ZOOM_STEPS.indexOf(scale);
  const stepFrom = zoomIndex === -1 ? ZOOM_STEPS.indexOf(1) : zoomIndex;

  return createPortal(
    <div id="pi-print-layer" className="fixed inset-0 z-[60]">
      <div
        className="no-print absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Print preview for ${doc.piNo}`}
        className="pi-print-scroll relative flex h-full flex-col overflow-y-auto"
      >
        <header className="no-print sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-neutral-900/90 px-4 py-2.5 backdrop-blur">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              Proforma Invoice — {doc.piNo}
            </h2>
            <p className="truncate text-[0.6875rem] text-neutral-400">
              {doc.buyer.name} · {doc.currency} {doc.grandTotal.toFixed(2)} · {doc.status}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-white/15 px-1 py-0.5">
              <button
                type="button"
                aria-label="Zoom out"
                className="rounded p-1 text-neutral-300 hover:bg-white/10 disabled:opacity-40"
                disabled={stepFrom === 0}
                onClick={() => setZoom(ZOOM_STEPS[Math.max(0, stepFrom - 1)])}
              >
                <ZoomOut size={15} />
              </button>
              <span className="w-10 text-center text-[0.6875rem] tabular-nums text-neutral-300">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                aria-label="Zoom in"
                className="rounded p-1 text-neutral-300 hover:bg-white/10 disabled:opacity-40"
                disabled={stepFrom === ZOOM_STEPS.length - 1}
                onClick={() =>
                  setZoom(ZOOM_STEPS[Math.min(ZOOM_STEPS.length - 1, stepFrom + 1)])
                }
              >
                <ZoomIn size={15} />
              </button>
            </div>

            <Button variant="primary" size="md" onClick={() => window.print()}>
              <Printer size={15} />
              Print / Save as PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close print preview"
              className="size-8 text-neutral-300 hover:bg-white/10"
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          </div>
        </header>

        <div className="pi-sheet-stage flex justify-center px-4 py-6">
          <div
            className="pi-sheet-scale origin-top shadow-2xl"
            style={{ transform: `scale(${scale})` }}
          >
            <PiDocumentSheet doc={doc} options={options} />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
