/**
 * A QR encoder, byte mode, error-correction level M, versions 1–10.
 *
 * The PI document stamps a QR code that links back to the live record, and a
 * decorative lookalike would be worse than none at all — someone scans the
 * printed invoice and nothing resolves. So this is the real thing: Reed-Solomon
 * over GF(256), block interleaving, all eight masks scored by the standard
 * penalty rules, and BCH-coded format and version information.
 *
 * Version 10 at level M holds 213 bytes, which is far more than the record URLs
 * this app produces. Anything longer is rejected rather than silently truncated.
 */

/* ── GF(256) ───────────────────────────────────────────────────────────── */

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);

for (let i = 0, x = 1; i < 255; i += 1) {
  EXP[i] = x;
  LOG[x] = i;
  x <<= 1;
  if (x & 0x100) x ^= 0x11d; // primitive polynomial x^8 + x^4 + x^3 + x^2 + 1
}
for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return EXP[LOG[a] + LOG[b]];
}

/** Generator polynomial for `degree` error-correction codewords. */
function generatorPoly(degree: number): number[] {
  let poly = [1];
  for (let i = 0; i < degree; i += 1) {
    const next = new Array<number>(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j += 1) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
}

function reedSolomon(data: number[], ecLength: number): number[] {
  const poly = generatorPoly(ecLength);
  const remainder = new Array<number>(ecLength).fill(0);

  for (const byte of data) {
    const factor = byte ^ remainder[0];
    remainder.shift();
    remainder.push(0);
    for (let i = 0; i < ecLength; i += 1) {
      remainder[i] ^= gfMul(poly[i + 1], factor);
    }
  }
  return remainder;
}

/* ── Version tables (level M) ──────────────────────────────────────────── */

interface VersionInfo {
  /** Error-correction codewords per block. */
  ec: number;
  /** [blockCount, dataCodewordsPerBlock] for each of the one or two groups. */
  groups: Array<[number, number]>;
  /** Row/column centres for alignment patterns. */
  alignment: number[];
}

const VERSIONS: Record<number, VersionInfo> = {
  1: { ec: 10, groups: [[1, 16]], alignment: [] },
  2: { ec: 16, groups: [[1, 28]], alignment: [6, 18] },
  3: { ec: 26, groups: [[1, 44]], alignment: [6, 22] },
  4: { ec: 18, groups: [[2, 32]], alignment: [6, 26] },
  5: { ec: 24, groups: [[2, 43]], alignment: [6, 30] },
  6: { ec: 16, groups: [[4, 27]], alignment: [6, 34] },
  7: { ec: 18, groups: [[4, 31]], alignment: [6, 22, 38] },
  8: { ec: 22, groups: [[2, 38], [2, 39]], alignment: [6, 24, 42] },
  9: { ec: 22, groups: [[3, 36], [2, 37]], alignment: [6, 26, 46] },
  10: { ec: 26, groups: [[4, 43], [1, 44]], alignment: [6, 28, 50] },
};

const MAX_VERSION = 10;

function dataCodewords(version: number): number {
  return VERSIONS[version].groups.reduce(
    (sum, [blocks, size]) => sum + blocks * size,
    0,
  );
}

/** Byte-mode payload capacity, allowing for the mode and count indicators. */
function byteCapacity(version: number): number {
  const countBits = version < 10 ? 8 : 16;
  return Math.floor((dataCodewords(version) * 8 - 4 - countBits) / 8);
}

/* ── Bit stream ────────────────────────────────────────────────────────── */

class BitBuffer {
  private bits: number[] = [];

  put(value: number, length: number) {
    for (let i = length - 1; i >= 0; i -= 1) {
      this.bits.push((value >>> i) & 1);
    }
  }

  get length(): number {
    return this.bits.length;
  }

  padToByte() {
    while (this.bits.length % 8 !== 0) this.bits.push(0);
  }

  toCodewords(): number[] {
    const out: number[] = [];
    for (let i = 0; i < this.bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j += 1) byte = (byte << 1) | this.bits[i + j];
      out.push(byte);
    }
    return out;
  }
}

