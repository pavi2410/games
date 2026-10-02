// Pure game rules. Operates on a flat, mutable Cell[] (index = y * w + x).

export interface Cell {
  mine: boolean;
  open: boolean;
  flag: boolean;
  boom: boolean;
  n: number; // adjacent mines
}

export const blank = (len: number): Cell[] =>
  Array.from({ length: len }, () => ({ mine: false, open: false, flag: false, boom: false, n: 0 }));

export function around(i: number, w: number, h: number): number[] {
  const x = i % w;
  const y = (i / w) | 0;
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if ((dx || dy) && nx >= 0 && ny >= 0 && nx < w && ny < h) out.push(ny * w + nx);
    }
  }
  return out;
}

/** Place mines avoiding the first-clicked cell and its neighbours (when space allows). */
export function placeMines(cells: Cell[], w: number, h: number, mines: number, safe: number) {
  const banned = new Set([safe, ...around(safe, w, h)]);
  let pool: number[] = [];
  for (let i = 0; i < cells.length; i++) if (!banned.has(i)) pool.push(i);
  if (pool.length < mines) pool = cells.map((_, i) => i).filter((i) => i !== safe);

  for (let k = 0; k < mines; k++) {
    const r = k + Math.floor(Math.random() * (pool.length - k));
    [pool[k], pool[r]] = [pool[r], pool[k]];
    const p = pool[k];
    cells[p].mine = true;
    for (const nb of around(p, w, h)) cells[nb].n++;
  }
}

/** Open cells (iterative flood fill). Returns changed indices and whether a mine was hit. */
export function reveal(cells: Cell[], w: number, h: number, starts: number[]) {
  const opened: number[] = [];
  const stack = [...starts];
  let hit = false;
  while (stack.length) {
    const i = stack.pop()!;
    const c = cells[i];
    if (c.open || c.flag) continue;
    c.open = true;
    opened.push(i);
    if (c.mine) {
      c.boom = hit = true;
    } else if (c.n === 0) {
      for (const nb of around(i, w, h)) stack.push(nb);
    }
  }
  return { opened, hit };
}

/** Neighbours to open when a satisfied number is clicked. */
export function chordTargets(cells: Cell[], w: number, h: number, i: number): number[] {
  const c = cells[i];
  if (!c.open || c.n === 0) return [];
  const nbs = around(i, w, h);
  const flags = nbs.reduce((s, j) => s + (cells[j].flag ? 1 : 0), 0);
  return flags === c.n ? nbs.filter((j) => !cells[j].open && !cells[j].flag) : [];
}

/** Uncover all unflagged mines (on loss). Returns changed indices. */
export function revealMines(cells: Cell[]): number[] {
  const out: number[] = [];
  cells.forEach((c, i) => {
    if (c.mine && !c.flag && !c.open) {
      c.open = true;
      out.push(i);
    }
  });
  return out;
}

/** Flag all remaining mines (on win). Returns changed indices. */
export function flagMines(cells: Cell[]): number[] {
  const out: number[] = [];
  cells.forEach((c, i) => {
    if (c.mine && !c.flag) {
      c.flag = true;
      out.push(i);
    }
  });
  return out;
}
