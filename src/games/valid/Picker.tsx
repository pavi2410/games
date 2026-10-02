import { For, useContext } from "solid-js";
import { ValidCtx } from "./ctx";
import { CATS, MIX } from "./data";
import { ROUND } from "./state";

/** Category menu with best scores. */
export default function Picker() {
  const g = useContext(ValidCtx);
  const all = [...CATS, MIX];

  return (
    <div class="mx-auto flex w-full max-w-md flex-col gap-4">
      <div>
        <h2 class="text-2xl font-bold">Valid or Nope?</h2>
        <p class="text-sm text-zinc-400">{ROUND} cards a round. Is each one valid? Tap or use ← →.</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <For each={all}>
          {(c) => (
            <button
              class="flex touch-manipulation flex-col items-start gap-1 rounded-2xl bg-zinc-800 p-4 text-left ring-1 ring-zinc-700 transition hover:bg-zinc-700 active:scale-95"
              onClick={() => g.start(c.id)}
            >
              <span class="text-3xl">{c.icon}</span>
              <span class="font-bold">{c.title}</span>
              <span class="font-mono text-xs text-zinc-400">
                {g.best()[c.id] !== undefined ? `best ${g.best()[c.id]}/${ROUND}` : "not played"}
              </span>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
