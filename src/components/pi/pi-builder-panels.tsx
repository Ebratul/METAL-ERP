"use client";

import { useId, type ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/form-controls";
import { cn } from "@/lib/utils/cn";
import { PI_CURRENCIES, type PiDocument, type PiLine } from "@/lib/pi/document";
import {
  PI_ACCENTS,
  PI_COPY_LABELS,
  PI_TEMPLATES,
  PI_WATERMARKS,
  applyPiTemplate,
  type PiPrintOptions,
} from "@/lib/pi/options";
import { PI_TERM_ICON_NAMES } from "./pi-document";

/**
 * The editing side of the PI studio — one panel per tab.
 *
 * These are dumb: each takes the document (or the print options) and a setter,
 * and every control writes straight back. All arithmetic lives in
 * `recalcPiDocument`, which the studio runs on every patch, so nothing here
 * ever has to know that a quantity feeds a line amount which feeds a total
 * which feeds the words under the grand total.
 */

export interface DocPanelProps {
  doc: PiDocument;
  set: (patch: Partial<PiDocument>) => void;
}

export interface OptionsPanelProps {
  options: PiPrintOptions;
  set: (patch: Partial<PiPrintOptions>) => void;
  replace: (next: PiPrintOptions) => void;
}

/* ── Compact controls ──────────────────────────────────────────────────── */

const INPUT =
  "bg-surface-2 border-line text-ink placeholder:text-ink-3 h-8 w-full rounded-md border px-2 text-xs outline-none transition-colors focus:border-[var(--border-accent)]";

function Mini({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
  align,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
  placeholder?: string;
  className?: string;
  align?: "right";
  step?: string;
}) {
  const id = useId();
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="text-ink-3 mb-1 block text-[0.6875rem] font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        step={step}
        value={value}
        placeholder={placeholder}
        maxLength={type === "text" ? 600 : undefined}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
        className={cn(INPUT, align === "right" && "text-right tabular")}
      />
    </div>
  );
}

function MiniSelect({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="text-ink-3 mb-1 block text-[0.6875rem] font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(INPUT, "pr-1")}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function MiniArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={id} className="text-ink-3 mb-1 block text-[0.6875rem] font-medium">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        maxLength={4_000}
        onChange={(event) => onChange(event.target.value)}
        className={cn(INPUT, "h-auto py-1.5 leading-relaxed")}
      />
      {hint ? <p className="text-ink-3 mt-1 text-[0.625rem]">{hint}</p> : null}
    </div>
  );
}

/** A titled block of fields — the studio's answer to a fieldset. */
function Group({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="border-line rounded-lg border p-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <h3 className="text-ink text-xs font-semibold tracking-wide uppercase">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" aria-label={label} className="size-8" onClick={onClick}>
      <Trash2 size={14} />
    </Button>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button variant="secondary" size="sm" onClick={onClick}>
      <Plus size={13} />
      {label}
    </Button>
  );
}

/** Replace one entry of an array without mutating the original. */
function replaceAt<T>(items: T[], index: number, patch: Partial<T>): T[] {
  return items.map((item, position) =>
    position === index ? { ...item, ...patch } : item,
  );
}

