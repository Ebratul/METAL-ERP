"use client";

import { useCallback, useState } from "react";
import {
  FileText,
  FolderDown,
  Printer,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Segmented, Tabs, type TabItem } from "@/components/ui/tabs";
import { ToastStack, useToasts } from "@/components/ui/toast";
import {
  buildPiDocument,
  blankPiDocument,
  clonePiDocument,
  defaultPiDocument,
  recalcPiDocument,
  type PiDocument,
} from "@/lib/pi/document";
import { DEFAULT_PI_OPTIONS, type PiPrintOptions } from "@/lib/pi/options";
import { getWorkspaceSpec } from "@/lib/workspaces/catalog";
import { resolveSpec } from "@/lib/workspaces/dsl";
import { useWorkspaceRecords } from "@/components/workspace/spec/use-workspace-records";
import { PiDocumentSheet } from "./pi-document";
import { PiPrintOverlay } from "./pi-print-overlay";
import {
  ClausesPanel,
  DesignPanel,
  DocumentPanel,
  GoodsPanel,
  MoneyPanel,
  PartiesPanel,
  TermsPanel,
} from "./pi-builder-panels";

/**
 * The PI studio — compose a proforma invoice field by field and watch the
 * printed sheet redraw as you type.
 *
 * The register prints whatever a stored record happens to hold; this is the
 * surface for the PI that has to say something the register cannot express —
 * a second item, a re-worded clause, a buyer's own house colour, a bank copy
 * with the marks stripped off. It starts from the house specimen, a blank
 * sheet, or any PI already on the register, and ends at the browser's print
 * dialog, where "Save as PDF" produces the file.
 *
 * There is no backend in this build, so a work-in-progress PI is kept in
 * `localStorage` under an explicit Save — never silently, so the studio always
 * opens on a document the user recognises.
 */

const DRAFT_KEY = "smart-erp:pi-studio-draft";

/** The register the "load from PI" picker reads. */
const SOURCE_ROUTE = { module: "proforma-invoice", sub: "export-pi-entry" } as const;
const SOURCE_KEY = `${SOURCE_ROUTE.module}/${SOURCE_ROUTE.sub}`;

/*
 * Resolved once at module scope. `useWorkspaceRecords` keys its store on the
 * spec object, so a spec rebuilt on every render would rebuild the store with
 * it. The fallback only exists to keep the type honest — the PI entry spec is
 * part of the shipped catalogue.
 */
const SOURCE_SPEC = resolveSpec(
  getWorkspaceSpec(SOURCE_ROUTE.module, SOURCE_ROUTE.sub) ?? {
    entity: "Proforma Invoice",
    ref: "PI",
    fields: ["piNumber|PI Number|code|PI"],
    statuses: ["Draft"],
    rows: 0,
  },
);

const ZOOM_OPTIONS = [
  { value: "0.5", label: "50%" },
  { value: "0.65", label: "65%" },
  { value: "0.8", label: "80%" },
  { value: "1", label: "100%" },
];

/** "16-Jul-2026 03:25 PM" — the stamp the printed footer carries. */
function stampNow(): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(new Date())
    .replace(/(\d{2}) (\w{3}) (\d{4})/, "$1-$2-$3");
}

interface StoredDraft {
  doc: PiDocument;
  options: PiPrintOptions;
}

function readDraft(): StoredDraft | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredDraft>;
    if (!parsed.doc || !Array.isArray(parsed.doc.lines)) return null;
    return {
      doc: recalcPiDocument(parsed.doc as PiDocument),
      options: { ...DEFAULT_PI_OPTIONS, ...parsed.options },
    };
  } catch {
    // Corrupt or blocked storage — behave as if nothing was saved.
    return null;
  }
}

