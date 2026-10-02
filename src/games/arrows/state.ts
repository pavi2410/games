import { createSignal, createStore, onSettled } from "solid-js";
import { load, save } from "../../lib/storage";
import { sfx } from "../../lib/sound";
import { LEVEL_COUNT, makeLevel, type Dir, type Level } from "./levels";
import { castRay, extendPath, pathLen, slicePath, toPts, type Pt } from "./logic";

export type Status = "playing" | "won" | "lost";
export const HEARTS = 5;
const SPEED = 16; // cells / second
const PROG_KEY = "ar:progress";

interface Prog {
  unlocked: number;
  done: number[];
}

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

export function createArrows() {
  const [prog, setProg] = createSignal<Prog>(load(PROG_KEY, { unlocked: 0, done: [] }));
  const [li, setLi] = createSignal(0);
  let lv = makeLevel(1); // plain: level layout never changes mid-level
  const [dims, setDims] = createSignal({ w: lv.w, h: lv.h });
  const [shapes, setShapes] = createStore<Shape[]>(shapesOf(lv));
  const [hearts, setHearts] = createSignal(HEARTS);
  const [status, setStatus] = createSignal<Status>("playing");
  const [busy, setBusy] = createSignal(false);
  const [bad, setBad] = createSignal<readonly number[]>([]);

  let raf = 0;
  onSettled(() => () => cancelAnimationFrame(raf));

  function loadLevel(n: number) {
    cancelAnimationFrame(raf);
    lv = makeLevel(n + 1);
    setDims({ w: lv.w, h: lv.h });
    setShapes(() => shapesOf(lv));
    setLi(n);
    setHearts(HEARTS);
    setStatus("playing");
    setBusy(false);
    setBad([]);
  }

  function win() {
    setStatus("won");
    sfx.win();
    setProg((p) => {
      const next = {
        unlocked: Math.max(p.unlocked, Math.min(li() + 1, LEVEL_COUNT - 1)),
        done: p.done.includes(li()) ? p.done : [...p.done, li()],
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
    if (busy() || status() !== "playing" || shapes[id].gone) return;
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
    if (n >= 0 && n < LEVEL_COUNT && n <= prog().unlocked) loadLevel(n);
  }

  return {
    shapes, hearts, status, li, prog, bad, dims,
    levelNo: () => li() + 1,
    tap,
    restart: () => loadLevel(li()),
    selectLevel,
    next: () => selectLevel(li() + 1),
    prev: () => selectLevel(li() - 1),
  };
}

export type Arrows = ReturnType<typeof createArrows>;
