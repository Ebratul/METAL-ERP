import { seeded, randomInt } from "@/lib/data/rng";
import type { RecordRow, ResolvedSpec } from "@/lib/workspaces/types";

/**
 * The proforma invoice document.
 *
 * A workspace record is a flat row; a printed PI is a laid-out commercial
 * document with parties, a terms band, a size-broken line table, a charges
 * summary and a bank block. This module is the bridge: it reads whatever the
 * row happens to carry, fills the rest from the company profile and the buyer
 * defaults, and hands the print surface something complete enough to sign.
 *
 * Everything here is deterministic — the same record always produces the same
 * document, so a reprint matches the copy the buyer already holds.
 */

/* ── Company profile ───────────────────────────────────────────────────── */

export const PI_COMPANY = {
  name: "Smart Metal Accessories Ltd.",
  tagline: "Precision in Every Detail",
  addressLines: [
    "Plot # 123, BSCIC Industrial Area, Sitakunda,",
    "Chattogram-4335, Bangladesh.",
  ],
  phone: "+880 1712 345678",
  email: "info@smartmetal.com",
  website: "www.smartmetal.com",
  vatReg: "123456789012",
  eTin: "123456789012",
  ercNo: "260326210584020",
  bondLicense: "B41/CUS-PBW/SBW/2012",
  bondDate: "26.12.2012",
  concern: "Appel Mahmud Polash",
  generatedBy: "SMART METAL ACCESSORIES ERP",
} as const;

export const PI_BANK = [
  { label: "Beneficiary Name", value: "Smart Metal Accessories Ltd." },
  { label: "Bank Name", value: "Basic Bank Limited" },
  { label: "Branch", value: "Mirpur Branch, Dhaka" },
  { label: "A/C No.", value: "2812010000859" },
  { label: "Swift Code", value: "BKSBBDDH022" },
  { label: "Routing No.", value: "055262965" },
  { label: "Bank Address", value: "Mirpur Branch, Dhaka, Bangladesh." },
];

export const PI_CONDITIONS = [
  "Payment Mode : Should be in Irrevocable Letter of Credit At 90 Days Sight / Acceptance.",
  "Overdue interest has to be paid at @16.5 % P.A. for overdue period.",
  "PI validity 30 days from issue date.",
  "Place of Loading: Shenzhen Factory, Place of Discharge : Buyers Factory , Partial Shipment : Allowed, Origin: Bangladesh.",
  "Importer counter signature on the Delivery Challan is mandatory.",
  "Payment should be made in US dollar.",
  "Shenzhen Factory, Place of Discharge Buyers Factory, Partial Shipment Allowed, Origin: Bangladesh 04. After Receiving LC PI Will execute for Production and Delivery will be made after receiving the LC.",
  "Incase of requirement of passing any quality parameter or test report by third party, applicant must settle the matter in written at the time of finalizing the deal. Otherwise, SML will not be held responsible.",
  "Pre notice (before production) require for metal detection machine pass of any button and zipper.",
  "All item is suitable for normal home laundry and we can't give any color guarantee for any other chemical wash.",
  "Buyers need to make joint inventory at the time of delivery and after that if any short quantity no complain will acceptable. Shipment should be entertained.",
];

export const PI_DOCUMENT_CHECKLIST = [
  "Buyer Purchase Order",
  "Packing Instruction",
  "Artwork / Design",
  "Commercial Sample",
  "Technical Sheet",
  "Test Report (If Any)",
  "Specification Sheet",
  "Other Documents",
  "Sample Approval",
];

/* ── Document shape ────────────────────────────────────────────────────── */