function numeric(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/* ── Document ──────────────────────────────────────────────────────────── */

export function DocumentPanel({ doc, set }: DocPanelProps) {
  return (
    <div className="space-y-3">
      <Group title="Reference">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Mini label="PI No." value={doc.piNo} onChange={(piNo) => set({ piNo })} />
          <Mini
            label="PI Date"
            value={doc.piDate}
            placeholder="16 Jul 2026"
            onChange={(piDate) => set({ piDate })}
          />
          <Mini
            label="Valid Upto"
            value={doc.validUpto}
            placeholder="23 Jul 2026"
            onChange={(validUpto) => set({ validUpto })}
          />
          <Mini
            label="Revision No."
            value={doc.revisionNo}
            onChange={(revisionNo) => set({ revisionNo })}
          />
          <Mini
            label="Revision Date"
            value={doc.revisionDate}
            onChange={(revisionDate) => set({ revisionDate })}
          />
          <Mini label="Page" value={doc.page} onChange={(page) => set({ page })} />
        </div>
      </Group>

      <Group title="Heading">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Mini label="Title" value={doc.title} onChange={(title) => set({ title })} />
          <Mini label="Sub-title" value={doc.subtitle} onChange={(subtitle) => set({ subtitle })} />
          <MiniSelect
            label="Currency"
            value={doc.currency}
            options={PI_CURRENCIES}
            onChange={(currency) => set({ currency, currencyLabel: currency })}
          />
        </div>
      </Group>

      <Group title="Footer">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Mini label="Document Status" value={doc.status} onChange={(status) => set({ status })} />
          <Mini
            label="Generated By"
            value={doc.generatedBy}
            onChange={(generatedBy) => set({ generatedBy })}
          />
          <Mini
            label="Print Date & Time"
            value={doc.printedAt}
            placeholder="Stamped when you print"
            onChange={(printedAt) => set({ printedAt })}
          />
        </div>
      </Group>
    </div>
  );
}

/* ── Parties ───────────────────────────────────────────────────────────── */

export function PartiesPanel({ doc, set }: DocPanelProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Group title="Buyer / Applicant">
        <div className="space-y-3">
          <Mini
            label="Block Heading"
            value={doc.buyer.heading}
            onChange={(heading) => set({ buyer: { ...doc.buyer, heading } })}
          />
          <Mini
            label="Buyer Name"
            value={doc.buyer.name}
            onChange={(name) => set({ buyer: { ...doc.buyer, name } })}
          />
          <MiniArea
            label="Address & Details"
            rows={5}
            hint="One line per row. Leave a row empty for a gap on the sheet."
            value={doc.buyer.lines.join("\n")}
            onChange={(text) => set({ buyer: { ...doc.buyer, lines: text.split("\n") } })}
          />
          <Mini
            label="Concern"
            value={doc.buyer.concern}
            onChange={(concern) => set({ buyer: { ...doc.buyer, concern } })}
          />
        </div>
      </Group>

      <Group title="Seller / Beneficiary">
        <div className="space-y-3">
          <Mini
            label="Block Heading"
            value={doc.seller.heading}
            onChange={(heading) => set({ seller: { ...doc.seller, heading } })}
          />
          <Mini
            label="Seller Name"
            value={doc.seller.name}
            onChange={(name) => set({ seller: { ...doc.seller, name } })}
          />
          <MiniArea
            label="Address"
            rows={2}
            value={doc.seller.lines.join("\n")}
            onChange={(text) => set({ seller: { ...doc.seller, lines: text.split("\n") } })}
          />
          <MiniArea
            label="Registration Lines"
            rows={3}
            hint="VAT, E-TIN, ERC and bond licence — one line each."
            value={doc.sellerMeta.join("\n")}
            onChange={(text) => set({ sellerMeta: text.split("\n") })}
          />
          <Mini
            label="Concern"
            value={doc.seller.concern}
            onChange={(concern) => set({ seller: { ...doc.seller, concern } })}
          />
        </div>
      </Group>
    </div>
  );
}

/* ── Terms band ────────────────────────────────────────────────────────── */

export function TermsPanel({ doc, set }: DocPanelProps) {
  const addCell = () =>
    set({
      terms: [...doc.terms, { label: "NEW TERM", value: "", icon: "Link2" }],
    });

  return (
    <Group
      title="Commercial Terms Band"
      action={<AddButton label="Add cell" onClick={addCell} />}
    >
      <p className="text-ink-3 mb-3 text-[0.6875rem]">
        The band prints six cells to a row, so cells in multiples of six keep the grid square.
        Currently {doc.terms.length}.
      </p>
      <div className="space-y-2">
        {doc.terms.map((term, index) => (
          <div key={index} className="flex items-end gap-2">
            <Mini
              label="Label"
              className="w-[34%]"
              value={term.label}
              onChange={(label) => set({ terms: replaceAt(doc.terms, index, { label }) })}
            />
            <Mini
              label="Value"
              className="flex-1"
              value={term.value}
              onChange={(value) => set({ terms: replaceAt(doc.terms, index, { value }) })}
            />
            <MiniSelect
              label="Icon"
              className="w-[24%]"
              value={term.icon}
              options={PI_TERM_ICON_NAMES}
              onChange={(icon) => set({ terms: replaceAt(doc.terms, index, { icon }) })}
            />
            <RemoveButton
              label={`Remove ${term.label}`}
              onClick={() => set({ terms: doc.terms.filter((_, position) => position !== index) })}
            />
          </div>
        ))}
      </div>
    </Group>
  );
}

