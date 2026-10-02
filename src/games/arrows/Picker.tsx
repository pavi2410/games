import { For, Show, useContext } from "solid-js";
import { ArrowsCtx } from "./ctx";
import { DIFFS, DIFF_IDS, LEVELS_PER } from "./levels";

/** Shown on load (and via the header chip) until a difficulty is chosen. */
export default function Picker() {
  const g = useContext(ArrowsCtx);

  return (
    <Show when={g.diff() === null}>
      <div class="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
        <div class="w-full max-w-xs rounded-2xl bg-white p-5 shadow-xl">
          <h2 class="mb-1 text-center text-xl font-bold text-sky-600">Choose difficulty</h2>
          <p class="mb-4 text-center text-sm text-zinc-500">Harder = bigger grid, more arrows</p>
          <div class="flex flex-col gap-2">
            <For each={DIFF_IDS}>
              {(id) => (
                <button
                  class="flex min-h-14 touch-manipulation items-center justify-between rounded-xl bg-sky-50 px-4 text-left hover:bg-sky-100 active:bg-sky-200"
                  onClick={() => g.pickDiff(id)}
                >
                  <span>
                    <span class="block font-bold text-zinc-900">{DIFFS[id].label}</span>
                    <span class="block text-xs text-zinc-500">{DIFFS[id].blurb}</span>
                  </span>
                  <span class="text-sm font-semibold text-sky-600">
                    {g.prog()[id].done.length}/{LEVELS_PER}
                  </span>
                </button>
              )}
            </For>
          </div>
          <a href="/" class="mt-4 block text-center text-sm font-semibold text-zinc-500 underline">
            ‹ Back to games
          </a>
        </div>
      </div>
    </Show>
  );
}
