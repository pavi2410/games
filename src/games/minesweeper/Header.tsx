import { For, Show, useContext } from "solid-js";
import { GameCtx } from "./ctx";
import { LEVELS, LEVEL_IDS } from "./levels";

const pad = (n: number) => String(Math.max(n, 0)).padStart(3, "0");

export default function Header() {
  const g = useContext(GameCtx);
  const btn = "rounded px-3 py-1 text-sm";

  return (
    <div class="mb-3 flex flex-col items-center gap-3">
      <div class="flex gap-2">
        <For each={LEVEL_IDS}>
          {(id) => (
            <button
              class={[btn, g.levelId() === id ? "bg-emerald-600" : "bg-zinc-700 hover:bg-zinc-600"]}
              onClick={() => g.restart(id)}
            >
              {LEVELS[id].label}
            </button>
          )}
        </For>
      </div>

      <div class="flex items-center gap-4 font-mono text-2xl">
        <span class="w-16 rounded bg-black px-2 text-right text-red-500">{pad(g.minesLeft())}</span>
        <button class={[btn, "bg-zinc-700 text-base hover:bg-zinc-600"]} onClick={() => g.restart()}>
          {g.status() === "won" ? "You won!" : g.status() === "lost" ? "Boom - retry" : "Restart"}
        </button>
        <span class="w-16 rounded bg-black px-2 text-right text-red-500">{pad(g.elapsed())}</span>
      </div>

      <div class="flex items-center gap-4 text-sm text-zinc-400">
        <button
          class={[btn, g.flagMode() ? "bg-amber-600 text-white" : "bg-zinc-700 text-zinc-200"]}
          onClick={g.toggleFlagMode}
        >
          Flag mode: {g.flagMode() ? "on" : "off"}
        </button>
        <Show when={g.best()[g.levelId()]}>{(t) => <span>Best: {t()}s</span>}</Show>
      </div>
    </div>
  );
}
