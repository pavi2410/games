import { createSignal, For, Show, useContext } from "solid-js";
import { GameCtx } from "./ctx";
import { LEVELS, LEVEL_IDS } from "./levels";
import { sfx } from "./sound";

const pad = (n: number) => String(Math.max(n, 0)).padStart(3, "0");

const face = (s: string) => (s === "won" ? "😎" : s === "lost" ? "😵" : "🙂");

const raised = "bg-[#bdbdbd] text-zinc-800 shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#7b7b7b]";
const sunken = "bg-[#b0b0b0] text-black shadow-[inset_2px_2px_0_#7b7b7b,inset_-2px_-2px_0_#ffffff]";

export default function Header() {
  const g = useContext(GameCtx);
  const [muted, setMuted] = createSignal(sfx.muted);

  return (
    <div class="mb-2 flex w-full flex-col items-center gap-2">
      <div class="flex w-full gap-1.5">
        <For each={LEVEL_IDS}>
          {(id) => (
            <button
              class={[
                "min-h-11 flex-1 touch-manipulation rounded-xs px-2 text-sm font-semibold",
                g.levelId() === id ? sunken : `${raised} active:shadow-[inset_1px_1px_2px_#7b7b7b]`,
              ]}
              onClick={() => g.restart(id)}
            >
              {LEVELS[id].label}
            </button>
          )}
        </For>
      </div>

      <div class="flex w-full items-center justify-between gap-2 rounded-xs bg-[#b0b0b0] p-1.5 shadow-[inset_2px_2px_0_#7b7b7b,inset_-2px_-2px_0_#ffffff]">
        <span class="min-w-16 rounded-xs bg-black px-2 py-1 text-center font-mono text-xl leading-none text-red-500">
          {pad(g.minesLeft())}
        </span>
        <button
          aria-label="Restart"
          class={`flex size-11 touch-manipulation items-center justify-center rounded-xs text-2xl ${raised} active:shadow-[inset_1px_1px_2px_#7b7b7b]`}
          onClick={() => g.restart()}
        >
          {face(g.status())}
        </button>
        <span class="min-w-16 rounded-xs bg-black px-2 py-1 text-center font-mono text-xl leading-none text-red-500">
          {pad(g.elapsed())}
        </span>
      </div>

      <div class="flex w-full items-center gap-1.5">
        <button
          class={[
            "min-h-11 flex-1 touch-manipulation rounded-xs px-2 text-sm font-semibold",
            !g.flagMode() ? sunken : `${raised} active:shadow-[inset_1px_1px_2px_#7b7b7b]`,
          ]}
          onClick={() => g.flagMode() && g.toggleFlagMode()}
        >
          💣 Dig
        </button>
        <button
          class={[
            "min-h-11 flex-1 touch-manipulation rounded-xs px-2 text-sm font-semibold",
            g.flagMode() ? sunken : `${raised} active:shadow-[inset_1px_1px_2px_#7b7b7b]`,
          ]}
          onClick={() => !g.flagMode() && g.toggleFlagMode()}
        >
          🚩 Flag
        </button>
        <Show when={g.best()[g.levelId()]}>{(t) => <span class="px-1 text-sm font-semibold text-zinc-800">🏆 {t()}s</span>}</Show>
        <button
          aria-label={muted() ? "Unmute" : "Mute"}
          class={`ml-auto flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-xs px-2 text-base ${raised} active:shadow-[inset_1px_1px_2px_#7b7b7b]`}
          onClick={() => setMuted(sfx.toggle())}
        >
          {muted() ? "🔇" : "🔊"}
        </button>
      </div>
    </div>
  );
}