export interface PiSizeLine {
  size: string;
  color: string;
  uom: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface PiLine {
  sl: number;
  description: string;
  styleRef: string;
  sizes: PiSizeLine[];
}

export interface PiParty {
  heading: string;
  name: string;
  lines: string[];
  concern: string;
}

export interface PiTermCell {
  label: string;
  value: string;
  icon: string;
}

export interface PiLabelledValue {
  label: string;
  value: string;
}

export interface PiSummaryLine {
  label: string;
  amount: number;
}

export interface PiChecklistItem {
  label: string;
  checked: boolean;
}

export interface PiDocument {
  piNo: string;
  piDate: string;
  revisionNo: string;
  revisionDate: string;
  validUpto: string;
  currency: string;
  currencyLabel: string;
  page: string;
  title: string;
  subtitle: string;
  buyer: PiParty;
  seller: PiParty;
  sellerMeta: string[];
  terms: PiTermCell[];
  lines: PiLine[];
  totalQuantity: number;
  totalUom: string;
  totalAmount: number;
  summary: PiSummaryLine[];
  grandTotal: number;
  amountInWords: string;
  bank: PiLabelledValue[];
  conditions: string[];
  documents: PiChecklistItem[];
  note: string;
  status: string;
  generatedBy: string;
  printedAt: string;
}

/* ── Editable copies ───────────────────────────────────────────────────── */

/**
 * A deep copy of a document.
 *
 * The builder edits a `PiDocument` in place, and several fields on a freshly
 * built one point straight at the module-level `PI_BANK` / `PI_CONDITIONS`
 * arrays. Editing those would rewrite the house defaults for every PI printed
 * afterwards, so anything handed to an editor goes through here first.
 */
export function clonePiDocument(doc: PiDocument): PiDocument {
  return {
    ...doc,
    buyer: { ...doc.buyer, lines: [...doc.buyer.lines] },
    seller: { ...doc.seller, lines: [...doc.seller.lines] },
    sellerMeta: [...doc.sellerMeta],
    terms: doc.terms.map((term) => ({ ...term })),
    lines: doc.lines.map((line) => ({
      ...line,
      sizes: line.sizes.map((size) => ({ ...size })),
    })),
    summary: doc.summary.map((entry) => ({ ...entry })),
    bank: doc.bank.map((entry) => ({ ...entry })),
    conditions: [...doc.conditions],
    documents: doc.documents.map((item) => ({ ...item })),
  };
}

/* ── Amount in words ───────────────────────────────────────────────────── */

const ONES = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
  "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
  "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];

const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty",
  "Ninety",
];

const SCALES: Array<[number, string]> = [
  [1_000_000_000, "Billion"],
  [1_000_000, "Million"],
  [1_000, "Thousand"],
];

function underThousand(value: number): string {
  if (value < 20) return ONES[value];
  if (value < 100) {
    const rest = value % 10;
    return TENS[Math.floor(value / 10)] + (rest ? ` ${ONES[rest]}` : "");
  }
  const rest = value % 100;
  return `${ONES[Math.floor(value / 100)]} Hundred${rest ? ` ${underThousand(rest)}` : ""}`;
}

/** 234 -> "Two Hundred Thirty Four". Handles up to 999,999,999,999. */
export function numberToWords(value: number): string {
  const whole = Math.floor(Math.abs(value));
  if (whole === 0) return "Zero";

  let remaining = whole;
  const parts: string[] = [];

  for (const [scale, name] of SCALES) {
    if (remaining >= scale) {
      parts.push(`${numberToWords(Math.floor(remaining / scale))} ${name}`);
      remaining %= scale;
    }
  }
  if (remaining > 0) parts.push(underThousand(remaining));

  return parts.join(" ");
}

/** Currencies the document can be raised in — the words below drive the total. */
export const PI_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CNY",
  "CAD",
  "AUD",
  "CHF",
  "BDT",
] as const;

const CURRENCY_WORDS: Record<string, [string, string]> = {
  USD: ["US Dollar", "Cents"],
  EUR: ["Euro", "Cents"],
  GBP: ["Pound Sterling", "Pence"],
  JPY: ["Japanese Yen", "Sen"],
  CNY: ["Chinese Yuan", "Fen"],
  CAD: ["Canadian Dollar", "Cents"],
  AUD: ["Australian Dollar", "Cents"],
  CHF: ["Swiss Franc", "Rappen"],
  BDT: ["Bangladeshi Taka", "Poisha"],
};

/** "US Dollar Two Hundred Thirty Four and Fifty Two Cents Only." */
export function amountInWords(value: number, currency: string): string {
  const [major, minor] = CURRENCY_WORDS[currency] ?? [currency, "Cents"];
  const cents = Math.round((Math.abs(value) - Math.floor(Math.abs(value))) * 100);
  const head = `${major} ${numberToWords(value)}`;
  const tail = cents > 0 ? ` and ${numberToWords(cents)} ${minor}` : "";
  return `${head}${tail} Only.`;
}

