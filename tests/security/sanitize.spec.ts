import { expect, test } from "@playwright/test";
import {
  escapeHtml,
  hasControlChars,
  isSafeInternalPath,
  isValidSlug,
  MAX_QUERY_LENGTH,
  parseSlug,
  safeColor,
  safeCsvCell,
  safeInternalPath,
  safeNumber,
  sanitizeQuery,
  stripUnsafeChars,
} from "@/lib/security/sanitize";

test.describe("sanitizeQuery", () => {
  test("strips control characters including NUL", () => {
    expect(sanitizeQuery("ab\u0000cd")).toBe("abcd");
    expect(sanitizeQuery("ab\u001Fcd")).toBe("abcd");
    expect(sanitizeQuery("ab\u007Fcd")).toBe("abcd");
    expect(sanitizeQuery("ab\u009Fcd")).toBe("abcd");
  });

  test("strips zero-width and bidi-override characters", () => {
    // These are how a label is disguised: renders as one thing, compares as
    // another.
    expect(sanitizeQuery("ad\u200Bmin")).toBe("admin");
    expect(sanitizeQuery("\u202Egnp.exe")).toBe("gnp.exe");
    expect(sanitizeQuery("a\uFEFFb")).toBe("ab");
  });

  test("collapses whitespace and trims", () => {
    expect(sanitizeQuery("  metal    button  ")).toBe("metal button");
    expect(sanitizeQuery("a\tb\nc")).toBe("abc");
  });

  test("caps length", () => {
    const long = "x".repeat(500);
    expect(sanitizeQuery(long)).toHaveLength(MAX_QUERY_LENGTH);
  });

  test("leaves markup as inert text rather than trying to clean it", () => {
    // The defence is that this is only ever compared and rendered as text.
    expect(sanitizeQuery("<script>alert(1)</script>")).toBe(
      "<script>alert(1)</script>",
    );
  });

  test("handles a non-string without throwing", () => {
    expect(sanitizeQuery(undefined as unknown as string)).toBe("");
    expect(sanitizeQuery(null as unknown as string)).toBe("");
  });
});

test.describe("stripUnsafeChars / hasControlChars", () => {
  test("detects control characters", () => {
    expect(hasControlChars("clean")).toBe(false);
    expect(hasControlChars("bad\u0000")).toBe(true);
    expect(hasControlChars("bad\u001B")).toBe(true);
  });

  test("preserves ordinary unicode", () => {
    expect(stripUnsafeChars("বাংলা ৳ métal")).toBe("বাংলা ৳ métal");
  });
});

test.describe("isValidSlug / parseSlug", () => {
  test("accepts registry-shaped slugs", () => {
    for (const slug of ["qms", "sales-order", "ai-document-input", "bom"]) {
      expect(isValidSlug(slug)).toBe(true);
    }
  });

  test("rejects anything outside the strict pattern", () => {
    for (const slug of [
      "",
      "Sales-Order", // uppercase
      "sales_order", // underscore
      "-leading",
      "trailing-",
      "double--dash",
      "../etc",
      "a b",
      "a/b",
      "<script>",
      "a".repeat(65),
    ]) {
      expect(isValidSlug(slug), `${slug} must be rejected`).toBe(false);
    }
  });

  test("decodes before validating so encoded traversal is caught", () => {
    expect(parseSlug("%2e%2e%2f")).toBeNull();
    expect(parseSlug("..%2fetc")).toBeNull();
    expect(parseSlug("qms%00")).toBeNull();
  });

  test("rejects malformed percent-encoding instead of throwing", () => {
    expect(parseSlug("%")).toBeNull();
    expect(parseSlug("%zz")).toBeNull();
  });

  test("returns the decoded slug when valid", () => {
    expect(parseSlug("sales-order")).toBe("sales-order");
    expect(parseSlug(undefined)).toBeNull();
  });
});

