import { For, useContext } from "solid-js";
import { GatesCtx } from "./ctx";
import { LEVELS } from "./levels";
import { countGates, stars } from "./logic";

/** Level chips with best-star ratings. */
export default function Chips() {
  const g = useContext(GatesCtx);

  return (
    <div class="flex flex-wrap gap-1.5">
      <For each={LEVELS}>
        {(lv, i) => {
          const best = () => g.best()[i()];
          const done = () => best() !== undefined;
          return (
            <button
              class={[
                "flex min-h-10 min-w-10 touch-manipulation flex-col items-center justify-center rounded-lg px-2 font-mono text-sm leading-none font-bold",
                i() === g.li()
                  ? "bg-sky-500 text-zinc-950"
                  : done()
                    ? "bg-sky-950 text-sky-300 ring-1 ring-sky-800"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700",
              ]}
              onClick={() => g.select(i())}
              aria-label={`Level ${i() + 1}: ${lv.title}`}
            >
              {i() + 1}
              {done() && <span class="mt-0.5 text-[8px] tracking-tighter">{"★".repeat(stars(best()!, countGates(lv.sol)))}</span>}
            </button>
          );
        }}
      </For>
    </div>
  );
}