/* ── Row reading ───────────────────────────────────────────────────────── */

function text(row: RecordRow, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return fallback;
}

function num(row: RecordRow, keys: string[], fallback: number): number {
  for (const key of keys) {
    const value = Number(row[key]);
    if (Number.isFinite(value) && value !== 0) return value;
  }
  return fallback;
}

/**
 * Trade documents are read day-first the world over, so the PI does not use the
 * app's en-US formatter. Locale and time zone are pinned for SSR stability.
 */
const DOC_DATE = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** "04 Aug 2026" — used for the PI, revision and validity dates. */
function docDate(iso: string): string {
  return DOC_DATE.format(new Date(iso));
}

/** "25-Sep-2026" — the hyphenated form the shipping band uses. */
function shipDate(iso: string): string {
  return docDate(iso).replace(/ /g, "-");
}

function dateText(
  row: RecordRow,
  keys: string[],
  fallback: string,
  format: (iso: string) => string = docDate,
): string {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return format(value);
    }
  }
  return fallback;
}

/** Buyer addresses the demo buyers ship to, so the party block is never blank. */
const BUYER_ADDRESSES: Record<string, string[]> = {
  "Big Boss Corporation Ltd.": [
    "Aptech Industrial Park, Holding No : 30,",
    "Sarabo, Kashimpur, Gazipur, Bangladesh.",
  ],
  "H&M Global Sourcing": ["Mäster Samuelsgatan 46,", "111 57 Stockholm, Sweden."],
  "Inditex / Zara": ["Avenida de la Diputación, Edificio Inditex,", "15143 Arteixo, Spain."],
  "Levi Strauss & Co.": ["1155 Battery Street,", "San Francisco, CA 94111, USA."],
  "Primark Sourcing": ["Weston Centre, 10 Grosvenor Street,", "Dublin, Ireland."],
  "Uniqlo / Fast Retailing": ["Midtown Tower, 9-7-1 Akasaka,", "Minato-ku, Tokyo, Japan."],
  "Decathlon Sourcing": ["4 Boulevard de Mons,", "59650 Villeneuve-d'Ascq, France."],
  "C&A Buying": ["Wanheimer Straße 70,", "40468 Düsseldorf, Germany."],
  "Bestseller A/S": ["Fredskovvej 5,", "7330 Brande, Denmark."],
  "Next Sourcing Ltd.": ["Desford Road, Enderby,", "Leicester LE19 4AT, United Kingdom."],
  "Marks & Spencer": ["Waterside House, 35 North Wharf Road,", "London W2 1NW, United Kingdom."],
};

const DEFAULT_SIZES = ["45 CM", "47 CM", "48.5 CM", "50.5 CM", "52 CM"];

/**
 * Split a total across the size range. Weighted so the middle sizes carry more,
 * with the remainder pushed onto the largest line so the parts always re-sum
 * to the total the record holds.
 */
function splitAcrossSizes(total: number, sizes: string[], seedKey: string): number[] {
  if (sizes.length <= 1) return [total];

  const rng = seeded(`pi-size:${seedKey}`);
  const weights = sizes.map(() => randomInt(rng, 6, 30));
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);

  const parts = weights.map((weight) =>
    Math.max(1, Math.floor((total * weight) / weightTotal)),
  );
  const assigned = parts.reduce((sum, part) => sum + part, 0);

  const largest = parts.indexOf(Math.max(...parts));
  parts[largest] += total - assigned;

  return parts.map((part) => Math.max(0, part));
}

/* ── Builder ───────────────────────────────────────────────────────────── */

export interface BuildPiOptions {
  /** Printed in the footer. Supply from the client so SSR stays deterministic. */
  printedAt?: string;
  /** How many size lines the goods table should break into. */
  sizeLines?: number;
}

/**
 * Build a printable PI from any workspace record. Fields the record does not
 * carry fall back to the company profile and the sample commercial terms, so
 * a row from the LC or shipment workspace still prints as a complete document.
 */
