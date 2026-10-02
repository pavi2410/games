import { createMemo, createSignal } from "solid-js";
import { load, save } from "../../lib/storage";
import { LEVELS, type Gate, type Tree } from "./levels";
import { ARITY, check, getAt, setAt } from "./logic";

const KEY = "lg:best";

export function createGates() {
  const [li, setLi] = createSignal(0);
  const [root, setRoot] = createSignal<Tree | null>(null);
  const [sel, setSel] = createSignal<number[] | null>(null); // socket being edited
  const [best, setBest] = createSignal<Record<number, number>>(load(KEY, {}));

  const level = () => LEVELS[li()];
  const result = createMemo(() => check(level(), root()));

  function commit(next: Tree | null) {
    setRoot(next);
    setSel(null);
    const r = check(level(), next);
    if (!r.ok) return;
    const prev = best()[li()];
    if (prev === undefined || r.gates < prev) {
      const all = { ...best(), [li()]: r.gates };
      setBest(all);
      save(KEY, all);
    }
  }

  /** Place an input or gate at the open socket (keeps kids when arity matches). */
  function place(part: { input: string } | { gate: Gate } | null) {
    const path = sel();
    if (!path) return;
    if (!part) return commit(setAt(root(), path, null));
    if ("input" in part) return commit(setAt(root(), path, { k: "in", name: part.input }));

    const old = getAt(root(), path);
    const kids =
      old && old.k === "gate" && old.kids.length === ARITY[part.gate]
        ? old.kids
        : Array.from({ length: ARITY[part.gate] }, () => null);
    commit(setAt(root(), path, { k: "gate", g: part.gate, kids }));
  }

  function select(n: number) {
    if (n < 0 || n >= LEVELS.length) return;
    setLi(n);
    setRoot(null);
    setSel(null);
  }

  return {
    li, root, sel, best, level, result,
    open: (path: number[]) => setSel(path),
    close: () => setSel(null),
    current: () => (sel() ? getAt(root(), sel()!) : null),
    place,
    clear: () => commit(null),
    select,
    next: () => select(li() + 1),
  };
}

export type Gates = ReturnType<typeof createGates>;
