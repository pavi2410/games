import { For, Show, useContext } from "solid-js";
import { GatesCtx } from "./ctx";
import { LABEL } from "./logic";

/** Bottom sheet: choose what goes in the tapped socket. */
export default function Picker() {
  const g = useContext(GatesCtx);
  const chip =
    "min-h-11 min-w-14 touch-manipulation rounded-lg px-3 font-mono text-sm font-bold active:brightness-90";

  return (
    <Show when={g.sel() !== null}>
      <div class="fixed inset-0 z-30 flex items-end justify-center bg-black/50 p-3 sm:items-center" onClick={g.close}>
        <div
          class="w-full max-w-sm rounded-2xl bg-zinc-900 p-4 ring-1 ring-zinc-700"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 class="mb-2 text-xs font-bold tracking-wider text-zinc-400 uppercase">Inputs</h3>
          <div class="mb-3 flex flex-wrap gap-2">
            <For each={g.level().inputs}>
              {(name) => (
                <button class={`${chip} bg-amber-400 text-zinc-950`} onClick={() => g.place({ input: name })}>
                  {name}
                </button>
              )}
            </For>
          </div>

          <h3 class="mb-2 text-xs font-bold tracking-wider text-zinc-400 uppercase">Gates</h3>
          <div class="mb-3 flex flex-wrap gap-2">
            <For each={g.level().gates}>
              {(gate) => (
                <button class={`${chip} bg-sky-500 text-zinc-950`} onClick={() => g.place({ gate })}>
                  {LABEL[gate]}
                </button>
              )}
            </For>
          </div>

          <div class="flex gap-2">
            <Show when={g.current()}>
              <button class={`${chip} flex-1 bg-red-900 text-red-100`} onClick={() => g.place(null)}>
                Remove
              </button>
            </Show>
            <button class={`${chip} flex-1 bg-zinc-800 text-zinc-300`} onClick={g.close}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