export function buildPiDocument(
  row: RecordRow,
  spec: ResolvedSpec,
  options: BuildPiOptions = {},
): PiDocument {
  const piNo = text(
    row,
    ["piNumber", "piNo", spec.codeField.key],
    "PI-2026-000125",
  );
  const seedKey = `${piNo}:${row.id}`;

  const currency = text(row, ["currency"], "USD");
  const buyerName = text(row, ["buyer", "buyerName"], "Big Boss Corporation Ltd.");
  const buyerAddress =
    BUYER_ADDRESSES[buyerName] ??
    (text(row, ["buyerAddress", "address"], "")
      ? [text(row, ["buyerAddress", "address"], "")]
      : ["Address held on the buyer master."]);

  const freight = num(row, ["freight", "freightCost"], 15);
  const insurance = num(row, ["insurance", "insuranceCost"], 5);
  const packing = num(row, ["packingCost", "packing"], 10);
  const other = num(row, ["otherCharges", "otherCost"], 5);
  const charges = freight + insurance + packing + other;

  const quantity = Math.max(
    1,
    Math.round(num(row, ["quantity", "orderQty", "totalQty", "productionQty"], 353)),
  );

  /*
   * The printed lines have to reconcile to the figure the record carries, or
   * the buyer's copy disagrees with the register. Where the row states a unit
   * price, that wins; otherwise the goods value is worked back into one — from
   * an explicit FOB or total value, or from the grand total less its charges.
   */
  const statedUnitPrice = num(row, ["unitPrice", "fobPrice", "buyerPrice", "cifPrice"], 0);
  const statedGoods = num(
    row,
    ["fobValue", "totalValue", "totalAmount", "amount", "piValue"],
    0,
  );
  const statedGrand = num(row, ["grandTotal"], 0);
  const goodsValue =
    statedGoods || (statedGrand ? Math.max(0, statedGrand - charges) : 0);

  const unitPrice = Number(
    (statedUnitPrice || (goodsValue > 0 ? goodsValue / quantity : 0.58)).toFixed(4),
  );

  const sizeCount = Math.max(1, Math.min(options.sizeLines ?? 5, DEFAULT_SIZES.length));
  const rowSize = text(row, ["size"], "");
  const sizes =
    rowSize && !DEFAULT_SIZES.includes(rowSize)
      ? [rowSize]
      : DEFAULT_SIZES.slice(0, sizeCount);

  const quantities = splitAcrossSizes(quantity, sizes, seedKey);
  const color = text(row, ["color", "colour"], "YKK-233");
  const uom = text(row, ["uom"], "Pcs");

  const sizeLines: PiSizeLine[] = sizes.map((size, index) => ({
    size,
    color,
    uom,
    quantity: quantities[index],
    unitPrice,
    amount: Number((quantities[index] * unitPrice).toFixed(2)),
  }));

  // Rounding the derived unit price to four places leaves the lines a cent or
  // two off the stated value. Absorb it into the largest line so the printed
  // column adds up to exactly the figure the register holds.
  if (goodsValue > 0 && !statedUnitPrice) {
    const summed = sizeLines.reduce((sum, line) => sum + line.amount, 0);
    const drift = Number((goodsValue - summed).toFixed(2));
    if (drift !== 0) {
      const largest = sizeLines.reduce(
        (best, line, index) => (line.quantity > sizeLines[best].quantity ? index : best),
        0,
      );
      sizeLines[largest].amount = Number(
        (sizeLines[largest].amount + drift).toFixed(2),
      );
    }
  }

  const totalQuantity = sizeLines.reduce((sum, line) => sum + line.quantity, 0);
  const totalAmount = Number(
    sizeLines.reduce((sum, line) => sum + line.amount, 0).toFixed(2),
  );

  const grandTotal = Number((totalAmount + charges).toFixed(2));

  const description = text(
    row,
    ["description", "itemDescription", "item"],
    'Item : METAL ZIPPER# 05, OPEN END - TWO WAY WITH SPECIAL PULLER (MZP-128), TAPE: DTM COLOR, TEETH & SLIDER + PULLER + TOP & BOTTOM STOPPER WILL SHINY SILVER COLOR, RIGHT INSERT LEFT HAND PULLER, BOTTOM STOPPER SHOULD BE BOX TYPE "Y" TYPE TEETH.',
  );

  const styleRef = text(
    row,
    ["style", "styleRef", "buyerStyle"],
    "ST.J20143D. PO.PO58125 // JOB NO.B8CL-25-00363 # BOOKING NO.B8CL-TB-26-035654 // ALLOCATION:81/2026",
  );

  const status = String(row[spec.statusField.key] ?? "Draft");

  const checklistSeed = seeded(`pi-docs:${seedKey}`);
  const documents: PiChecklistItem[] = PI_DOCUMENT_CHECKLIST.map((label) => ({
    label,
    checked: randomInt(checklistSeed, 0, 10) > 1,
  }));

  return {
    piNo,
    piDate: dateText(row, ["date", "docDate", "piDate"], "16 Jul 2026"),
    revisionNo: text(row, ["revisionNo", "revisionNumber"], "00"),
    revisionDate: dateText(row, ["revisionDate"], "-"),
    validUpto: dateText(row, ["validUpto", "expiryDate", "deliveryDate"], "23 Jul 2026"),
    currency,
    currencyLabel: currency,
    page: "1 of 1",
    title: "PROFORMA INVOICE",
    subtitle: "(EXPORT)",
    buyer: {
      heading: "BUYER / APPLICANT",
      name: buyerName,
      lines: [
        ...buyerAddress,
        `BIN No:${text(row, ["bin"], "000235685-0103")}`,
        "",
        `Buyer Name : ${text(row, ["buyerName", "brand"], "ZIZZI")}`,
      ],
      concern: text(row, ["contactPerson"], ""),
    },
    seller: {
      heading: "SELLER / BENEFICIARY",
      name: text(row, ["seller"], PI_COMPANY.name),
      lines: [...PI_COMPANY.addressLines],
      concern: PI_COMPANY.concern,
    },
    sellerMeta: [
      `VAT REG NO. : ${PI_COMPANY.vatReg},  E-TIN : ${PI_COMPANY.eTin}`,
      `ERC NO. : ${PI_COMPANY.ercNo} &  BOND LICENSE NO: ${PI_COMPANY.bondLicense}`,
      `DATE : ${PI_COMPANY.bondDate}`,
    ],
    terms: [
      {
        label: "MARKETING PERSON",
        value: text(row, ["executive", "marketingPerson"], "Md. Rakib Hossain"),
        icon: "UserRound",
      },
      {
        label: "COMMERCIAL PERSON",
        value: text(row, ["commercial", "commercialPerson"], "Arifur Rahman"),
        icon: "UserCog",
      },
      {
        label: "PAYMENT TERMS",
        value: text(row, ["paymentTerms"], "Irrevocable LC at Sight"),
        icon: "Landmark",
      },
      {
        label: "SHIPMENT",
        value: text(row, ["shipmentMode", "mode"], "Sea Freight"),
        icon: "Ship",
      },
      {
        label: "PORT OF LOADING",
        value: text(row, ["pol"], "Chattogram Port, Bangladesh"),
        icon: "Anchor",
      },
      {
        label: "PORT OF DESTINATION",
        value: text(row, ["pod"], "Hamburg Port, Germany"),
        icon: "MapPin",
      },
      {
        label: "SHIPMENT MODE",
        value: text(row, ["containerType", "container"], "FCL"),
        icon: "Container",
      },
      {
        label: "ETD",
        value: dateText(row, ["etd", "shipmentDate"], "25-Sep-2026", shipDate),
        icon: "CalendarDays",
      },
      {
        label: "ETA",
        value: dateText(row, ["eta", "deliveryDate"], "20-Oct-2026", shipDate),
        icon: "CalendarCheck",
      },
      {
        label: "DELIVERY TERMS",
        value: text(row, ["deliveryTerms"], "FOB Chattogram"),
        icon: "Truck",
      },
      {
        label: "VALIDITY",
        value: `${Math.round(num(row, ["validityDays"], 30))} Days`,
        icon: "Timer",
      },
      { label: "INCOTERMS", value: text(row, ["incoterm"], "FOB"), icon: "Link2" },
    ],
    lines: [{ sl: 1, description, styleRef, sizes: sizeLines }],
    totalQuantity,
    totalUom: uom,
    totalAmount,
    summary: [
      { label: "Total FOB Value", amount: totalAmount },
      { label: "Freight", amount: freight },
      { label: "Insurance", amount: insurance },
      { label: "Packing Cost", amount: packing },
      { label: "Other Charges", amount: other },
    ],
    grandTotal,
    amountInWords: amountInWords(grandTotal, currency),
    bank: PI_BANK,
    conditions: PI_CONDITIONS,
    documents,
    note: text(
      row,
      ["remarks", "note", "notes"],
      "FOLLOW MZS# 11563 // REVISE BCOZ PULLER NUMBER ADDED.",
    ),
    status: status.toUpperCase(),
    generatedBy: PI_COMPANY.generatedBy,
    printedAt: options.printedAt ?? "",
  };
}

