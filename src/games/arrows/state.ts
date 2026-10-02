import { createSignal, createStore, onSettled } from "solid-js";
import { load, save } from "../../lib/storage";
import { sfx } from "../../lib/sound";
import { LEVELS_PER, makeLevel, type DiffId, type Dir, type Level } from "./levels";
import { castRay, extendPath, pathLen, slicePath, toPts, type Pt } from "./logic";

export type Status = "playing" | "won" | "lost";
export const HEARTS = 5;
const SPEED = 16; // cells / second
const PROG_KEY = "ar:prog2";

interface Prog {
  unlocked: number;
  done: number[];
}
type AllProg = Record<DiffId, Prog>;

const EMPTY: AllProg = {
  easy: { unlocked: 0, done: [] },
  medium: { unlocked: 0, done: [] },
  hard: { unlocked: 0, done: [] },
};

export interface Shape {
  d: string;
  hx: number;
  hy: number;
  dir: Dir;
  gone: boolean;
}

const fmt = (pts: Pt[]) => ({
  d: pts.length > 1 ? "M" + pts.map((p) => `${p[0]} ${p[1]}`).join("L") : "",
  hx: pts.length ? pts[pts.length - 1][0] : 0,
  hy: pts.length ? pts[pts.length - 1][1] : 0,
});

const shapesOf = (lv: Level): Shape[] =>
  lv.pieces.map((p) => ({ ...fmt(toPts(p.cells, lv.w)), dir: p.dir, gone: false }));

/** Phones: grid matches the free screen area (board covers it). Else 1.4. */
function boardRatio(): number {
  if (typeof window === "undefined" || window.innerWidth >= 640) return 1.4;
  const free = (window.innerHeight - 150) / (window.innerWidth - 24);
  return Math.min(Math.max(free, 1.2), 2.1);
}

export function createArrows() {
  const [prog, setProg] = createSignal<AllProg>(load(PROG_KEY, EMPTY));
  const [diff, setDiff] = createSignal<DiffId | null>(null); // null = picker open
  const [menu, setMenu] = createSignal(false);
  const [li, setLi] = createSignal(0);
  let lv = makeLevel(1, "easy", boardRatio()); // plain: layout never changes mid-level
  const [dims, setDims] = createSignal({ w: lv.w, h: lv.h });
  const [shapes, setShapes] = createStore<Shape[]>(shapesOf(lv));
  const [hearts, setHearts] = createSignal(HEARTS);
  const [status, setStatus] = createSignal<Status>("playing");
  const [busy, setBusy] = createSignal(false);
  const [bad, setBad] = createSignal<readonly number[]>([]);

  let raf = 0;
  onSettled(() => () => cancelAnimationFrame(raf));

  function loadLevel(n: number, d: DiffId) {
    cancelAnimationFrame(raf);
    lv = makeLevel(n + 1, d, boardRatio());
    setDims({ w: lv.w, h: lv.h });
    setShapes(() => shapesOf(lv));
    setDiff(d);
    setMenu(false);
    setLi(n);
    setHearts(HEARTS);
    setStatus("playing");
    setBusy(false);
    setBad([]);
  }

  function win() {
    const d = diff()!;
    setStatus("won");
    sfx.win();
    setProg((all) => {
      const p = all[d];
      const next = {
        ...all,
        [d]: {
          unlocked: Math.max(p.unlocked, Math.min(li() + 1, LEVELS_PER - 1)),
          done: p.done.includes(li()) ? p.done : [...p.done, li()],
        },
      };
      save(PROG_KEY, next);
      return next;
    });
  }

  function collide(ids: number[]) {
    setBad(ids);
    setTimeout(() => setBad([]), 400);
    sfx.error();
    const h = hearts() - 1;
    setHearts(h);
    if (h <= 0) setStatus("lost");
  }

  /** Slide the snake along base + straight extension; optionally bounce back. */
  function run(id: number, base: Pt[], dir: Dir, to: number, bounce: boolean, done: () => void) {
    const L = pathLen(base);
    const path = extendPath(base, dir, to);
    const dur = ((bounce ? 2 * to : to) / SPEED) * 1000;
    const t0 = performance.now();
    setBusy(true);

    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      const s = bounce ? to * (1 - Math.abs(1 - 2 * p)) : to * (0.35 * p + 0.65 * p * p);
      const f = fmt(slicePath(path, s, s + L));
      setShapes((st) => {
        st[id].d = f.d;
        st[id].hx = f.hx;
        st[id].hy = f.hy;
      });
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        if (bounce) {
          const f0 = fmt(base);
          setShapes((st) => {
            st[id].d = f0.d;
            st[id].hx = f0.hx;
            st[id].hy = f0.hy;
          });
        }
        setBusy(false);
        done();
      }
    };
    raf = requestAnimationFrame(tick);
  }

  function tap(id: number) {
    if (!diff() || menu() || busy() || status() !== "playing" || shapes[id].gone) return;
    const alive = shapes.map((s) => !s.gone);
    const ray = castRay(lv, alive, id);
    const piece = lv.pieces[id];
    const base = toPts(piece.cells, lv.w);

    if (ray.hit === null) {
      sfx.shoot();
      const to = ray.free + 0.5 + pathLen(base) + 0.3;
      run(id, base, piece.dir, to, false, () => {
        setShapes((s) => {
          s[id].gone = true;
        });
        if (!alive.some((a, k) => a && k !== id)) win();
      });
    } else {
      const hit = ray.hit;
      run(id, base, piece.dir, ray.free + 0.15, true, () => collide([hit, id]));
    }
  }

  function selectLevel(n: number) {
    const d = diff();
    if (d && n >= 0 && n < LEVELS_PER && n <= prog()[d].unlocked) loadLevel(n, d);
  }

  /** Pick a difficulty and resume at its first unfinished level. */
  const pickDiff = (d: DiffId) => loadLevel(prog()[d].unlocked, d);

  return {
    shapes, hearts, status, li, prog, bad, dims, diff,
    unlocked: () => (diff() ? prog()[diff()!].unlocked : 0),
    levelNo: () => li() + 1,
    tap,
    restart: () => diff() && loadLevel(li(), diff()!),
    selectLevel,
    next: () => selectLevel(li() + 1),
    prev: () => selectLevel(li() - 1),
    pickDiff,
    openPicker: () => {
      setMenu(false);
      setDiff(null);
    },
    menu,
    openMenu: () => setMenu(true),
    closeMenu: () => setMenu(false),
  };
}

export type Arrows = ReturnType<typeof createArrows>;
