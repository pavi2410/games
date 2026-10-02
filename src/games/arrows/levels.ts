export type Dir = "N" | "S" | "E" | "W";

export const DIRS: Dir[] = ["N", "S", "E", "W"];
export const DV: Record<Dir, [number, number]> = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0],
};

/** Grid cells tail → head. Head moves straight along `dir`; body follows. */
export interface Piece {
  cells: number[];
  dir: Dir;
}

export interface Level {
  w: number;
  h: number;
  pieces: Piece[];
}

export const LEVEL_COUNT = 30;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Rand = () => number;

/** Densely tile the board with random bendy snakes (leftover singles are glued on). */
function tile(w: number, h: number, rand: Rand, maxLen: number, turn: number): number[][] {
  const total = w * h;
  const owner = new Int16Array(total).fill(-1);
  const paths: number[][] = [];

  const order = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  for (const s of order) {
    if (owner[s] >= 0) continue;
    const id = paths.length;
    const len = 2 + Math.floor(rand() * (maxLen - 1));
    const cells = [s];
    owner[s] = id;
    let dir: Dir | null = null;

    while (cells.length < len) {
      const cur = cells[cells.length - 1];
      const cx = cur % w;
      const cy = (cur / w) | 0;
      const opts = DIRS.filter((d) => {
        const nx = cx + DV[d][0];
        const ny = cy + DV[d][1];
        return nx >= 0 && ny >= 0 && nx < w && ny < h && owner[ny * w + nx] < 0;
      });
      if (!opts.length) break;
      const keep: boolean = dir !== null && opts.includes(dir) && rand() > turn;
      const step: Dir = keep && dir ? dir : opts[Math.floor(rand() * opts.length)];
      dir = step;
      const ni = (cy + DV[step][1]) * w + (cx + DV[step][0]);
      cells.push(ni);
      owner[ni] = id;
    }

    if (cells.length >= 2) {
      paths.push(cells);
      continue;
    }

    // Lone cell: glue onto a neighbouring snake's end, else leave empty.
    owner[s] = -1;
    const x = s % w;
    const y = (s / w) | 0;
    for (const d of DIRS) {
      const nx = x + DV[d][0];
      const ny = y + DV[d][1];
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const nb = ny * w + nx;
      const k = owner[nb];
      if (k < 0) continue;
      const p = paths[k];
      if (p[p.length - 1] === nb) p.push(s);
      else if (p[0] === nb) p.unshift(s);
      else continue;
      owner[s] = k;
      break;
    }
  }
  return paths;
}

const dirOf = (a: number, b: number, w: number): Dir => {
  const dx = (b % w) - (a % w);
  return dx > 0 ? "E" : dx < 0 ? "W" : b > a ? "S" : "N";
};

interface Attempt {
  paths: number[][];
  flips: Uint8Array;
  stuck: number[];
}

/**
 * Pick which end of each snake is the head (hill-climb) so that some clearing
 * order exists, steering the dependency depth toward `targetDepth`.
 */
function orient(paths: number[][], w: number, h: number, rand: Rand, targetDepth: number): Attempt {
  const count = paths.length;
  const total = w * h;

  // Per snake and head choice: the cells its head ray crosses.
  const rays: number[][][] = paths.map((cells) =>
    [0, 1].map((flip) => {
      const c = flip ? [...cells].reverse() : cells;
      const head = c[c.length - 1];
      const dir = dirOf(c[c.length - 2], head, w);
      const out: number[] = [];
      let x = head % w;
      let y = (head / w) | 0;
      for (;;) {
        x += DV[dir][0];
        y += DV[dir][1];
        if (x < 0 || y < 0 || x >= w || y >= h) break;
        out.push(y * w + x);
      }
      return out;
    }),
  );

  const baseOwner = new Int16Array(total).fill(-1);
  paths.forEach((cells, k) => cells.forEach((c) => (baseOwner[c] = k)));

  /** Clear every snake whose ray is free, round by round. */
  const peel = (flips: Uint8Array) => {
    const own = Int16Array.from(baseOwner);
    const alive = new Uint8Array(count).fill(1);
    let remaining = count;
    let depth = 0;
    while (remaining) {
      const rm: number[] = [];
      for (let k = 0; k < count; k++) {
        if (alive[k] && rays[k][flips[k]].every((c) => own[c] < 0)) rm.push(k);
      }
      if (!rm.length) break;
      for (const k of rm) {
        alive[k] = 0;
        remaining--;
        for (const c of paths[k]) own[c] = -1;
      }
      depth++;
    }
    const stuck: number[] = [];
    for (let k = 0; k < count; k++) if (alive[k]) stuck.push(k);
    return { stuck, depth };
  };
  const scoreOf = (r: { stuck: number[]; depth: number }) =>
    r.stuck.length * 1000 + Math.abs(r.depth - targetDepth);

  const flips = new Uint8Array(count).map(() => (rand() < 0.5 ? 1 : 0));
  let cur = peel(flips);
  let score = scoreOf(cur);
  const budget = 800 + count * 30;
  for (let it = 0; it < budget && score > 0; it++) {
    const pool = cur.stuck.length && rand() < 0.7 ? cur.stuck : null;
    const k = pool ? pool[Math.floor(rand() * pool.length)] : Math.floor(rand() * count);
    flips[k] ^= 1;
    const next = peel(flips);
    const sc = scoreOf(next);
    if (sc <= score) {
      cur = next;
      score = sc;
    } else flips[k] ^= 1;
  }
  return { paths, flips, stuck: cur.stuck };
}

/**
 * Deterministic per-level generator: fully tile the board with snakes, then
 * choose head ends so the board is clearable. Retries with fresh tilings; if
 * none is perfect the best attempt drops its few stuck snakes.
 */
export function makeLevel(n: number, ratio = 1.4): Level {
  const w = Math.min(5 + ((n - 1) >> 1), 10);
  const h = Math.round(w * ratio);
  const maxLen = Math.min(3 + (n >> 3), 6);
  const turn = Math.min(0.25 + n * 0.015, 0.55);
  const targetDepth = Math.min(2 + Math.floor(n * 0.45), 12);
  const rand = mulberry32(n * 7919 + 13);

  let best: Attempt | null = null;
  for (let a = 0; a < 40; a++) {
    const att = orient(tile(w, h, rand, maxLen, turn), w, h, rand, targetDepth);
    if (!best || att.stuck.length < best.stuck.length) best = att;
    if (!best.stuck.length) break;
  }

  const { paths, flips, stuck } = best!;
  const drop = new Set(stuck);
  const pieces: Piece[] = [];
  paths.forEach((cells, k) => {
    if (drop.has(k)) return;
    const c = flips[k] ? [...cells].reverse() : cells;
    pieces.push({ cells: c, dir: dirOf(c[c.length - 2], c[c.length - 1], w) });
  });

  return { w, h, pieces };
}