/* ── Documents built by hand ───────────────────────────────────────────── */

/** The twelve cells of the commercial terms band, in printed order. */
const TERM_CELLS: Array<[label: string, value: string, icon: string]> = [
  ["MARKETING PERSON", "Md. Rakib Hossain", "UserRound"],
  ["COMMERCIAL PERSON", "Arifur Rahman", "UserCog"],
  ["PAYMENT TERMS", "Irrevocable LC at Sight", "Landmark"],
  ["SHIPMENT", "Sea Freight", "Ship"],
  ["PORT OF LOADING", "Chattogram Port, Bangladesh", "Anchor"],
  ["PORT OF DESTINATION", "Hamburg Port, Germany", "MapPin"],
  ["SHIPMENT MODE", "FCL", "Container"],
  ["ETD", "25-Sep-2026", "CalendarDays"],
  ["ETA", "20-Oct-2026", "CalendarCheck"],
  ["DELIVERY TERMS", "FOB Chattogram", "Truck"],
  ["VALIDITY", "30 Days", "Timer"],
  ["INCOTERMS", "FOB", "Link2"],
];

const SAMPLE_QUANTITIES = [50, 112, 96, 63, 23];

/**
 * The house specimen PI, written out rather than generated.
 *
 * `buildPiDocument` needs a record and a spec; the builder needs a complete,
 * sensible document before the user has chosen anything at all. Keeping the
 * specimen explicit also means the sheet a new user first sees is fixed —
 * it does not drift when the seeded generators are re-tuned.
 */
