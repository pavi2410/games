import { createSignal, Show, useContext } from "solid-js";
import { sfx } from "../../lib/sound";
import { ArrowsCtx } from "./ctx";
import { HEARTS } from "./state";
import { DIFFS, LEVELS_PER } from "./levels";

export default function Header() {
  const g = useContext(ArrowsCtx);
  const [muted, setMuted] = createSignal(sfx.muted);
  const icon =
    "flex size-10 touch-manipulation items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-600 disabled:opacity-30";

  return (
    <div class="mb-3 flex flex-col gap-2">
      <div class="flex items-center justify-between">
        <a href="/" aria-label="Back to games" class={icon}>
          ‹
        </a>
        <div class="flex flex-col items-center">
          <div class="flex items-center gap-2">
            <button class={`${icon} size-8 text-base`} disabled={g.li() === 0} onClick={g.prev} aria-label="Previous level">
              ‹
            </button>
            <span class="text-lg font-bold text-sky-600">Level {g.levelNo()}</span>
            <button
              class={`${icon} size-8 text-base`}
              disabled={g.li() >= Math.min(g.unlocked(), LEVELS_PER - 1)}
              onClick={g.next}
              aria-label="Next level"
            >
              ›
            </button>
          </div>
          <button class="text-xs font-semibold text-sky-500 underline" onClick={g.openPicker}>
            {g.diff() ? DIFFS[g.diff()!].label : ""} · change
          </button>
          <span class="text-sm tracking-wider" aria-label={`${g.hearts()} hearts left`}>
            {"❤️".repeat(g.hearts())}
            <span class="opacity-25 grayscale">{"❤️".repeat(HEARTS - g.hearts())}</span>
          </span>
        </div>
        <div class="flex gap-1.5">
          <button class={icon} onClick={() => setMuted(sfx.toggle())} aria-label={muted() ? "Unmute" : "Mute"}>
            {muted() ? "🔇" : "🔊"}
          </button>
          <button class={icon} onClick={g.restart} aria-label="Restart level">
            ↻
          </button>
        </div>
      </div>

      <Show when={g.status() === "won"}>
        <div class="flex items-center justify-between rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800">
          <span>Cleared!</span>
          <Show when={g.li() < LEVELS_PER - 1} fallback={<span>All levels done 🎉</span>}>
            <button class="rounded bg-emerald-600 px-3 py-1 text-white" onClick={g.next}>
              Next →
            </button>
          </Show>
        </div>
      </Show>

      <Show when={g.status() === "lost"}>
        <div class="flex items-center justify-between rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-800">
          <span>Out of hearts</span>
          <button class="rounded bg-red-600 px-3 py-1 text-white" onClick={g.restart}>
            Retry ↻
          </button>
        </div>
      </Show>
    </div>
  );
}