test.describe("isSafeInternalPath", () => {
  test("accepts path-absolute same-origin URLs", () => {
    expect(isSafeInternalPath("/dashboard")).toBe(true);
    expect(isSafeInternalPath("/m/qms/capa")).toBe(true);
  });

  test("blocks protocol-relative and absolute URLs", () => {
    expect(isSafeInternalPath("//evil.com")).toBe(false);
    expect(isSafeInternalPath("https://evil.com")).toBe(false);
    expect(isSafeInternalPath("http://evil.com")).toBe(false);
  });

  test("blocks javascript and data schemes", () => {
    expect(isSafeInternalPath("javascript:alert(1)")).toBe(false);
    expect(isSafeInternalPath("/javascript:alert(1)")).toBe(false);
    expect(isSafeInternalPath("data:text/html,<script>")).toBe(false);
  });

  test("blocks backslash normalisation tricks", () => {
    expect(isSafeInternalPath("/\\evil.com")).toBe(false);
    expect(isSafeInternalPath("\\\\evil.com")).toBe(false);
  });

  test("blocks embedded control characters", () => {
    expect(isSafeInternalPath("/dash\u0000board")).toBe(false);
    expect(isSafeInternalPath("/dash\nboard")).toBe(false);
  });

  test("falls back rather than throwing at a navigation site", () => {
    expect(safeInternalPath("https://evil.com")).toBe("/dashboard");
    expect(safeInternalPath("/m/qms")).toBe("/m/qms");
    expect(safeInternalPath("//evil.com", "/modules")).toBe("/modules");
  });
});

test.describe("escapeHtml", () => {
  test("escapes every markup-significant character", () => {
    expect(escapeHtml(`<img src="x" onerror='alert(1)'>&`)).toBe(
      "&lt;img src=&quot;x&quot; onerror=&#39;alert(1)&#39;&gt;&amp;",
    );
  });

  test("escapes the ampersand first so entities are not double-broken", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });
});

test.describe("safeCsvCell", () => {
  test("neutralises formula injection", () => {
    // Excel and Sheets execute a cell starting with these characters.
    expect(safeCsvCell("=1+1")).toBe("'=1+1");
    expect(safeCsvCell("+ADD")).toBe("'+ADD");
    expect(safeCsvCell("-1")).toBe("'-1");
    expect(safeCsvCell("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(safeCsvCell("=cmd|'/c calc'!A1")).toBe("'=cmd|'/c calc'!A1");
  });

  test("leaves ordinary values alone", () => {
    expect(safeCsvCell("Metal Button")).toBe("Metal Button");
    expect(safeCsvCell(1234)).toBe("1234");
  });
});

test.describe("safeColor", () => {
  test("accepts the shapes the design system emits", () => {
    expect(safeColor("var(--series-1)")).toBe("var(--series-1)");
    expect(safeColor("#3987e5")).toBe("#3987e5");
    expect(safeColor("rgba(12, 163, 12, 0.14)")).toBe("rgba(12, 163, 12, 0.14)");
    expect(safeColor("transparent")).toBe("transparent");
  });

  test("refuses anything that could smuggle a declaration", () => {
    expect(safeColor("url(javascript:alert(1))")).toBe("var(--series-1)");
    expect(safeColor("red; background: url(//evil)")).toBe("var(--series-1)");
    expect(safeColor("expression(alert(1))")).toBe("var(--series-1)");
  });
});

test.describe("safeNumber", () => {
  test("clamps into range", () => {
    expect(safeNumber(150, 0, 100)).toBe(100);
    expect(safeNumber(-20, 0, 100)).toBe(0);
    expect(safeNumber(42, 0, 100)).toBe(42);
  });

  test("falls back for non-finite input", () => {
    expect(safeNumber(Number.NaN, 0, 100, 7)).toBe(7);
    expect(safeNumber(Infinity, 0, 100, 7)).toBe(7);
    expect(safeNumber("abc", 0, 100, 7)).toBe(7);
    expect(safeNumber(undefined, 0, 100, 7)).toBe(7);
  });
});
