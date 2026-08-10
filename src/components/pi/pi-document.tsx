import {
  Anchor,
  CalendarCheck,
  CalendarDays,
  Container,
  Globe,
  Landmark,
  Link2,
  Mail,
  MapPin,
  Phone,
  Ship,
  Timer,
  Truck,
  UserCog,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Barcode, QrCode } from "@/components/ui/code-marks";
import { PI_COMPANY, type PiDocument } from "@/lib/pi/document";
import {
  DEFAULT_PI_OPTIONS,
  piPalette,
  type PiPalette,
  type PiPrintOptions,
} from "@/lib/pi/options";

/**
 * The printed proforma invoice.
 *
 * This is a document, not an app screen: it is laid out at a fixed A4 width in
 * millimetres and pinned to explicit ink colours so it renders identically in
 * light mode, dark mode and on paper. Nothing here reads a theme token — a
 * printed invoice that changes colour with the viewer's OS setting is a bug.
 *
 * What it says comes from `PiDocument`; how it prints comes from
 * `PiPrintOptions` — which blocks appear, the house colour, the copy stamp.
 * Both are plain data, so the same sheet backs the live builder preview and
 * the print overlay.
 */

const INK = "#111827";
const INK_SOFT = "#374151";

/**
 * Icons the terms band can draw. The builder offers these by name, so the list
 * and the map can never drift apart.
 */
const TERM_ICONS: Record<string, LucideIcon> = {
  UserRound,
  UserCog,
  Landmark,
  Ship,
  Anchor,
  MapPin,
  Container,
  CalendarDays,
  CalendarCheck,
  Truck,
  Timer,
  Link2,
};

export const PI_TERM_ICON_NAMES = Object.keys(TERM_ICONS);

/** Section caption — the tab that sits on the top-left of each box. */
function SectionTab({ children, accent }: { children: string; accent: string }) {
  return (
    <div
      className="inline-block px-2 py-[3px] text-[7.5px] font-bold tracking-wide text-white uppercase"
      style={{ background: accent }}
    >
      {children}
    </div>
  );
}

function ContactLine({
  icon: Icon,
  accent,
  children,
}: {
  icon: LucideIcon;
  accent: string;
  children: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <Icon size={9} strokeWidth={2.2} style={{ color: accent }} className="mt-[1.5px] shrink-0" />
      <span className="text-[7.5px] leading-[1.35]" style={{ color: INK_SOFT }}>
        {children}
      </span>
    </div>
  );
}

/** The company seal impression printed over the signature panel. */
function CompanySeal({ accent, size = 62 }: { accent: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <path id="pi-seal-top" d="M50,50 m-36,0 a36,36 0 1,1 72,0" fill="none" />
        <path id="pi-seal-bottom" d="M50,50 m-30,0 a30,30 0 1,0 60,0" fill="none" />
      </defs>
      <circle cx="50" cy="50" r="47" fill="none" stroke={accent} strokeWidth="2" opacity="0.75" />
      <circle cx="50" cy="50" r="41" fill="none" stroke={accent} strokeWidth="1" opacity="0.65" />
      <text fill={accent} fontSize="9.5" fontWeight="700" letterSpacing="1.6" opacity="0.8">
        <textPath href="#pi-seal-top" startOffset="50%" textAnchor="middle">
          SMART METAL
        </textPath>
      </text>
      <text fill={accent} fontSize="8" fontWeight="700" letterSpacing="1.2" opacity="0.8">
        <textPath href="#pi-seal-bottom" startOffset="50%" textAnchor="middle">
          ACCESSORIES LTD.
        </textPath>
      </text>
      <text
        x="50"
        y="57"
        textAnchor="middle"
        fill={accent}
        fontSize="26"
        fontWeight="800"
        opacity="0.8"
      >
        S
      </text>
    </svg>
  );
}

/** The logo lock-up drawn inline so the document needs no external asset. */
function LogoMark({
  accent,
  bright,
  size = 44,
}: {
  accent: string;
  bright: string;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 14 L34 6 L34 18 L18 23 L18 28 L34 24 L34 36 L8 44 Z" fill={accent} />
      <path d="M56 20 L30 28 L30 40 L46 36 L46 41 L30 46 L30 58 L56 50 Z" fill={bright} />
    </svg>
  );
}

