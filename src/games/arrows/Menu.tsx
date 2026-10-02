import { createSignal, For, Repeat, Show, useContext } from "solid-js";
import { sfx } from "../../lib/sound";
import { ArrowsCtx } from "./ctx";
import { DIFFS, LEVELS_PER } from "./levels";

const row =
  "flex min-h-12 w-full touch-manipulation items-center justify-between rounded-xl bg-sky-50 px-4 font-semibold text-zinc-800 active:bg-sky-100";

/** Pause sheet: resume, restart, sound, difficulty, level select. */
export default function Menu() {
  const g = useContext(ArrowsCtx);
  const [muted, setMuted] = createSignal(sfx.muted);

  return (
    <Show when={g.menu()}>
      <div class="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-3 sm:items-center" onClick={g.closeMenu}>
        <div
          class="flex w-full max-w-sm flex-col gap-2 rounded-2xl bg-white p-4 shadow-xl"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 class="mb-1 text-center text-lg font-bold text-sky-600">Paused</h2>

          <button class="min-h-12 w-full touch-manipulation rounded-xl bg-sky-500 font-bold text-white active:bg-sky-600" onClick={g.closeMenu}>
            Resume
          </button>
          <button
            class={row}
            onClick={() => {
              g.restart();
            }}
          >
            <span>Restart level</span>
            <span>↻</span>
          </button>
          <button class={row} onClick={() => setMuted(sfx.toggle())}>
            <span>Sound</span>
            <span>{muted() ? "Off" : "On"}</span>
          </button>
          <button class={row} onClick={g.openPicker}>
            <span>Difficulty</span>
            <span class="text-sky-600">{g.diff() ? DIFFS[g.diff()!].label : ""} ›</span>
          </button>

          <div class="mt-1 grid grid-cols-5 gap-1.5">
            <For each={Array.from({ length: LEVELS_PER }, (_, i) => i)}>
              {(n) => {
                const locked = () => n > g.unlocked();
                const done = () => !!g.diff() && g.prog()[g.diff()!].done.includes(n);
                return (
                  <button
                    disabled={locked()}
                    class={[
                      "min-h-10 touch-manipulation rounded-lg text-sm font-bold",
                      n === g.li()
                        ? "bg-sky-500 text-white"
                        : locked()
                          ? "bg-zinc-100 text-zinc-300"
                          : done()
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-sky-50 text-sky-700",
                    ]}
                    onClick={() => g.selectLevel(n)}
                  >
                    {locked() ? "🔒" : n + 1}
                  </button>
                );
              }}
            </For>
          </div>

          <a href="/" class="mt-1 text-center text-sm font-semibold text-zinc-500 underline">
            Back to games
          </a>
        </div>
      </div>
    </Show>
  );
}
