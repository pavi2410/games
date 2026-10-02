import { load } from "../../lib/storage";

const count = (v: unknown) => (v && typeof v === "object" ? Object.keys(v).length : 0);

/** Progress chip text per game, read straight from each game's saved data. */
export function statFor(id: string): string | null {
  switch (id) {
    case "minesweeper": {
      const n = count(load("ms:best", {}));
      return n ? `${n}/3 modes beaten` : null;
    }
    case "arrows": {
      const all = load<Record<string, { done?: unknown[] }>>("ar:prog2", {});
      const n = Object.values(all).reduce((s, p) => s + (p.done?.length ?? 0), 0);
      return n ? `${n} levels cleared` : null;
    }
    case "regex": {
      const n = count(load("rx:best", {}));
      return n ? `${n}/12 solved` : null;
    }
    case "gates": {
      const n = count(load("lg:best", {}));
      return n ? `${n}/12 solved` : null;
    }
    default:
      return null;
  }
}
