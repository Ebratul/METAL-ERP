/**
 * Formatting helpers.
 *
 * All formatters pin an explicit locale ("en-US"). Relying on the ambient
 * locale makes the server render and the browser render disagree, which
 * surfaces as a React hydration error — the numbers are baked into the HTML.
 */

const LOCALE = "en-US";

const compact = new Intl.NumberFormat(LOCALE, {
  notation: "compact",
  maximumFractionDigits: 2,
});

const decimal = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 0,
});

const decimal2 = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** 24_570_000 -> "24.57M" */
export function compactNumber(value: number): string {
  return compact.format(value);
}

/** 24_570_000 -> "$24.57M" */
export function compactCurrency(value: number, symbol = "$"): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}${symbol}${compact.format(Math.abs(value))}`;
}

/** 1234567 -> "1,234,567" */
export function number(value: number): string {
  return decimal.format(value);
}

/** 1234567.891 -> "$1,234,567.89" */
export function currency(value: number, symbol = "$"): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}${symbol}${decimal2.format(Math.abs(value))}`;
}

/** 12.456 -> "12.5%" */
export function percent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** Signed delta for trend chips: 12.5 -> "+12.5%" */
export function signedPercent(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function kg(value: number): string {
  return `${decimal.format(value)} kg`;
}

export function pcs(value: number): string {
  return `${decimal.format(value)} pcs`;
}

/** ISO date -> "12 Aug 2025". Fixed locale + UTC for SSR stability. */
export function shortDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** ISO date -> "12 Aug". */
export function dayMonth(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(iso));
}

/** Clamp a number into a range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** "sales-order-management" -> "Sales Order Management" */
export function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/** Initials for avatars: "Rashed Khan" -> "RK" */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
