/**
 * Input sanitisation helpers.
 *
 * React escapes anything rendered as a child, so the primary XSS vector in this
 * app is not text interpolation — it is the places where a value becomes
 * something *other* than text: a URL, a route segment, a style value, a
 * `dangerouslySetInnerHTML` payload. These helpers guard those boundaries.
 *
 * Rule for this codebase: `dangerouslySetInnerHTML` is never used. The security
 * test suite asserts that.
 *
 * Character classes are expressed as numeric code-point checks rather than
 * regex literals — a literal containing raw control bytes is invisible in a
 * diff and easy to corrupt in transit.
 */

/** C0 controls (incl. NUL, tab, newline), DEL, and the C1 control block. */
function isControlChar(code: number): boolean {
  return code <= 0x1f || (code >= 0x7f && code <= 0x9f);
}

/**
 * Zero-width joiners and bidi overrides. These are how a label gets disguised —
 * text that renders as one thing and compares as another.
 */
function isInvisibleChar(code: number): boolean {
  return (
    (code >= 0x200b && code <= 0x200f) || // zero-width space … RTL mark
    (code >= 0x202a && code <= 0x202e) || // bidi embedding / override
    (code >= 0x2060 && code <= 0x2064) || // word joiner … invisible plus
    code === 0xfeff // BOM / zero-width no-break space
  );
}

export function hasControlChars(input: string): boolean {
  for (const char of input) {
    const code = char.codePointAt(0);
    if (code !== undefined && isControlChar(code)) return true;
  }
  return false;
}

/** Drop every control and invisible character, keeping the rest untouched. */
export function stripUnsafeChars(input: string): string {
  let out = "";
  for (const char of input) {
    const code = char.codePointAt(0);
    if (code === undefined) continue;
    if (isControlChar(code) || isInvisibleChar(code)) continue;
    out += char;
  }
  return out;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Max length accepted from any free-text search box. */
export const MAX_QUERY_LENGTH = 120;

/**
 * Normalise a free-text query: strip control and invisible characters, collapse
 * whitespace and cap the length so a pathological input cannot drive an
 * expensive scan.
 */
export function sanitizeQuery(input: string): string {
  if (typeof input !== "string") return "";
  return stripUnsafeChars(input).replace(/\s+/g, " ").trim().slice(0, MAX_QUERY_LENGTH);
}

/**
 * A route segment is only ever accepted if it matches the strict slug shape.
 * Anything else — traversal (`../`), encoded traversal, absolute URLs, null
 * bytes — is rejected outright rather than escaped.
 */
export function isValidSlug(input: string): boolean {
  if (typeof input !== "string" || !input || input.length > 64) return false;
  return SLUG_PATTERN.test(input);
}

/** Returns the slug when valid, otherwise `null` so the caller can 404. */
export function parseSlug(input: string | undefined): string | null {
  if (typeof input !== "string") return null;
  let decoded = input;
  try {
    decoded = decodeURIComponent(input);
  } catch {
    // A malformed percent-encoding is itself a rejection.
    return null;
  }
  return isValidSlug(decoded) ? decoded : null;
}

/**
 * Only same-origin, path-absolute URLs are safe to navigate to from
 * user-influenced values. Blocks `//evil.com`, `https://evil.com`,
 * `javascript:` and backslash-normalisation tricks.
 */
export function isSafeInternalPath(path: string): boolean {
  if (typeof path !== "string" || path.length === 0) return false;
  if (!path.startsWith("/")) return false;
  if (path.startsWith("//")) return false;
  if (path.includes("\\")) return false;
  if (hasControlChars(path)) return false;
  // Reject any scheme-looking prefix that survived the leading-slash check.
  if (/^\/+[a-z][a-z0-9+.-]*:/i.test(path)) return false;
  return true;
}

/** Falls back to a safe default rather than throwing at a navigation site. */
export function safeInternalPath(path: string, fallback = "/dashboard"): string {
  return isSafeInternalPath(path) ? path : fallback;
}

/**
 * Escape for contexts where a value is placed into markup by something other
 * than React (e.g. building an SVG string, a CSV cell, a copied snippet).
 */
export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * CSV injection guard: a cell starting with `=`, `+`, `-`, `@`, tab or CR is
 * executed as a formula by Excel and Sheets. Prefix it so it stays text.
 */
export function safeCsvCell(input: string | number): string {
  const value = String(input);
  if (/^[=+\-@\t\r]/.test(value)) return `'${value}`;
  return value;
}

/**
 * Only allow the colour shapes the design system actually emits. Anything else
 * — `url(...)`, `expression(...)`, arbitrary CSS — is refused, so a data-driven
 * colour can never smuggle a declaration into an inline `style`.
 */
const COLOR_PATTERN =
  /^(#[0-9a-f]{3,8}|var\(--[a-z0-9-]+\)|rgba?\([\d\s.,%/]+\)|oklch\([\d\s.,%/-]+\)|color-mix\(in oklab,\s*var\(--[a-z0-9-]+\)\s*\d+%,\s*transparent\)|transparent|currentColor)$/i;

export function safeColor(value: string, fallback = "var(--series-1)"): string {
  if (typeof value !== "string") return fallback;
  return COLOR_PATTERN.test(value.trim()) ? value.trim() : fallback;
}

/** Clamp any externally supplied number into a sane, finite range. */
export function safeNumber(
  value: unknown,
  min: number,
  max: number,
  fallback = min,
): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}
