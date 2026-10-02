import type { Gate, Level, Tree } from "./levels";

export const ARITY: Record<Gate, number> = { not: 1, and: 2, or: 2, xor: 2, nand: 2, nor: 2 };
export const LABEL: Record<Gate, string> = {
  not: "NOT",
  and: "AND",
  or: "OR",
  xor: "XOR",
  nand: "NAND",
  nor: "NOR",
};

const OPS: Record<Gate, (a: boolean, b: boolean) => boolean> = {
  not: (a) => !a,
  and: (a, b) => a && b,
  or: (a, b) => a || b,
  xor: (a, b) => a !== b,
  nand: (a, b) => !(a && b),
  nor: (a, b) => !(a || b),
};

/** Evaluate; null if any socket on the way is still empty. */
export function evalTree(t: Tree | null, env: Record<string, boolean>): boolean | null {
  if (!t) return null;
  if (t.k === "in") return env[t.name];
  const vals = t.kids.map((k) => evalTree(k, env));
  if (vals.some((v) => v === null)) return null;
  return OPS[t.g](vals[0]!, vals[1] ?? false);
}

export const countGates = (t: Tree | null): number =>
  !t || t.k === "in" ? 0 : 1 + t.kids.reduce((s, k) => s + countGates(k), 0);

export const isComplete = (t: Tree | null): boolean =>
  !!t && (t.k === "in" || t.kids.every(isComplete));

export function getAt(t: Tree | null, path: number[]): Tree | null {
  let cur = t;
  for (const i of path) {
    if (!cur || cur.k !== "gate") return null;
    cur = cur.kids[i] ?? null;
  }
  return cur;
}

/** Immutable replace of the node at `path`. */
export function setAt(t: Tree | null, path: number[], node: Tree | null): Tree | null {
  if (!path.length) return node;
  if (!t || t.k !== "gate") return t;
  const [i, ...rest] = path;
  const kids = t.kids.slice();
  kids[i] = setAt(kids[i] ?? null, rest, node);
  return { ...t, kids };
}

export interface Row {
  vals: boolean[];
  want: boolean;
  got: boolean | null;
}

export interface Check {
  rows: Row[];
  complete: boolean;
  ok: boolean;
  gates: number;
}

export function check(lv: Level, root: Tree | null): Check {
  const n = lv.inputs.length;
  const rows: Row[] = [];
  for (let i = 0; i < 1 << n; i++) {
    const vals = lv.inputs.map((_, b) => !!((i >> (n - 1 - b)) & 1));
    const env = Object.fromEntries(lv.inputs.map((name, b) => [name, vals[b]]));
    rows.push({ vals, want: lv.fn(vals), got: evalTree(root, env) });
  }
  const complete = isComplete(root);
  return {
    rows,
    complete,
    ok: complete && rows.every((r) => r.got === r.want),
    gates: countGates(root),
  };
}

export const stars = (gates: number, par: number) => (gates <= par ? 3 : gates <= par + 2 ? 2 : 1);
