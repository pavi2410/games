import { createEffect, createMemo, createSignal, createStore, untrack } from "solid-js";
import { load, save } from "../../lib/storage";
import { LEVELS, type LevelId } from "./levels";
import { blank, chordTargets, flagMines, placeMines, reveal, revealMines, type Cell } from "./logic";

export type Status = "idle" | "playing" | "won" | "lost";
type Best = Partial<Record<LevelId, number>>;

const LEVEL_KEY = "ms:level";
const BEST_KEY = "ms:best";

/**
 * `board` is the plain source of truth (fast to mutate, non-reactive).
 * `cells` is a reactive mirror; only changed indices are synced to it.
 */
export function createGame() {
  const [levelId, setLevelId] = createSignal<LevelId>(load(LEVEL_KEY, "easy"));
  const level = createMemo(() => LEVELS[levelId()]);
  const [status, setStatus] = createSignal<Status>("idle");
  const [flags, setFlags] = createSignal(0);
  const [elapsed, setElapsed] = createSignal(0);
  const [flagMode, setFlagMode] = createSignal(false);
  const [best, setBest] = createSignal<Best>(load(BEST_KEY, {}));

  const size = (id: LevelId) => LEVELS[id].w * LEVELS[id].h;
  let board = blank(size(untrack(levelId)));
  let safeOpened = 0;
  const [cells, setCells] = createStore<Cell[]>(blank(board.length));

  createEffect(status, (s) => {
    if (s !== "playing") return;
    const id = setInterval(() => setElapsed((e) => Math.min(e + 1, 999)), 1000);
    return () => clearInterval(id);
  });

  const sync = (idx: number[]) =>
    setCells((s) => {
      for (const i of idx) {
        const d = s[i];
        const b = board[i];
        d.mine = b.mine;
        d.open = b.open;
        d.flag = b.flag;
        d.boom = b.boom;
        d.n = b.n;
      }
    });

  function restart(id: LevelId = levelId()) {
    board = blank(size(id));
    safeOpened = 0;
    setCells(() => blank(board.length));
    setLevelId(id);
    setStatus("idle");
    setFlags(0);
    setElapsed(0);
    save(LEVEL_KEY, id);
  }

  function finish(won: boolean) {
    const l = level();
    const changed = won ? flagMines(board) : revealMines(board);
    if (won) {
      setFlags(l.mines);
      const prev = best()[levelId()];
      const t = elapsed();
      if (!prev || t < prev) {
        const next = { ...best(), [levelId()]: t };
        setBest(next);
        save(BEST_KEY, next);
      }
    }
    setStatus(won ? "won" : "lost");
    sync(changed);
  }

  function play(starts: number[]) {
    if (!starts.length) return;
    const { w, h, mines } = level();
    const { opened, hit } = reveal(board, w, h, starts);
    safeOpened += opened.reduce((s, i) => s + (board[i].mine ? 0 : 1), 0);
    sync(opened);
    if (hit) finish(false);
    else if (safeOpened === w * h - mines) finish(true);
  }

  const over = () => status() === "won" || status() === "lost";

  function open(i: number) {
    if (over() || board[i].flag) return;
    const { w, h, mines } = level();
    if (board[i].open) return play(chordTargets(board, w, h, i));
    if (status() === "idle") {
      placeMines(board, w, h, mines, i);
      sync(board.map((_, k) => k));
      setStatus("playing");
    }
    play([i]);
  }

  function flag(i: number) {
    if (over() || board[i].open) return;
    const c = board[i];
    c.flag = !c.flag;
    setFlags((f) => f + (c.flag ? 1 : -1));
    sync([i]);
  }

  /** Primary tap: respects mobile flag mode. */
  const tap = (i: number) => (flagMode() && !board[i].open ? flag(i) : open(i));

  return {
    cells, level, levelId, status, elapsed, best, flagMode,
    minesLeft: () => level().mines - flags(),
    cols: () => level().w,
    count: () => level().w * level().h,
    toggleFlagMode: () => setFlagMode((m) => !m),
    tap, flag, restart,
    chord: (i: number) => board[i].open && open(i),
  };
}

export type Game = ReturnType<typeof createGame>;