/* ── Codeword assembly ─────────────────────────────────────────────────── */

const PAD_BYTES = [0xec, 0x11];

function buildCodewords(bytes: number[], version: number): number[] {
  const info = VERSIONS[version];
  const capacity = dataCodewords(version);
  const countBits = version < 10 ? 8 : 16;

  const buffer = new BitBuffer();
  buffer.put(0b0100, 4); // byte mode
  buffer.put(bytes.length, countBits);
  for (const byte of bytes) buffer.put(byte, 8);

  // Terminator, up to four zero bits, then pad to a whole codeword.
  buffer.put(0, Math.min(4, capacity * 8 - buffer.length));
  buffer.padToByte();

  const data = buffer.toCodewords();
  for (let i = 0; data.length < capacity; i += 1) {
    data.push(PAD_BYTES[i % 2]);
  }

  // Split into blocks, compute EC per block, then interleave both sets.
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let offset = 0;
  for (const [blocks, size] of info.groups) {
    for (let i = 0; i < blocks; i += 1) {
      const block = data.slice(offset, offset + size);
      offset += size;
      dataBlocks.push(block);
      ecBlocks.push(reedSolomon(block, info.ec));
    }
  }

  const result: number[] = [];
  const longestData = Math.max(...dataBlocks.map((block) => block.length));
  for (let i = 0; i < longestData; i += 1) {
    for (const block of dataBlocks) {
      if (i < block.length) result.push(block[i]);
    }
  }
  for (let i = 0; i < info.ec; i += 1) {
    for (const block of ecBlocks) result.push(block[i]);
  }
  return result;
}

/* ── Matrix ────────────────────────────────────────────────────────────── */

interface Grid {
  size: number;
  modules: Uint8Array;
  reserved: Uint8Array;
}

function createGrid(version: number): Grid {
  const size = version * 4 + 17;
  return {
    size,
    modules: new Uint8Array(size * size),
    reserved: new Uint8Array(size * size),
  };
}

function set(grid: Grid, row: number, col: number, dark: boolean, fixed = true) {
  const index = row * grid.size + col;
  grid.modules[index] = dark ? 1 : 0;
  if (fixed) grid.reserved[index] = 1;
}

function isReserved(grid: Grid, row: number, col: number): boolean {
  return grid.reserved[row * grid.size + col] === 1;
}

function placeFinder(grid: Grid, row: number, col: number) {
  for (let r = -1; r <= 7; r += 1) {
    for (let c = -1; c <= 7; c += 1) {
      const y = row + r;
      const x = col + c;
      if (y < 0 || y >= grid.size || x < 0 || x >= grid.size) continue;
      const outerRing = r === 0 || r === 6 || c === 0 || c === 6;
      const core = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      const inside = r >= 0 && r <= 6 && c >= 0 && c <= 6;
      set(grid, y, x, inside && (outerRing || core));
    }
  }
}

function placeAlignment(grid: Grid, version: number) {
  const centres = VERSIONS[version].alignment;
  // The outermost alignment centre sits on the finder rows/columns.
  const last = grid.size - 7;

  for (const row of centres) {
    for (const col of centres) {
      // The three finder corners already own their space.
      const atFinder =
        (row === 6 && col === 6) ||
        (row === 6 && col === last) ||
        (row === last && col === 6);
      if (atFinder) continue;

      for (let r = -2; r <= 2; r += 1) {
        for (let c = -2; c <= 2; c += 1) {
          const ring = Math.max(Math.abs(r), Math.abs(c));
          set(grid, row + r, col + c, ring !== 1);
        }
      }
    }
  }
}

function placeTiming(grid: Grid) {
  for (let i = 8; i < grid.size - 8; i += 1) {
    const dark = i % 2 === 0;
    set(grid, 6, i, dark);
    set(grid, i, 6, dark);
  }
}