function Checkbox({
  checked,
  label,
  accent,
}: {
  checked: boolean;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span
        className="mt-[0.5px] flex size-[9px] shrink-0 items-center justify-center border text-[7px] leading-none font-bold"
        style={{ borderColor: accent, color: accent }}
        aria-hidden="true"
      >
        {checked ? "✓" : ""}
      </span>
      <span className="text-[7.5px] leading-[1.3]" style={{ color: INK_SOFT }}>
        {label}
      </span>
      <span className="sr-only">{checked ? "attached" : "not attached"}</span>
    </div>
  );
}

/**
 * The diagonal wash — DRAFT, COPY, CANCELLED.
 *
 * Painted *over* the sheet rather than under it. Underneath, it would vanish
 * behind the goods table's filled header and the grand-total band, which is
 * exactly where a reader looks; at this opacity, over the top reads as a stamp
 * without costing any legibility.
 */
function Watermark({ text, accent }: { text: string; accent: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      <span
        className="text-[90px] leading-none font-black tracking-[0.12em] whitespace-nowrap"
        style={{ color: accent, opacity: 0.13, transform: "rotate(-30deg)" }}
      >
        {text}
      </span>
    </div>
  );
}

const MONEY = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const QTY = new Intl.NumberFormat("en-US");

export function PiDocumentSheet({
  doc,
  options = DEFAULT_PI_OPTIONS,
}: {
  doc: PiDocument;
  options?: PiPrintOptions;
}) {
  const palette: PiPalette = piPalette(options);
  const { accent, bright, soft, line } = palette;

  const headRows: Array<[string, string]> = [
    ["PI No.", doc.piNo],
    ["PI Date", doc.piDate],
    ["Revision No.", doc.revisionNo],
    ["Revision Date", doc.revisionDate],
    ["Valid Upto", doc.validUpto],
    ["Currency", doc.currencyLabel],
    ["Page", doc.page],
  ];

  const showMarks = options.showQr || options.showBarcode;

  // The right column of the lower half only earns its place if something is
  // still switched on inside it.
  const showRightStack = options.showChecklist || options.showSignature;
  const showTermsRow = options.showConditions || showRightStack;
  const showMoneyRow = options.showSummary || options.showBank;

  return (
    <article
      className={`pi-sheet relative mx-auto flex w-[210mm] flex-col bg-white ${
        options.compact ? "gap-[1.4mm] p-[4mm]" : "gap-[2mm] p-[6mm]"
      }`}
      style={{ color: INK, minHeight: "297mm" }}
      aria-label={`Proforma invoice ${doc.piNo}`}
    >
      {options.watermark ? (
        <Watermark text={options.watermark} accent={accent} />
      ) : null}

      {/* ── Letterhead ─────────────────────────────────────────────── */}
      <header className="relative flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {options.showLogo ? <LogoMark accent={accent} bright={bright} /> : null}
            <div className="min-w-0">
              <div
                className="text-[17px] leading-[1.05] font-extrabold tracking-tight"
                style={{ color: accent }}
              >
                SMART METAL
              </div>
              <div
                className="text-[14px] leading-[1.05] font-semibold tracking-[0.02em]"
                style={{ color: accent }}
              >
                ACCESSORIES LTD.
              </div>
              <div className="text-[8px] italic" style={{ color: bright }}>
                {PI_COMPANY.tagline}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-start gap-4">
            {options.showContact ? (
              <div className="flex w-[62mm] flex-col gap-[3px]">
                <ContactLine icon={MapPin} accent={accent}>
                  {`${PI_COMPANY.addressLines[0]} ${PI_COMPANY.addressLines[1]}`}
                </ContactLine>
                <ContactLine icon={Phone} accent={accent}>
                  {PI_COMPANY.phone}
                </ContactLine>
                <ContactLine icon={Mail} accent={accent}>
                  {PI_COMPANY.email}
                </ContactLine>
                <ContactLine icon={Globe} accent={accent}>
                  {PI_COMPANY.website}
                </ContactLine>
              </div>
            ) : null}

            <div className="flex-1 pt-1 text-center">
              <div className="text-[13px] font-bold tracking-wide" style={{ color: accent }}>
                {doc.title}
              </div>
              <div className="text-[10px] font-semibold" style={{ color: bright }}>
                {doc.subtitle}
              </div>
              {options.copyLabel ? (
                <div
                  className="mt-1 inline-block border px-2 py-[1px] text-[7.5px] font-bold tracking-[0.14em]"
                  style={{ borderColor: accent, color: accent }}
                >
                  {options.copyLabel}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex w-[86mm] gap-2 border p-2" style={{ borderColor: line }}>
          <table className="flex-1 text-[8px]">
            <tbody>
              {headRows.map(([label, value]) => (
                <tr key={label}>
                  <td className="py-[1.5px] pr-1 font-bold whitespace-nowrap" style={{ color: INK }}>
                    {label}
                  </td>
                  <td className="py-[1.5px] pr-1" style={{ color: INK_SOFT }}>
                    :
                  </td>
                  <td
                    className="py-[1.5px] font-semibold"
                    style={{ color: label === "PI No." ? accent : INK }}
                  >
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showMarks ? (
            <div className="flex w-[26mm] shrink-0 flex-col items-center justify-between gap-1">
              {options.showQr ? (
                <QrCode value={doc.piNo || "—"} size={62} title={`QR code for ${doc.piNo}`} />
              ) : null}
              {options.showBarcode ? (
                <Barcode value={doc.piNo || "—"} width={94} height={26} />
              ) : null}
            </div>
          ) : null}
        </div>
      </header>

      {/* ── Parties ────────────────────────────────────────────────── */}
      <section className="relative grid grid-cols-2 gap-[2mm]">
        {[doc.buyer, doc.seller].map((party, index) => (
          <div key={party.heading} className="flex flex-col border" style={{ borderColor: line }}>
            <div className="px-1 pt-1">
              <SectionTab accent={accent}>{party.heading}</SectionTab>
            </div>
            <div className="flex-1 px-2 py-1.5">
              <div className="text-[10px] font-bold" style={{ color: accent }}>
                {party.name}
              </div>
              <div className="mt-1 space-y-[1px]">
                {party.lines.map((partyLine, lineIndex) =>
                  partyLine ? (
                    <div
                      key={`${partyLine}-${lineIndex}`}
                      className="text-[8px] leading-[1.4]"
                      style={{ color: INK_SOFT }}
                    >
                      {partyLine}
                    </div>
                  ) : (
                    <div key={`gap-${lineIndex}`} className="h-[4px]" />
                  ),
                )}
                {index === 1
                  ? doc.sellerMeta.map((metaLine) => (
                      <div
                        key={metaLine}
                        className="text-[7.5px] leading-[1.45]"
                        style={{ color: INK_SOFT }}
                      >
                        {metaLine}
                      </div>
                    ))
                  : null}
              </div>
            </div>
            <div
              className="border-t px-2 py-1 text-[8px]"
              style={{ borderColor: line, color: INK_SOFT }}
            >
              Concern :{party.concern ? ` ${party.concern}` : ""}
            </div>
          </div>
        ))}
      </section>

      {/* ── Commercial terms band ──────────────────────────────────── */}
      {options.showTermsBand && doc.terms.length ? (
        <section
          className="relative grid grid-cols-6 border-t border-l"
          style={{ borderColor: line }}
          aria-label="Commercial terms"
        >
          {doc.terms.map((term, index) => {
            const Icon = TERM_ICONS[term.icon] ?? Link2;
            return (
              <div
                key={`${term.label}-${index}`}
                className="border-r border-b"
                style={{ borderColor: line }}
              >
                <div
                  className="flex items-center justify-center gap-1 px-1 py-[3px]"
                  style={{ background: soft }}
                >
                  <Icon size={9} strokeWidth={2.2} style={{ color: accent }} className="shrink-0" />
                  <span
                    className="text-[6.5px] font-bold tracking-wide uppercase"
                    style={{ color: accent }}
                  >
                    {term.label}
                  </span>
                </div>
                <div
                  className="px-1 py-[5px] text-center text-[7.5px] leading-[1.3]"
                  style={{ color: INK }}
                >
                  {term.value}
                </div>
              </div>
            );
          })}
        </section>
      ) : null}

      {/* ── Goods ──────────────────────────────────────────────────── */}
      {options.showGoodsTable ? (
        <section className="relative" aria-label="Description of goods">
          <table className="w-full border-collapse text-[7.5px]">
            <colgroup>
              <col style={{ width: "4%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "9%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "7%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "11%" }} />
            </colgroup>
            <thead>
              <tr style={{ background: accent, color: "#ffffff" }}>
                {[
                  "SL",
                  "DESCRIPTION OF GOODS",
                  "STYLE / REF",
                  "SIZE",
                  "COLOR",
                  "UOM",
                  "QTY",
                  `UNIT PRICE (${doc.currency})`,
                  `AMOUNT (${doc.currency})`,
                ].map((heading) => (
                  <th
                    key={heading}
                    scope="col"
                    className="border px-1 py-[4px] text-center text-[7px] font-bold tracking-wide"
                    style={{ borderColor: accent }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doc.lines.map((docLine) =>
                docLine.sizes.map((size, sizeIndex) => (
                  <tr key={`${docLine.sl}-${size.size}-${sizeIndex}`}>
                    {sizeIndex === 0 ? (
                      <>
                        <td
                          rowSpan={docLine.sizes.length}
                          className="border px-1 py-[4px] text-center align-top"
                          style={{ borderColor: line }}
                        >
                          {docLine.sl}
                        </td>
                        <td
                          rowSpan={docLine.sizes.length}
                          className="border px-1.5 py-[4px] align-top leading-[1.4]"
                          style={{ borderColor: line }}
                        >
                          {docLine.description}
                        </td>
                        <td
                          rowSpan={docLine.sizes.length}
                          className="border px-1.5 py-[4px] align-top leading-[1.4]"
                          style={{ borderColor: line }}
                        >
                          {docLine.styleRef}
                        </td>
                      </>
                    ) : null}
                    <td className="border px-1 py-[4px] text-center" style={{ borderColor: line }}>
                      {size.size}
                    </td>
                    <td className="border px-1 py-[4px] text-center" style={{ borderColor: line }}>
                      {size.color}
                    </td>
                    <td className="border px-1 py-[4px] text-center" style={{ borderColor: line }}>
                      {size.uom}
                    </td>
                    <td className="border px-1 py-[4px] text-right" style={{ borderColor: line }}>
                      {QTY.format(size.quantity)}
                    </td>
                    <td className="border px-1 py-[4px] text-right" style={{ borderColor: line }}>
                      {size.unitPrice.toFixed(4)}
                    </td>
                    <td className="border px-1 py-[4px] text-right" style={{ borderColor: line }}>
                      {MONEY.format(size.amount)}
                    </td>
                  </tr>
                )),
              )}
              <tr style={{ background: soft }}>
                <td className="border" style={{ borderColor: line }} colSpan={3} />
                <td
                  className="border px-1 py-[5px] text-center text-[8px] font-bold"
                  style={{ borderColor: line, color: accent }}
                  colSpan={2}
                >
                  TOTAL QUANTITY
                </td>
                <td
                  className="border px-1 py-[5px] text-center text-[8px] font-bold"
                  style={{ borderColor: line }}
                  colSpan={2}
                >
                  {QTY.format(doc.totalQuantity)} {doc.totalUom}
                </td>
                <td
                  className="border px-1 py-[5px] text-center text-[8px] font-bold"
                  style={{ borderColor: line, color: accent }}
                >
                  TOTAL AMOUNT
                </td>
                <td
                  className="border px-1 py-[5px] text-right text-[8px] font-bold"
                  style={{ borderColor: line }}
                >
                  {MONEY.format(doc.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      ) : null}

      {/* ── Summary and bank ───────────────────────────────────────── */}
      {showMoneyRow ? (
        <section
          className={`relative grid gap-[2mm] ${
            options.showSummary && options.showBank ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {options.showSummary ? (
            <div className="flex flex-col">
              <div className="flex flex-1 flex-col border" style={{ borderColor: line }}>
                <div className="px-1 pt-1">
                  <SectionTab accent={accent}>
                    {`COMMERCIAL SUMMARY (${doc.currency})`}
                  </SectionTab>
                </div>
                <table className="w-full px-2 text-[8px]">
                  <tbody>
                    {doc.summary.map((entry, index) => (
                      <tr key={`${entry.label}-${index}`}>
                        <td className="py-[2px] pl-2 font-semibold" style={{ color: INK }}>
                          {entry.label}
                        </td>
                        <td className="py-[2px] text-center" style={{ color: INK_SOFT }}>
                          :
                        </td>
                        <td className="py-[2px] pr-2 text-right" style={{ color: INK }}>
                          {MONEY.format(entry.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  className="mt-1 flex items-center justify-between px-2 py-[5px] text-[9px] font-bold text-white"
                  style={{ background: accent }}
                >
                  <span>{`GRAND TOTAL (${doc.currency})`}</span>
                  <span className="flex items-center gap-6">
                    <span>:</span>
                    <span>{MONEY.format(doc.grandTotal)}</span>
                  </span>
                </div>
                <div className="px-2 py-1.5">
                  <div className="text-[8px] font-bold" style={{ color: INK }}>
                    Amount in Words:
                  </div>
                  <div className="text-[8px] leading-[1.4]" style={{ color: INK_SOFT }}>
                    {doc.amountInWords}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {options.showBank ? (
            <div className="flex flex-col border" style={{ borderColor: line }}>
              <div className="px-1 pt-1">
                <SectionTab accent={accent}>BANK INFORMATION</SectionTab>
              </div>
              <table className="w-full text-[8px]">
                <tbody>
                  {doc.bank.map((entry, index) => (
                    <tr key={`${entry.label}-${index}`}>
                      <td
                        className="w-[38%] py-[3px] pl-3 align-top font-semibold"
                        style={{ color: INK }}
                      >
                        {entry.label}
                      </td>
                      <td className="w-[6%] py-[3px] align-top" style={{ color: INK_SOFT }}>
                        :
                      </td>
                      <td className="py-[3px] pr-2 align-top" style={{ color: INK_SOFT }}>
                        {entry.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ── Terms, documents and signature ─────────────────────────── */}
      {showTermsRow ? (
        <section
          className={`relative grid gap-[2mm] ${
            options.showConditions && showRightStack ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {options.showConditions ? (
            <div className="border" style={{ borderColor: line }}>
              <div className="px-1 pt-1">
                <SectionTab accent={accent}>TERMS &amp; CONDITIONS</SectionTab>
              </div>
              <ol className="list-decimal space-y-[2px] py-1.5 pr-2 pl-6">
                {doc.conditions.map((condition, index) => (
                  <li
                    key={`${condition}-${index}`}
                    className="text-[6.5px] leading-[1.45]"
                    style={{ color: INK_SOFT }}
                  >
                    {condition}
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {showRightStack ? (
            <div className="flex flex-col gap-[2mm]">
              {options.showChecklist ? (
                <div className="border" style={{ borderColor: line }}>
                  <div className="px-1 pt-1">
                    <SectionTab accent={accent}>DOCUMENTS ATTACHED</SectionTab>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-[3px] px-3 py-2">
                    {doc.documents.map((item, index) => (
                      <Checkbox
                        key={`${item.label}-${index}`}
                        checked={item.checked}
                        label={item.label}
                        accent={accent}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {options.showSignature ? (
                <div className="flex flex-1 flex-col border" style={{ borderColor: line }}>
                  <div className="px-1 pt-1">
                    <SectionTab accent={accent}>FOR &amp; ON BEHALF OF</SectionTab>
                  </div>
                  <div className="flex flex-1 items-end justify-between gap-2 px-3 pt-1 pb-2">
                    <div className="flex-1">
                      <div className="text-[9px] font-bold" style={{ color: accent }}>
                        {doc.seller.name || PI_COMPANY.name}
                      </div>
                      <div
                        className="mt-4 text-[13px] italic"
                        style={{
                          color: "#1F2937",
                          fontFamily: "Georgia, 'Times New Roman', serif",
                        }}
                        aria-hidden="true"
                      >
                        Aroorul Ohye
                      </div>
                      <div className="mt-[2px] border-t pt-[3px]" style={{ borderColor: "#4B5563" }}>
                        <span className="text-[8px] font-semibold" style={{ color: INK }}>
                          Authorized Signature
                        </span>
                      </div>
                    </div>
                    {options.showSeal ? <CompanySeal accent={accent} /> : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ── Note and footer ────────────────────────────────────────── */}
      {options.showNote && doc.note ? (
        <div
          className="relative border px-2 py-[5px] text-[8px] font-semibold"
          style={{ borderColor: line, color: INK }}
        >
          Note : {doc.note}
        </div>
      ) : null}

      {options.showFooter ? (
        <footer
          className="relative mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-1.5 text-[7.5px]"
          style={{ borderColor: line, color: INK_SOFT }}
        >
          <span>
            Generated By : <strong style={{ color: accent }}>{doc.generatedBy}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Timer size={9} strokeWidth={2.2} aria-hidden="true" />
            Print Date &amp; Time : {doc.printedAt || "—"}
          </span>
          <span>
            Document Status : <strong style={{ color: accent }}>{doc.status}</strong>
          </span>
        </footer>
      ) : null}
    </article>
  );
}