export function defaultPiDocument(printedAt = ""): PiDocument {
  const unitPrice = 0.58;
  const sizes: PiSizeLine[] = DEFAULT_SIZES.map((size, index) => ({
    size,
    color: "YKK-233",
    uom: "Pcs",
    quantity: SAMPLE_QUANTITIES[index],
    unitPrice,
    amount: Number((SAMPLE_QUANTITIES[index] * unitPrice).toFixed(2)),
  }));

  return recalcPiDocument({
    piNo: "PI-2026-000125",
    piDate: "16 Jul 2026",
    revisionNo: "00",
    revisionDate: "-",
    validUpto: "23 Jul 2026",
    currency: "USD",
    currencyLabel: "USD",
    page: "1 of 1",
    title: "PROFORMA INVOICE",
    subtitle: "(EXPORT)",
    buyer: {
      heading: "BUYER / APPLICANT",
      name: "Big Boss Corporation Ltd.",
      lines: [
        "Aptech Industrial Park, Holding No : 30,",
        "Sarabo, Kashimpur, Gazipur, Bangladesh.",
        "BIN No:000235685-0103",
        "",
        "Buyer Name : ZIZZI",
      ],
      concern: "",
    },
    seller: {
      heading: "SELLER / BENEFICIARY",
      name: PI_COMPANY.name,
      lines: [...PI_COMPANY.addressLines],
      concern: PI_COMPANY.concern,
    },
    sellerMeta: [
      `VAT REG NO. : ${PI_COMPANY.vatReg},  E-TIN : ${PI_COMPANY.eTin}`,
      `ERC NO. : ${PI_COMPANY.ercNo} &  BOND LICENSE NO: ${PI_COMPANY.bondLicense}`,
      `DATE : ${PI_COMPANY.bondDate}`,
    ],
    terms: TERM_CELLS.map(([label, value, icon]) => ({ label, value, icon })),
    lines: [
      {
        sl: 1,
        description:
          'Item : METAL ZIPPER# 05, OPEN END - TWO WAY WITH SPECIAL PULLER (MZP-128), TAPE: DTM COLOR, TEETH & SLIDER + PULLER + TOP & BOTTOM STOPPER WILL SHINY SILVER COLOR, RIGHT INSERT LEFT HAND PULLER, BOTTOM STOPPER SHOULD BE BOX TYPE "Y" TYPE TEETH.',
        styleRef:
          "ST.J20143D. PO.PO58125 // JOB NO.B8CL-25-00363 # BOOKING NO.B8CL-TB-26-035654 // ALLOCATION:81/2026",
        sizes,
      },
    ],
    totalQuantity: 0,
    totalUom: "Pcs",
    totalAmount: 0,
    summary: [
      { label: "Total FOB Value", amount: 0 },
      { label: "Freight", amount: 15 },
      { label: "Insurance", amount: 5 },
      { label: "Packing Cost", amount: 10 },
      { label: "Other Charges", amount: 5 },
    ],
    grandTotal: 0,
    amountInWords: "",
    bank: PI_BANK.map((entry) => ({ ...entry })),
    conditions: [...PI_CONDITIONS],
    documents: PI_DOCUMENT_CHECKLIST.map((label) => ({ label, checked: true })),
    note: "FOLLOW MZS# 11563 // REVISE BCOZ PULLER NUMBER ADDED.",
    status: "APPROVED",
    generatedBy: PI_COMPANY.generatedBy,
    printedAt,
  });
}

