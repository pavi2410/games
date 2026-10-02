import { Show, useContext } from "solid-js";
import { GatesCtx } from "./ctx";
import { createGates } from "./state";
import { LEVELS } from "./levels";
import { countGates, stars } from "./logic";
import Chips from "./Chips";
import Circuit from "./Circuit";
import Table from "./Table";
import Picker from "./Picker";

function Screen() {
  const g = useContext(GatesCtx);
  const par = () => countGates(g.level().sol);
  const s = () => stars(g.result().gates, par());

  return (
    <div class="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Chips />

      <div>
        <h2 class="text-xl font-bold">
          <span class="font-mono text-sky-400">#{g.li() + 1}</span> {g.level().title}
        </h2>
        <p class="text-sm text-zinc-400">{g.level().tip}</p>
      </div>

      <Circuit />

      <div class="flex items-center justify-between text-sm text-zinc-400">
        <span>
          Gates: <b class="font-mono text-zinc-100">{g.result().gates}</b> / par {par()}
        </span>
        <Show when={g.root()}>
          <button class="rounded-md bg-zinc-800 px-3 py-1.5 text-zinc-300 active:bg-zinc-700" onClick={g.clear}>
            Clear
          </button>
        </Show>
      </div>

      <Show when={g.result().ok}>
        <div class="flex items-center justify-between rounded-lg bg-emerald-950 px-3 py-2.5 ring-1 ring-emerald-700">
          <div>
            <div class="font-bold text-emerald-300">
              Solved! {"★".repeat(s())}
              <span class="text-emerald-900">{"★".repeat(3 - s())}</span>
            </div>
            <div class="text-xs text-emerald-200/80">
              {g.result().gates} gates · par {par()}
            </div>
          </div>
          <Show when={g.li() < LEVELS.length - 1} fallback={<span class="text-sm text-emerald-200">All done 🎉</span>}>
            <button class="min-h-10 rounded-lg bg-emerald-500 px-4 font-bold text-zinc-950 active:bg-emerald-400" onClick={g.next}>
              Next →
            </button>
          </Show>
        </div>
      </Show>

      <Table />
      <Picker />
    </div>
  );
}

export default function LogicGates() {
  return (
    <GatesCtx value={createGates()}>
      <Screen />
    </GatesCtx>
  );
}