/* ── Goods ─────────────────────────────────────────────────────────────── */

export function GoodsPanel({ doc, set }: DocPanelProps) {
  const setLines = (lines: PiLine[]) => set({ lines });

  const patchLine = (index: number, patch: Partial<PiLine>) =>
    setLines(replaceAt(doc.lines, index, patch));

  const addItem = () =>
    setLines([
      ...doc.lines,
      {
        sl: doc.lines.length + 1,
        description: "",
        styleRef: "",
        sizes: [
          { size: "", color: "", uom: doc.totalUom, quantity: 0, unitPrice: 0, amount: 0 },
        ],
      },
    ]);

  return (
    <div className="space-y-3">
      <Group title="Description of Goods" action={<AddButton label="Add item" onClick={addItem} />}>
        <div className="space-y-4">
          {doc.lines.map((line, lineIndex) => (
            <div key={lineIndex} className="border-line rounded-lg border p-3">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <span className="text-ink-2 text-xs font-semibold">Item {line.sl}</span>
                {doc.lines.length > 1 ? (
                  <RemoveButton
                    label={`Remove item ${line.sl}`}
                    onClick={() =>
                      setLines(doc.lines.filter((_, position) => position !== lineIndex))
                    }
                  />
                ) : null}
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                <MiniArea
                  label="Description"
                  rows={5}
                  value={line.description}
                  onChange={(description) => patchLine(lineIndex, { description })}
                />
                <MiniArea
                  label="Style / Ref"
                  rows={5}
                  value={line.styleRef}
                  onChange={(styleRef) => patchLine(lineIndex, { styleRef })}
                />
              </div>

              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-ink-3 text-[0.6875rem] font-medium">
                    Size break — {line.sizes.length}{" "}
                    {line.sizes.length === 1 ? "row" : "rows"}
                  </span>
                  <AddButton
                    label="Add size"
                    onClick={() =>
                      patchLine(lineIndex, {
                        sizes: [
                          ...line.sizes,
                          {
                            size: "",
                            color: line.sizes.at(-1)?.color ?? "",
                            uom: line.sizes.at(-1)?.uom ?? doc.totalUom,
                            quantity: 0,
                            unitPrice: line.sizes.at(-1)?.unitPrice ?? 0,
                            amount: 0,
                          },
                        ],
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  {line.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="flex items-end gap-2">
                      <Mini
                        label="Size"
                        className="w-[16%]"
                        value={size.size}
                        onChange={(value) =>
                          patchLine(lineIndex, {
                            sizes: replaceAt(line.sizes, sizeIndex, { size: value }),
                          })
                        }
                      />
                      <Mini
                        label="Colour"
                        className="flex-1"
                        value={size.color}
                        onChange={(color) =>
                          patchLine(lineIndex, {
                            sizes: replaceAt(line.sizes, sizeIndex, { color }),
                          })
                        }
                      />
                      <Mini
                        label="UOM"
                        className="w-[14%]"
                        value={size.uom}
                        onChange={(uom) =>
                          patchLine(lineIndex, {
                            sizes: replaceAt(line.sizes, sizeIndex, { uom }),
                          })
                        }
                      />
                      <Mini
                        label="Qty"
                        type="number"
                        align="right"
                        className="w-[16%]"
                        value={String(size.quantity)}
                        onChange={(value) =>
                          patchLine(lineIndex, {
                            sizes: replaceAt(line.sizes, sizeIndex, {
                              quantity: numeric(value),
                            }),
                          })
                        }
                      />
                      <Mini
                        label="Unit Price"
                        type="number"
                        step="0.0001"
                        align="right"
                        className="w-[18%]"
                        value={String(size.unitPrice)}
                        onChange={(value) =>
                          patchLine(lineIndex, {
                            sizes: replaceAt(line.sizes, sizeIndex, {
                              unitPrice: numeric(value),
                            }),
                          })
                        }
                      />
                      {line.sizes.length > 1 ? (
                        <RemoveButton
                          label={`Remove size row ${sizeIndex + 1}`}
                          onClick={() =>
                            patchLine(lineIndex, {
                              sizes: line.sizes.filter((_, position) => position !== sizeIndex),
                            })
                          }
                        />
                      ) : (
                        <span className="size-8 shrink-0" aria-hidden="true" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Group>

      <Group title="Totals">
        <div className="grid gap-3 sm:grid-cols-3">
          <Mini
            label="Total UOM"
            value={doc.totalUom}
            onChange={(totalUom) => set({ totalUom })}
          />
          <div>
            <span className="text-ink-3 mb-1 block text-[0.6875rem] font-medium">
              Total Quantity
            </span>
            <output className="bg-surface-3 text-ink tabular flex h-8 items-center rounded-md px-2 text-xs">
              {doc.totalQuantity.toLocaleString("en-US")} {doc.totalUom}
            </output>
          </div>
          <div>
            <span className="text-ink-3 mb-1 block text-[0.6875rem] font-medium">Total Amount</span>
            <output className="bg-surface-3 text-ink tabular flex h-8 items-center rounded-md px-2 text-xs">
              {doc.currency} {doc.totalAmount.toFixed(2)}
            </output>
          </div>
        </div>
      </Group>
    </div>
  );
}

/* ── Money ─────────────────────────────────────────────────────────────── */

export function MoneyPanel({ doc, set }: DocPanelProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <Group
        title="Commercial Summary"
        action={
          <AddButton
            label="Add charge"
            onClick={() => set({ summary: [...doc.summary, { label: "New Charge", amount: 0 }] })}
          />
        }
      >
        <div className="space-y-2">
          {doc.summary.map((entry, index) => (
            <div key={index} className="flex items-end gap-2">
              <Mini
                label={index === 0 ? "Goods Line (computed)" : "Charge"}
                className="flex-1"
                value={entry.label}
                onChange={(label) => set({ summary: replaceAt(doc.summary, index, { label }) })}
              />
              {index === 0 ? (
                <div className="w-[32%]">
                  <span className="text-ink-3 mb-1 block text-[0.6875rem] font-medium">Amount</span>
                  <output className="bg-surface-3 text-ink tabular flex h-8 items-center justify-end rounded-md px-2 text-xs">
                    {entry.amount.toFixed(2)}
                  </output>
                </div>
              ) : (
                <Mini
                  label="Amount"
                  type="number"
                  step="0.01"
                  align="right"
                  className="w-[32%]"
                  value={String(entry.amount)}
                  onChange={(value) =>
                    set({ summary: replaceAt(doc.summary, index, { amount: numeric(value) }) })
                  }
                />
              )}
              {index === 0 ? (
                <span className="size-8 shrink-0" aria-hidden="true" />
              ) : (
                <RemoveButton
                  label={`Remove ${entry.label}`}
                  onClick={() =>
                    set({ summary: doc.summary.filter((_, position) => position !== index) })
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div className="border-line mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-ink-2 text-xs font-semibold">Grand Total</span>
          <span className="text-ink tabular text-sm font-bold">
            {doc.currency} {doc.grandTotal.toFixed(2)}
          </span>
        </div>
        <p className="text-ink-3 mt-1 text-[0.625rem]">{doc.amountInWords}</p>
      </Group>

      <Group
        title="Bank Information"
        action={
          <AddButton
            label="Add row"
            onClick={() => set({ bank: [...doc.bank, { label: "", value: "" }] })}
          />
        }
      >
        <div className="space-y-2">
          {doc.bank.map((entry, index) => (
            <div key={index} className="flex items-end gap-2">
              <Mini
                label="Label"
                className="w-[38%]"
                value={entry.label}
                onChange={(label) => set({ bank: replaceAt(doc.bank, index, { label }) })}
              />
              <Mini
                label="Value"
                className="flex-1"
                value={entry.value}
                onChange={(value) => set({ bank: replaceAt(doc.bank, index, { value }) })}
              />
              <RemoveButton
                label={`Remove ${entry.label}`}
                onClick={() => set({ bank: doc.bank.filter((_, position) => position !== index) })}
              />
            </div>
          ))}
        </div>
      </Group>
    </div>
  );
}

/* ── Clauses ───────────────────────────────────────────────────────────── */

export function ClausesPanel({ doc, set }: DocPanelProps) {
  return (
    <div className="space-y-3">
      <Group
        title="Terms & Conditions"
        action={
          <AddButton label="Add clause" onClick={() => set({ conditions: [...doc.conditions, ""] })} />
        }
      >
        <div className="space-y-2">
          {doc.conditions.map((condition, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-ink-3 tabular w-5 shrink-0 pt-2 text-right text-[0.6875rem]">
                {index + 1}.
              </span>
              <textarea
                rows={2}
                value={condition}
                maxLength={1_000}
                aria-label={`Clause ${index + 1}`}
                onChange={(event) =>
                  set({
                    conditions: doc.conditions.map((entry, position) =>
                      position === index ? event.target.value : entry,
                    ),
                  })
                }
                className={cn(INPUT, "h-auto flex-1 py-1.5 leading-relaxed")}
              />
              <RemoveButton
                label={`Remove clause ${index + 1}`}
                onClick={() =>
                  set({ conditions: doc.conditions.filter((_, position) => position !== index) })
                }
              />
            </div>
          ))}
        </div>
      </Group>

      <div className="grid gap-3 lg:grid-cols-2">
        <Group
          title="Documents Attached"
          action={
            <AddButton
              label="Add row"
              onClick={() => set({ documents: [...doc.documents, { label: "", checked: false }] })}
            />
          }
        >
          <div className="space-y-2">
            {doc.documents.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Switch
                  checked={item.checked}
                  label={`Attach ${item.label || `row ${index + 1}`}`}
                  onChange={(checked) =>
                    set({ documents: replaceAt(doc.documents, index, { checked }) })
                  }
                />
                <input
                  value={item.label}
                  maxLength={120}
                  aria-label={`Document ${index + 1}`}
                  onChange={(event) =>
                    set({ documents: replaceAt(doc.documents, index, { label: event.target.value }) })
                  }
                  className={cn(INPUT, "flex-1")}
                />
                <RemoveButton
                  label={`Remove ${item.label}`}
                  onClick={() =>
                    set({ documents: doc.documents.filter((_, position) => position !== index) })
                  }
                />
              </div>
            ))}
          </div>
        </Group>

        <Group title="Note">
          <MiniArea
            label="Footer note"
            rows={4}
            value={doc.note}
            onChange={(note) => set({ note })}
          />
        </Group>
      </div>
    </div>
  );
}

/* ── Design ────────────────────────────────────────────────────────────── */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-ink-2 text-xs">{label}</span>
      <Switch checked={checked} label={label} onChange={onChange} />
    </div>
  );
}

const BLOCK_TOGGLES: Array<[key: keyof PiPrintOptions, label: string]> = [
  ["showLogo", "Logo lock-up"],
  ["showContact", "Contact lines"],
  ["showQr", "QR code"],
  ["showBarcode", "Barcode"],
  ["showTermsBand", "Commercial terms band"],
  ["showGoodsTable", "Goods table"],
  ["showSummary", "Commercial summary"],
  ["showBank", "Bank information"],
  ["showConditions", "Terms & conditions"],
  ["showChecklist", "Documents attached"],
  ["showSignature", "Signature panel"],
  ["showSeal", "Company seal"],
  ["showNote", "Footer note"],
  ["showFooter", "Generated-by footer"],
];

export function DesignPanel({ options, set, replace }: OptionsPanelProps) {
  return (
    <div className="space-y-3">
      <Group title="Template">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {PI_TEMPLATES.map((preset) => {
            const active = options.template === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                aria-pressed={active}
                onClick={() => replace(applyPiTemplate(options, preset.value))}
                className={cn(
                  "rounded-lg border p-2.5 text-left transition-colors",
                  active
                    ? "border-[var(--border-accent)] bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <span className="text-ink block text-xs font-semibold">{preset.label}</span>
                <span className="text-ink-3 mt-0.5 block text-[0.625rem] leading-snug">
                  {preset.hint}
                </span>
              </button>
            );
          })}
        </div>
        {options.template === "custom" ? (
          <p className="text-ink-3 mt-2 text-[0.625rem]">
            Blocks have been changed by hand — pick a template above to start over.
          </p>
        ) : null}
      </Group>

      <div className="grid gap-3 lg:grid-cols-2">
        <Group title="House Colour">
          <div className="flex flex-wrap gap-2">
            {PI_ACCENTS.map((accent) => {
              const active = options.accent.toLowerCase() === accent.base.toLowerCase();
              return (
                <button
                  key={accent.name}
                  type="button"
                  aria-pressed={active}
                  aria-label={accent.name}
                  onClick={() => set({ accent: accent.base, accentBright: accent.bright })}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors",
                    active ? "border-[var(--border-accent)]" : "border-line hover:bg-surface-2",
                  )}
                >
                  <span
                    className="size-4 rounded-full"
                    style={{ background: accent.base }}
                    aria-hidden="true"
                  />
                  <span className="text-ink-2">{accent.name}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="pi-accent-base"
                className="text-ink-3 mb-1 block text-[0.6875rem] font-medium"
              >
                Custom base
              </label>
              <input
                id="pi-accent-base"
                type="color"
                value={options.accent}
                onChange={(event) => set({ accent: event.target.value })}
                className="border-line bg-surface-2 h-8 w-full cursor-pointer rounded-md border px-1"
              />
            </div>
            <div>
              <label
                htmlFor="pi-accent-bright"
                className="text-ink-3 mb-1 block text-[0.6875rem] font-medium"
              >
                Custom highlight
              </label>
              <input
                id="pi-accent-bright"
                type="color"
                value={options.accentBright}
                onChange={(event) => set({ accentBright: event.target.value })}
                className="border-line bg-surface-2 h-8 w-full cursor-pointer rounded-md border px-1"
              />
            </div>
          </div>
        </Group>

        <Group title="Stamps">
          <div className="space-y-3">
            <div>
              <Mini
                label="Copy label"
                value={options.copyLabel}
                placeholder="No stamp"
                onChange={(copyLabel) => set({ copyLabel })}
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PI_COPY_LABELS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => set({ copyLabel: options.copyLabel === label ? "" : label })}
                    className="border-line text-ink-3 hover:bg-surface-2 rounded-md border px-1.5 py-0.5 text-[0.625rem]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Mini
                label="Watermark"
                value={options.watermark}
                placeholder="No watermark"
                onChange={(watermark) => set({ watermark })}
              />
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {PI_WATERMARKS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => set({ watermark: options.watermark === label ? "" : label })}
                    className="border-line text-ink-3 hover:bg-surface-2 rounded-md border px-1.5 py-0.5 text-[0.625rem]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <Toggle
              label="Compact spacing"
              checked={options.compact}
              onChange={(compact) => set({ compact })}
            />
          </div>
        </Group>
      </div>

      <Group title="Blocks on the Sheet">
        <div className="grid gap-x-6 sm:grid-cols-2">
          {BLOCK_TOGGLES.map(([key, label]) => (
            <Toggle
              key={key}
              label={label}
              checked={options[key] as boolean}
              onChange={(next) => set({ [key]: next } as Partial<PiPrintOptions>)}
            />
          ))}
        </div>
      </Group>
    </div>
  );
}
