/**
 * How a proforma invoice is *printed*, as opposed to what it says.
 *
 * `PiDocument` carries the commercial content — parties, goods, charges, terms.
 * This module carries the presentation: which blocks appear on the sheet, what
 * the house colour is, whether the copy is stamped for the buyer or the bank.
 * Splitting the two is what lets one PI print as a full bank submission and as
 * a one-glance buyer copy without the figures ever being re-typed.
 *
 * Everything here is pure data and pure functions — no React, no storage — so
 * the same options object drives the live preview, the print overlay and any
 * template a user saves.
 */

export type PiTemplate =
  | "standard"
  | "branded"
  | "compact"
  | "detailed"
  | "lc"
  | "custom";

export interface PiPrintOptions {
  /** The preset the sheet was last stamped from. `custom` once it is edited. */
  template: PiTemplate;
  /** House colour: rules, section tabs, table head, grand total band. */
  accent: string;
  /** The lighter partner used for the tagline and the "(EXPORT)" sub-title. */
  accentBright: string;
  /** Stamped under the document title — "BUYER COPY", "BANK COPY". "" hides it. */
  copyLabel: string;
  /** Diagonal wash across the whole sheet — "DRAFT", "COPY". "" hides it. */
  watermark: string;
  /** Tightens the page margin and the gaps between blocks. */
  compact: boolean;
  showLogo: boolean;
  showContact: boolean;
  showQr: boolean;
  showBarcode: boolean;
  showTermsBand: boolean;
  showGoodsTable: boolean;
  showSummary: boolean;
  showBank: boolean;
  showConditions: boolean;
  showChecklist: boolean;
  showSignature: boolean;
  showSeal: boolean;
  showNote: boolean;
  showFooter: boolean;
}

/* ── Accents ───────────────────────────────────────────────────────────── */

export interface PiAccent {
  name: string;
  /** Base ink — everything structural on the sheet is drawn in it. */
  base: string;
  /** Lighter partner for secondary type. */
  bright: string;
}

export const PI_ACCENTS: PiAccent[] = [
  { name: "Navy", base: "#1B3B8F", bright: "#3B82F6" },
  { name: "Teal", base: "#0F5F63", bright: "#14B8A6" },
  { name: "Forest", base: "#14532D", bright: "#16A34A" },
  { name: "Maroon", base: "#7F1D1D", bright: "#DC2626" },
  { name: "Plum", base: "#4C1D95", bright: "#8B5CF6" },
  { name: "Graphite", base: "#1F2937", bright: "#6B7280" },
];

/* ── Defaults and presets ──────────────────────────────────────────────── */

export const DEFAULT_PI_OPTIONS: PiPrintOptions = {
  template: "standard",
  accent: PI_ACCENTS[0].base,
  accentBright: PI_ACCENTS[0].bright,
  copyLabel: "",
  watermark: "",
  compact: false,
  showLogo: true,
  showContact: true,
  showQr: true,
  showBarcode: true,
  showTermsBand: true,
  showGoodsTable: true,
  showSummary: true,
  showBank: true,
  showConditions: true,
  showChecklist: true,
  showSignature: true,
  showSeal: true,
  showNote: true,
  showFooter: true,
};

export interface PiTemplatePreset {
  value: Exclude<PiTemplate, "custom">;
  label: string;
  hint: string;
  patch: Partial<PiPrintOptions>;
}

/**
 * The five house templates. Each is a patch on the defaults rather than a whole
 * options object, so a field added above is picked up by every preset for free.
 */
export const PI_TEMPLATES: PiTemplatePreset[] = [
  {
    value: "standard",
    label: "Standard Export PI",
    hint: "Every block — the sheet the register prints by default",
    patch: {},
  },
  {
    value: "branded",
    label: "Buyer Branded",
    hint: "Letterhead and terms, no bank block or clause list",
    patch: {
      showBank: false,
      showConditions: false,
      copyLabel: "BUYER COPY",
    },
  },
  {
    value: "compact",
    label: "Compact",
    hint: "Goods and money only — fits a single short page",
    patch: {
      compact: true,
      showContact: false,
      showBarcode: false,
      showConditions: false,
      showChecklist: false,
      showSeal: false,
      showNote: false,
    },
  },
  {
    value: "detailed",
    label: "Detailed",
    hint: "The full document with every mark and clause",
    patch: {},
  },
  {
    value: "lc",
    label: "LC Submission",
    hint: "Bank block and clauses in full, buyer marks dropped",
    patch: {
      showQr: false,
      showBarcode: false,
      showChecklist: false,
      copyLabel: "BANK COPY",
    },
  },
];

/** Stamp a preset over the current options, keeping the chosen accent. */
export function applyPiTemplate(
  options: PiPrintOptions,
  template: Exclude<PiTemplate, "custom">,
): PiPrintOptions {
  const preset = PI_TEMPLATES.find((entry) => entry.value === template);
  if (!preset) return options;

  return {
    ...DEFAULT_PI_OPTIONS,
    accent: options.accent,
    accentBright: options.accentBright,
    ...preset.patch,
    template,
  };
}

/* ── Colour ────────────────────────────────────────────────────────────── */

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean.padEnd(6, "0").slice(0, 6);

  const value = Number.parseInt(full, 16);
  if (!Number.isFinite(value)) return [27, 59, 143];

  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

/**
 * Mix a colour toward white. `amount` is how much white: 0 returns the colour
 * untouched, 1 returns white. Used to derive the pale row fill and the hairline
 * rule from whatever accent the sheet is set to, so a custom colour still
 * produces a document that hangs together.
 */
export function tint(hex: string, amount: number): string {
  const ratio = Math.min(1, Math.max(0, amount));
  const mixed = parseHex(hex).map((channel) =>
    Math.round(channel + (255 - channel) * ratio),
  );

  return `#${mixed.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export interface PiPalette {
  accent: string;
  bright: string;
  /** Pale fill behind the terms band and the totals row. */
  soft: string;
  /** Hairline rule around every block. */
  line: string;
  ink: string;
  inkSoft: string;
}

/** The full ink set the printed sheet draws with. */
export function piPalette(options: PiPrintOptions): PiPalette {
  return {
    accent: options.accent,
    bright: options.accentBright,
    soft: tint(options.accent, 0.92),
    line: tint(options.accent, 0.72),
    ink: "#111827",
    inkSoft: "#374151",
  };
}

/** Labels offered for the copy stamp; the field itself is free text. */
export const PI_COPY_LABELS = [
  "BUYER COPY",
  "INTERNAL COPY",
  "BANK COPY",
  "FILE COPY",
  "CUSTOMS COPY",
] as const;

/** Labels offered for the watermark; the field itself is free text. */
export const PI_WATERMARKS = [
  "DRAFT",
  "COPY",
  "ORIGINAL",
  "CANCELLED",
  "NOT NEGOTIABLE",
] as const;
