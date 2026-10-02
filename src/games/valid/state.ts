import { createSignal } from "solid-js";
import { load, save } from "../../lib/storage";
import { sfx } from "../../lib/sound";
import { deal, type Card } from "./data";

const KEY = "vn:best";
export const ROUND = 10;

export function createValid() {
  const [cat, setCat] = createSignal<string | null>(null);
  const [deck, setDeck] = createSignal<Card[]>([]);
  const [i, setI] = createSignal(0);
  const [pick, setPick] = createSignal<boolean | null>(null);
  const [marks, setMarks] = createSignal<boolean[]>([]);
  const [streak, setStreak] = createSignal(0);
  const [top, setTop] = createSignal(0);
  const [over, setOver] = createSignal(false);
  const [best, setBest] = createSignal<Record<string, number>>(load(KEY, {}));

  const card = () => deck()[i()];
  const score = () => marks().filter(Boolean).length;

  function start(id: string) {
    setCat(id);
    setDeck(deal(id, ROUND));
    setI(0);
    setPick(null);
    setMarks([]);
    setStreak(0);
    setTop(0);
    setOver(false);
  }

  /** `says` = the player thinks the card is valid. */
  function answer(says: boolean) {
    if (over() || pick() !== null || !card()) return;
    const right = says === card().ok;
    setPick(says);
    setMarks((m) => [...m, right]);
    if (right) {
      const s = streak() + 1;
      setStreak(s);
      setTop((t) => Math.max(t, s));
      sfx.flag(true);
    } else {
      setStreak(0);
      sfx.error();
    }
  }

  function next() {
    if (pick() === null) return;
    if (i() + 1 < deck().length) {
      setI(i() + 1);
      setPick(null);
      return;
    }
    const id = cat()!;
    if (score() > (best()[id] ?? 0)) {
      const b = { ...best(), [id]: score() };
      setBest(b);
      save(KEY, b);
    }
    setOver(true);
    if (score() >= 7) sfx.win();
  }

  return { cat, deck, i, pick, marks, streak, top, over, best, card, score, start, answer, next, menu: () => setCat(null) };
}

export type Valid = ReturnType<typeof createValid>;
