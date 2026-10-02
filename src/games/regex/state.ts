import { createMemo, createSignal } from "solid-js";
import { load, save } from "../../lib/storage";
import { LEVELS } from "./levels";
import { evaluate } from "./logic";

const KEY = "rx:best";

export function createRegex() {
  const [li, setLi] = createSignal(0);
  const [src, setSrc] = createSignal("");
  const [best, setBest] = createSignal<Record<number, number>>(load(KEY, {}));

  const level = () => LEVELS[li()];
  const result = createMemo(() => evaluate(level(), src()));

  /** Input handler: update and record the best length on a solve. */
  function edit(v: string) {
    setSrc(v);
    if (!v || !evaluate(level(), v).ok) return;
    const prev = best()[li()];
    if (prev === undefined || v.length < prev) {
      const next = { ...best(), [li()]: v.length };
      setBest(next);
      save(KEY, next);
    }
  }

  function select(n: number) {
    if (n < 0 || n >= LEVELS.length) return;
    setLi(n);
    setSrc("");
  }

  return {
    li, src, best, level, result, edit, select,
    next: () => select(li() + 1),
  };
}

export type Regex = ReturnType<typeof createRegex>;