/** Mark the format-information strips so data placement skips them. */
function reserveFormat(grid: Grid) {
  for (let i = 0; i < 9; i += 1) {
    if (i !== 6) {
      set(grid, 8, i, false);
      set(grid, i, 8, false);
    }
  }
  for (let i = 0; i < 8; i += 1) {
    set(grid, 8, grid.size - 1 - i, false);
    set(grid, grid.size - 1 - i, 8, false);
  }
  set(grid, grid.size - 8, 8, true); // the always-dark module
}

/** BCH(18,6) version information, present from version 7 upward. */
function versionBits(version: number): number {
  let remainder = version;
  for (let i = 0; i < 12; i += 1) {
    remainder = (remainder << 1) ^ ((remainder >>> 11) * 0x1f25);
  }
  return ((version << 12) | remainder) & 0x3ffff;
}

function placeVersion(grid: Grid, version: number) {
  if (version < 7) return;
  const bits = versionBits(version);
  for (let i = 0; i < 18; i += 1) {
    const dark = ((bits >> i) & 1) === 1;
    const row = Math.floor(i / 3);
    const col = grid.size - 11 + (i % 3);
    set(grid, row, col, dark);
    set(grid, col, row, dark);
  }
}

/** BCH(15,5) format information for level M and the chosen mask. */
function formatBits(mask: number): number {
  const data = (0b00 << 3) | mask; // 00 = error-correction level M
  let remainder = data;
  for (let i = 0; i < 10; i += 1) {
    remainder = (remainder << 1) ^ ((remainder >>> 9) * 0x537);
  }
  return (((data << 10) | remainder) ^ 0x5412) & 0x7fff;
}

/**
 * Format information is written twice, least-significant bit first: once down
 * the column and along the row beside the top-left finder, and once split
 * between the strips at the other two finders.
 */
function placeFormat(grid: Grid, mask: number) {
  const bits = formatBits(mask);
  const last = grid.size - 1;

  for (let i = 0; i < 15; i += 1) {
    const dark = ((bits >> i) & 1) === 1;

    // Copy one, around the top-left finder: column 8 downward, then row 8.
    if (i < 6) set(grid, i, 8, dark);
    else if (i === 6) set(grid, 7, 8, dark);
    else if (i === 7) set(grid, 8, 8, dark);
    else if (i === 8) set(grid, 8, 7, dark);
    else set(grid, 8, 14 - i, dark);

    // Copy two: row 8 at the top-right finder, column 8 at the bottom-left.
    if (i < 8) set(grid, 8, last - i, dark);
    else set(grid, last - 14 + i, 8, dark);
  }
}

function placeData(grid: Grid, codewords: number[]) {
  let bitIndex = 0;
  let upward = true;

  for (let right = grid.size - 1; right > 0; right -= 2) {
    // The vertical timing pattern occupies column 6 — the zigzag steps past it.
    if (right === 6) right = 5;

    for (let step = 0; step < grid.size; step += 1) {
      const row = upward ? grid.size - 1 - step : step;

      for (let offset = 0; offset < 2; offset += 1) {
        const col = right - offset;
        if (isReserved(grid, row, col)) continue;

        const byte = codewords[bitIndex >> 3];
        const dark =
          byte !== undefined && ((byte >> (7 - (bitIndex & 7))) & 1) === 1;
        set(grid, row, col, dark, false);
        bitIndex += 1;
      }
    }
    upward = !upward;
  }
}

const MASKS: Array<(row: number, col: number) => boolean> = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function applyMask(grid: Grid, mask: number): Uint8Array {
  const out = new Uint8Array(grid.modules);
  const test = MASKS[mask];
  for (let row = 0; row < grid.size; row += 1) {
    for (let col = 0; col < grid.size; col += 1) {
      const index = row * grid.size + col;
      if (grid.reserved[index]) continue;
      if (test(row, col)) out[index] ^= 1;
    }
  }
  return out;
}

