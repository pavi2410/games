import { Repeat, Show, useContext } from "solid-js";
import { ArrowsCtx } from "./ctx";
import { HEARTS } from "./state";
import { LEVELS_PER } from "./levels";

/** Win / lose card shown over the board. */
export default function Result() {
  const g = useContext(ArrowsCtx);
  const show = () => g.diff() !== null && !g.menu() && g.status() !== "playing";
  const btn =
    "min-h-12 w-full touch-manipulation rounded-xl px-4 font-bold text-white";

  return (
    <Show when={show()}>
      <div class="fixed inset-0 z-20 flex items-center justify-center bg-white/70 p-4 backdrop-blur-[2px]">
        <div class="w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-xl ring-1 ring-black/5">
          <Show
            when={g.status() === "won"}
            fallback={
              <>
                <h2 class="text-2xl font-extrabold text-red-500">Out of hearts</h2>
                <p class="mt-1 mb-4 text-sm text-zinc-500">Plan your order and try again.</p>
                <button class={`${btn} bg-red-500 active:bg-red-600`} onClick={g.restart}>
                  Retry
                </button>
              </>
            }
          >
            <h2 class="text-2xl font-extrabold text-emerald-500">Level cleared!</h2>
            <div class="my-2 flex justify-center gap-1 text-2xl">
              <Repeat count={HEARTS}>
                {(i) => <span class={i < g.hearts() ? "text-red-500" : "text-zinc-200"}>♥</span>}
              </Repeat>
            </div>
            <Show
              when={g.li() < LEVELS_PER - 1}
              fallback={<p class="mb-4 text-sm text-zinc-500">All levels done 🎉</p>}
            >
              <button class={`${btn} mt-2 bg-emerald-500 active:bg-emerald-600`} onClick={g.next}>
                Next level
              </button>
            </Show>
            <button class="mt-2 min-h-10 w-full text-sm font-semibold text-zinc-500" onClick={g.openMenu}>
              Menu
            </button>
          </Show>
        </div>
      </div>
    </Show>
  );
}
