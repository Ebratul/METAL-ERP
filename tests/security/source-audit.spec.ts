import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { expect, test } from "@playwright/test";

/**
 * Static source audit.
 *
 * These assert invariants about the code itself rather than the running app —
 * they catch a dangerous pattern the moment someone introduces it, instead of
 * waiting for it to become an exploitable page.
 */

const SRC_ROOT = join(process.cwd(), "src");

function collectSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectSourceFiles(full));
    } else if (/\.(ts|tsx)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const SOURCE_FILES = collectSourceFiles(SRC_ROOT);

function findMatches(pattern: RegExp): string[] {
  const hits: string[] = [];
  for (const file of SOURCE_FILES) {
    const contents = readFileSync(file, "utf8");
    if (pattern.test(contents)) {
      hits.push(relative(process.cwd(), file));
    }
    pattern.lastIndex = 0;
  }
  return hits;
}

test.describe("Source audit", () => {
  test("scans a non-trivial number of files", () => {
    // Guards against the collector silently returning nothing and every
    // assertion below passing vacuously.
    expect(SOURCE_FILES.length).toBeGreaterThan(25);
  });

  test("never uses dangerouslySetInnerHTML", () => {
    expect(findMatches(/dangerouslySetInnerHTML/)).toEqual([]);
  });

  test("never assigns innerHTML or outerHTML", () => {
    expect(findMatches(/\.(inner|outer)HTML\s*=/)).toEqual([]);
  });

  test("never calls eval or the Function constructor", () => {
    expect(findMatches(/\beval\s*\(/)).toEqual([]);
    expect(findMatches(/new\s+Function\s*\(/)).toEqual([]);
  });

  test("never uses document.write", () => {
    expect(findMatches(/document\s*\.\s*write/)).toEqual([]);
  });

  test("never calls insertAdjacentHTML", () => {
    expect(findMatches(/insertAdjacentHTML/)).toEqual([]);
  });

  test("passes no string to setTimeout or setInterval", () => {
    expect(findMatches(/set(?:Timeout|Interval)\s*\(\s*["'`]/)).toEqual([]);
  });

  test("contains no hardcoded credentials", () => {
    // `src/lib/org.ts` is the one sanctioned exception: it holds the demo
    // account the login screen pre-fills and displays on screen. It guards
    // nothing — there is no backend, and the value is public by design. Any
    // *other* file matching this pattern is a real leak.
    const DEMO_CREDENTIAL_FILE = join("src", "lib", "org.ts");

    const hits = findMatches(
      /(?:api[_-]?key|secret|password|passwd|private[_-]?key|access[_-]?token)\s*[:=]\s*["'][^"'\s]{8,}["']/i,
    ).filter((file) => file !== DEMO_CREDENTIAL_FILE);

    expect(hits).toEqual([]);
  });

  test("contains no live-looking provider tokens", () => {
    for (const pattern of [
      /AKIA[0-9A-Z]{16}/,
      /sk_live_[0-9a-zA-Z]{16,}/,
      /ghp_[0-9a-zA-Z]{36}/,
      /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    ]) {
      expect(findMatches(pattern)).toEqual([]);
    }
  });

  test("never reads a raw target=_blank without rel protection", () => {
    for (const file of SOURCE_FILES) {
      const contents = readFileSync(file, "utf8");
      if (!contents.includes('target="_blank"')) continue;
      expect(
        contents,
        `${relative(process.cwd(), file)} opens a new tab without rel="noopener noreferrer"`,
      ).toMatch(/rel=["'][^"']*noopener/);
    }
  });

  test("route params are validated before use", () => {
    // Every dynamic page must run the slug through parseSlug before touching
    // the registry.
    const dynamicPages = SOURCE_FILES.filter(
      (file) => file.includes("[module]") && file.endsWith("page.tsx"),
    );
    expect(dynamicPages.length).toBeGreaterThan(0);

    for (const file of dynamicPages) {
      const contents = readFileSync(file, "utf8");
      expect(
        contents,
        `${relative(process.cwd(), file)} must validate params with parseSlug`,
      ).toContain("parseSlug");
      expect(
        contents,
        `${relative(process.cwd(), file)} must 404 on unknown slugs`,
      ).toContain("notFound()");
    }
  });

  test("the security header config stays present", () => {
    const config = readFileSync(join(process.cwd(), "next.config.ts"), "utf8");
    expect(config).toContain("Content-Security-Policy");
    expect(config).toContain("poweredByHeader: false");
    expect(config).toContain("frame-ancestors 'none'");
    expect(config).toContain("object-src 'none'");
  });
});