/** The four penalty rules from the specification, summed. */
function penalty(modules: Uint8Array, size: number): number {
  const at = (row: number, col: number) => modules[row * size + col];
  let score = 0;

  // Rule 1 — runs of five or more same-coloured modules in a line.
  for (let i = 0; i < size; i += 1) {
    let runRow = 1;
    let runCol = 1;
    for (let j = 1; j < size; j += 1) {
      runRow = at(i, j) === at(i, j - 1) ? runRow + 1 : 1;
      if (runRow === 5) score += 3;
      else if (runRow > 5) score += 1;

      runCol = at(j, i) === at(j - 1, i) ? runCol + 1 : 1;
      if (runCol === 5) score += 3;
      else if (runCol > 5) score += 1;
    }
  }

  // Rule 2 — 2x2 blocks of one colour.
  for (let row = 0; row < size - 1; row += 1) {
    for (let col = 0; col < size - 1; col += 1) {
      const value = at(row, col);
      if (
        value === at(row, col + 1) &&
        value === at(row + 1, col) &&
        value === at(row + 1, col + 1)
      ) {
        score += 3;
      }
    }
  }

  // Rule 3 — finder-like 1:1:3:1:1 patterns with four light modules beside them.
  const forward = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const backward = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  const matches = (get: (offset: number) => number, start: number) => {
    let hitForward = true;
    let hitBackward = true;
    for (let i = 0; i < 11; i += 1) {
      const value = get(start + i);
      if (value !== forward[i]) hitForward = false;
      if (value !== backward[i]) hitBackward = false;
    }
    return hitForward || hitBackward;
  };

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j + 11 <= size; j += 1) {
      if (matches((offset) => at(i, offset), j)) score += 40;
      if (matches((offset) => at(offset, i), j)) score += 40;
    }
  }

  // Rule 4 — deviation from an even split of dark and light.
  let dark = 0;
  for (let i = 0; i < modules.length; i += 1) dark += modules[i];
  const ratio = (dark * 100) / modules.length;
  score += Math.floor(Math.abs(ratio - 50) / 5) * 10;

  return score;
}

/* ── Public API ────────────────────────────────────────────────────────── */

export interface QrMatrix {
  size: number;
  /** Row-major, one entry per module: `true` is dark. */
  modules: boolean[];
}

function toBytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text));
}

/**
 * Encode `text` as a QR matrix, or return `null` when it is empty or longer
 * than version 10 at level M can carry.
 */
export function encodeQr(text: string): QrMatrix | null {
  if (!text) return null;

  const bytes = toBytes(text);
  let version = 0;
  for (let candidate = 1; candidate <= MAX_VERSION; candidate += 1) {
    if (bytes.length <= byteCapacity(candidate)) {
      version = candidate;
      break;
    }
  }
  if (version === 0) return null;

  const grid = createGrid(version);
  placeFinder(grid, 0, 0);
  placeFinder(grid, 0, grid.size - 7);
  placeFinder(grid, grid.size - 7, 0);
  placeAlignment(grid, version);
  placeTiming(grid);
  placeVersion(grid, version);
  reserveFormat(grid);
  placeData(grid, buildCodewords(bytes, version));

  let best = 0;
  let bestScore = Number.POSITIVE_INFINITY;
  let bestModules = grid.modules;
  for (let mask = 0; mask < 8; mask += 1) {
    const masked = applyMask(grid, mask);
    const score = penalty(masked, grid.size);
    if (score < bestScore) {
      bestScore = score;
      best = mask;
      bestModules = masked;
    }
  }

  // Format information is not masked, so it is written after the choice is made.
  const finished: Grid = {
    size: grid.size,
    modules: bestModules,
    reserved: grid.reserved,
  };
  placeFormat(finished, best);

  return {
    size: finished.size,
    modules: Array.from(finished.modules, (value) => value === 1),
  };
}

/**
 * The matrix as a single SVG path — one `M h v h v z` sub-path per dark module,
 * in a viewBox of `size + 2 * quiet` units.
 */
export function qrPath(matrix: QrMatrix, quiet = 4): string {
  const parts: string[] = [];
  for (let row = 0; row < matrix.size; row += 1) {
    for (let col = 0; col < matrix.size; col += 1) {
      if (!matrix.modules[row * matrix.size + col]) continue;
      parts.push(`M${col + quiet} ${row + quiet}h1v1h-1z`);
    }
  }
  return parts.join("");
}