export function PiBuilder() {
  const [doc, setDoc] = useState<PiDocument>(() => defaultPiDocument());
  const [options, setOptions] = useState<PiPrintOptions>(DEFAULT_PI_OPTIONS);
  const [zoom, setZoom] = useState("0.65");
  const [printing, setPrinting] = useState(false);
  const { toasts, push, dismiss } = useToasts();

  // The PI register, read straight from the same store the workspace writes to,
  // so a PI raised on that screen is offered here without a round trip.
  const source = useWorkspaceRecords(SOURCE_SPEC, SOURCE_KEY);

  const patchDoc = useCallback((patch: Partial<PiDocument>) => {
    setDoc((previous) => recalcPiDocument({ ...previous, ...patch }));
  }, []);

  /*
   * Changing a block toggle makes the sheet no longer any of the named
   * templates, so the preset selection falls back to "custom". Re-colouring
   * does not — every template is offered in every house colour.
   */
  const patchOptions = useCallback((patch: Partial<PiPrintOptions>) => {
    setOptions((previous) => {
      const next = { ...previous, ...patch };
      const colourOnly = Object.keys(patch).every(
        (key) => key === "accent" || key === "accentBright",
      );
      return colourOnly ? next : { ...next, template: "custom" };
    });
  }, []);

  const loadRecord = useCallback(
    (id: string) => {
      const row = source.rows.find((entry) => entry.id === id);
      if (!row) return;

      setDoc(clonePiDocument(buildPiDocument(row, SOURCE_SPEC, { printedAt: doc.printedAt })));
      push(`Loaded ${String(row[SOURCE_SPEC.codeField.key] ?? "PI")} into the studio`);
    },
    [source.rows, doc.printedAt, push],
  );

  const saveDraft = useCallback(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ doc, options }));
      push("Draft saved in this browser");
    } catch {
      push("This browser refused to store the draft", "warning");
    }
  }, [doc, options, push]);

  const restoreDraft = useCallback(() => {
    const draft = readDraft();
    if (!draft) {
      push("No saved draft found in this browser", "warning");
      return;
    }
    setDoc(draft.doc);
    setOptions(draft.options);
    push("Saved draft restored");
  }, [push]);

  const openPrint = useCallback(() => {
    // Stamp the footer on the way to the dialog, unless the user typed one.
    if (!doc.printedAt) patchDoc({ printedAt: stampNow() });
    setPrinting(true);
  }, [doc.printedAt, patchDoc]);

  const tabs: TabItem[] = [
    { id: "document", label: "Document", content: <DocumentPanel doc={doc} set={patchDoc} /> },
    { id: "parties", label: "Parties", content: <PartiesPanel doc={doc} set={patchDoc} /> },
    {
      id: "terms",
      label: "Terms Band",
      badge: doc.terms.length,
      content: <TermsPanel doc={doc} set={patchDoc} />,
    },
    {
      id: "goods",
      label: "Goods",
      badge: doc.lines.length,
      content: <GoodsPanel doc={doc} set={patchDoc} />,
    },
    { id: "money", label: "Money & Bank", content: <MoneyPanel doc={doc} set={patchDoc} /> },
    {
      id: "clauses",
      label: "Clauses",
      badge: doc.conditions.length,
      content: <ClausesPanel doc={doc} set={patchDoc} />,
    },
    {
      id: "design",
      label: "Design",
      content: (
        <DesignPanel options={options} set={patchOptions} replace={setOptions} />
      ),
    },
  ];

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
        <Card className="min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDoc(defaultPiDocument(doc.printedAt))}
            >
              <Sparkles size={14} />
              Specimen PI
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setDoc(blankPiDocument(doc.printedAt))}
            >
              <FileText size={14} />
              Blank PI
            </Button>

            <label className="sr-only" htmlFor="pi-studio-source">
              Load from the PI register
            </label>
            <select
              id="pi-studio-source"
              value=""
              onChange={(event) => loadRecord(event.target.value)}
              className="bg-surface-2 border-line text-ink-2 h-8 max-w-[16rem] rounded-lg border px-2 text-xs outline-none focus:border-[var(--border-accent)]"
            >
              <option value="">Load from PI register…</option>
              {source.rows.slice(0, 40).map((row) => (
                <option key={row.id} value={row.id}>
                  {String(row[SOURCE_SPEC.codeField.key] ?? row.id)} ·{" "}
                  {String(row.buyer ?? "")}
                </option>
              ))}
            </select>

            <span className="flex-1" />

            <Button variant="ghost" size="sm" onClick={restoreDraft}>
              <RotateCcw size={14} />
              Restore
            </Button>
            <Button variant="ghost" size="sm" onClick={saveDraft}>
              <Save size={14} />
              Save draft
            </Button>
          </div>

          <Tabs items={tabs} ariaLabel="Proforma invoice sections" />
        </Card>

        <div className="no-print xl:w-[max-content]">
          <div className="xl:sticky xl:top-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <Segmented
                options={ZOOM_OPTIONS}
                value={zoom}
                onChange={setZoom}
                ariaLabel="Preview zoom"
              />
              <Button variant="primary" size="sm" onClick={openPrint}>
                <Printer size={14} />
                Print / Save as PDF
              </Button>
            </div>

            <div
              className="border-line bg-surface-2 max-h-[calc(100vh-9rem)] overflow-auto rounded-lg border p-3"
              aria-label="Live preview of the printed sheet"
            >
              {/*
                * `zoom` rather than a transform: it scales the layout box too,
                * so the scroll container sizes itself to whatever page height
                * the current set of blocks produces.
                */}
              <div style={{ zoom: Number(zoom) }}>
                <PiDocumentSheet doc={doc} options={options} />
              </div>
            </div>

            <p className="text-ink-3 mt-2 flex items-center gap-1.5 text-[0.6875rem]">
              <FolderDown size={12} aria-hidden="true" />
              Choose “Save as PDF” as the destination in the print dialog.
            </p>
          </div>
        </div>
      </div>

      <PiPrintOverlay
        doc={printing ? doc : null}
        options={options}
        open={printing}
        onClose={() => setPrinting(false)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
}
