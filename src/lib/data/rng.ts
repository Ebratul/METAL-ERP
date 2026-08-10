/**
 * Deterministic pseudo-random generators.
 *
 * The demo data is generated on both the server (initial HTML) and the client
 * (hydration). `Math.random()` would produce different numbers in each pass and
 * React would throw a hydration mismatch, so every generator here is seeded and
 * pure: the same seed always yields the same sequence.
 */

/** mulberry32 — small, fast, good enough distribution for demo data. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Turn any string into a stable 32-bit seed (FNV-1a). */
export function hashSeed(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** A seeded generator keyed by a readable string, e.g. `seeded("sales:2025")`. */
export function seeded(key: string): () => number {
  return createRng(hashSeed(key));
}

export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randomFloat(
  rng: () => number,
  min: number,
  max: number,
  digits = 2,
): number {
  const value = rng() * (max - min) + min;
  return Number(value.toFixed(digits));
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

/** Weighted pick. `weights` must align with `items` and sum to anything > 0. */
export function pickWeighted<T>(
  rng: () => number,
  items: readonly T[],
  weights: readonly number[],
): T {
  const total = weights.reduce((sum, w) => sum + w, 0);
  let threshold = rng() * total;
  for (let i = 0; i < items.length; i += 1) {
    threshold -= weights[i];
    if (threshold <= 0) return items[i];
  }
  return items[items.length - 1];
}

/** Fisher–Yates using the seeded stream — stable across renders. */
export function shuffle<T>(rng: () => number, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * A trending series with bounded noise — reads like a real business metric
 * instead of white noise.
 */
export function trendSeries(
  rng: () => number,
  length: number,
  options: {
    start: number;
    drift?: number;
    volatility?: number;
    min?: number;
    digits?: number;
  },
): number[] {
  const { start, drift = 0.02, volatility = 0.06, min = 0, digits = 0 } = options;
  const out: number[] = [];
  let value = start;
  for (let i = 0; i < length; i += 1) {
    const shock = (rng() - 0.5) * 2 * volatility;
    value = Math.max(min, value * (1 + drift + shock));
    out.push(Number(value.toFixed(digits)));
  }
  return out;
}

/** Twelve calendar month labels starting at January. */
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

/**
 * A fixed "today" for the demo. Using a literal keeps every derived date stable
 * between the server render and the client render.
 */
export const DEMO_TODAY = new Date("2026-08-04T00:00:00Z");

/** `daysFromToday(-3)` -> ISO date string three days before the demo date. */
export function daysFromToday(offset: number): string {
  const date = new Date(DEMO_TODAY);
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
}
