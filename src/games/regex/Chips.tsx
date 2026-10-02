import { For, useContext } from "solid-js";
import { RegexCtx } from "./ctx";
import { LEVELS } from "./levels";
import { stars } from "./logic";

/** Level chips with best-star ratings. */
export default function Chips() {
  const g = useContext(RegexCtx);

  return (
    <div class="flex flex-wrap gap-1.5">
      <For each={LEVELS}>
        {(lv, i) => {
          const len = () => g.best()[i()];
          const done = () => len() !== undefined;
          return (
            <button
              class={[
                "flex min-h-10 min-w-10 touch-manipulation flex-col items-center justify-center rounded-lg px-2 font-mono text-sm leading-none font-bold",
                i() === g.li()
                  ? "bg-emerald-500 text-zinc-950"
                  : done()
                    ? "bg-emerald-950 text-emerald-300 ring-1 ring-emerald-800"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
              ]}
              onClick={() => g.select(i())}
              aria-label={`Level ${i() + 1}: ${lv.title}`}
            >
              {i() + 1}
              {done() && <span class="mt-0.5 text-[8px] tracking-tighter">{"★".repeat(stars(len()!, lv.par.length))}</span>}
            </button>
          );
        }}
      </For>
    </div>
  );
}
