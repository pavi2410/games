import { DV, type Dir, type Level } from "./levels";

export type Pt = [number, number];

/** Grid cell indices -> SVG points at cell centers. */
export const toPts = (cells: number[], w: number): Pt[] =>
  cells.map((i) => [(i % w) + 0.5, ((i / w) | 0) + 0.5]);

export function pathLen(pts: Pt[]): number {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return l;
}

/** Straight extension past the head, so the body can follow it out. */
export function extendPath(pts: Pt[], dir: Dir, dist: number): Pt[] {
  const [hx, hy] = pts[pts.length - 1];
  return [...pts, [hx + DV[dir][0] * dist, hy + DV[dir][1] * dist]];
}

/** Sub-polyline between two arc-length offsets. */
export function slicePath(pts: Pt[], from: number, to: number): Pt[] {
  const out: Pt[] = [];
  let acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const a = acc;
    const b = acc + len;
    if (len > 0 && b > from && a < to) {
      const t0 = (Math.max(from, a) - a) / len;
      const t1 = (Math.min(to, b) - a) / len;
      if (!out.length) out.push([x1 + (x2 - x1) * t0, y1 + (y2 - y1) * t0]);
      out.push([x1 + (x2 - x1) * t1, y1 + (y2 - y1) * t1]);
    }
    acc = b;
  }
  return out;
}

export interface Ray {
  /** Free cells ahead of the head before the blocker / edge. */
  free: number;
  /** Blocking piece id, or null if the way out is clear. */
  hit: number | null;
}

/** March the head's ray over remaining pieces. */
export function castRay(level: Level, alive: readonly boolean[], id: number): Ray {
  const { w, h, pieces } = level;
  const owner = new Map<number, number>();
  pieces.forEach((p, k) => {
    if (alive[k]) for (const c of p.cells) owner.set(c, k);
  });

  const p = pieces[id];
  const head = p.cells[p.cells.length - 1];
  let x = head % w;
  let y = (head / w) | 0;
  let free = 0;
  for (;;) {
    x += DV[p.dir][0];
    y += DV[p.dir][1];
    if (x < 0 || y < 0 || x >= w || y >= h) return { free, hit: null };
    const o = owner.get(y * w + x);
    if (o !== undefined) return { free, hit: o };
    free++;
  }
}
