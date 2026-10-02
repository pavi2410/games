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

/**
 * Deterministic per-level generator. Pieces are placed in *reverse* removal
 * order: each new piece's head ray may not hit anything already placed, so
 * removing pieces newest-first always works -> every level is solvable.
 */
export function makeLevel(n: number): Level {
  const w = Math.min(5 + ((n - 1) >> 1), 10);
  const h = Math.round(w * 1.4);
  const target = Math.min(0.4 + n * 0.02, 0.88);
  const maxLen = Math.min(3 + (n >> 1), 9);
  const turn = Math.min(0.15 + n * 0.02, 0.5);
  const rand = mulberry32(n * 7919 + 13);

  const total = w * h;
  const occ = new Uint8Array(total);
  const pieces: Piece[] = [];
  let filled = 0;

  for (let tries = 0; tries < 8000 && filled < target * total; tries++) {
    const start = Math.floor(rand() * total);
    if (occ[start]) continue;

    const len = 2 + Math.floor(rand() * (maxLen - 1));
    const cells = [start];
    const own = new Set(cells);
    let dir: Dir | null = null;

    while (cells.length < len) {
      const cur = cells[cells.length - 1];
      const cx = cur % w;
      const cy = (cur / w) | 0;
      const opts = DIRS.filter((d) => {
        const nx = cx + DV[d][0];
        const ny = cy + DV[d][1];
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) return false;
        const ni = ny * w + nx;
        return !occ[ni] && !own.has(ni);
      });
      if (!opts.length) break;
      const keep: boolean = dir !== null && opts.includes(dir) && rand() > turn;
      const step: Dir = keep && dir ? dir : opts[Math.floor(rand() * opts.length)];
      dir = step;
      const ni = (cy + DV[step][1]) * w + (cx + DV[step][0]);
      cells.push(ni);
      own.add(ni);
    }
    if (cells.length < 2 || !dir) continue;

    // Head ray must be clear of everything placed so far (and of itself).
    let x = cells[cells.length - 1] % w;
    let y = ((cells[cells.length - 1] / w) | 0);
    let ok = true;
    for (;;) {
      x += DV[dir][0];
      y += DV[dir][1];
      if (x < 0 || y < 0 || x >= w || y >= h) break;
      const i = y * w + x;
      if (occ[i] || own.has(i)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;

    for (const c of cells) occ[c] = 1;
    filled += cells.length;
    pieces.push({ cells, dir });
  }

  return { w, h, pieces };
}