/**
 * A document with the house identity filled in and the commercial content
 * emptied — the starting point for a PI typed from scratch.
 */
export function blankPiDocument(printedAt = ""): PiDocument {
  const base = defaultPiDocument(printedAt);

  return recalcPiDocument({
    ...base,
    piNo: "",
    piDate: "",
    revisionDate: "-",
    validUpto: "",
    buyer: { ...base.buyer, name: "", lines: ["", "", "", "", ""] },
    terms: base.terms.map((term) => ({ ...term, value: "" })),
    lines: [
      {
        sl: 1,
        description: "",
        styleRef: "",
        sizes: [
          { size: "", color: "", uom: "Pcs", quantity: 0, unitPrice: 0, amount: 0 },
        ],
      },
    ],
    summary: base.summary.map((entry) => ({ ...entry, amount: 0 })),
    documents: base.documents.map((item) => ({ ...item, checked: false })),
    note: "",
    status: "DRAFT",
  });
}

/* ── Recalculation ─────────────────────────────────────────────────────── */

/**
 * Re-derive everything the sheet computes rather than states.
 *
 * Line amounts, the two totals, the goods line of the commercial summary, the
 * grand total and the words underneath it are all functions of the quantities
 * and prices above them. The builder calls this after every keystroke, so a
 * printed PI can never disagree with itself — which is the one thing a buyer
 * and their bank will both check.
 */
export function recalcPiDocument(doc: PiDocument): PiDocument {
  const lines: PiLine[] = doc.lines.map((line, index) => ({
    ...line,
    sl: index + 1,
    sizes: line.sizes.map((size) => ({
      ...size,
      amount: Number((size.quantity * size.unitPrice).toFixed(2)),
    })),
  }));

  const flat = lines.flatMap((line) => line.sizes);
  const totalQuantity = flat.reduce((sum, size) => sum + size.quantity, 0);
  const totalAmount = Number(
    flat.reduce((sum, size) => sum + size.amount, 0).toFixed(2),
  );

  // The first summary row *is* the goods value; the rest are the charges the
  // user controls. Keeping the label lets a house rename it "Total CIF Value".
  const summary: PiSummaryLine[] = doc.summary.length
    ? doc.summary.map((entry, index) =>
        index === 0 ? { ...entry, amount: totalAmount } : { ...entry },
      )
    : [{ label: "Total FOB Value", amount: totalAmount }];

  const charges = summary
    .slice(1)
    .reduce((sum, entry) => sum + (Number.isFinite(entry.amount) ? entry.amount : 0), 0);

  const grandTotal = Number((totalAmount + charges).toFixed(2));

  return {
    ...doc,
    lines,
    totalQuantity,
    totalAmount,
    summary,
    grandTotal,
    amountInWords: amountInWords(grandTotal, doc.currency || "USD"),
    currencyLabel: doc.currencyLabel || doc.currency,
  };
}
