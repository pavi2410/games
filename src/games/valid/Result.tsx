import { useContext } from "solid-js";
import { ValidCtx } from "./ctx";
import { ROUND } from "./state";

const grade = (n: number) =>
  n === ROUND ? "Flawless. You are a human regex." : n >= 8 ? "Sharp eyes." : n >= 5 ? "Not bad. Edge cases bite." : "Time to read some RFCs.";

export default function Result() {
  const g = useContext(ValidCtx);

  return (
    <div class="mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-zinc-900 p-8 text-center ring-1 ring-zinc-700">
      <p class="text-6xl font-bold">
        {g.score()}
        <span class="text-3xl text-zinc-500">/{ROUND}</span>
      </p>
      <p class="text-zinc-300">{grade(g.score())}</p>
      <p class="font-mono text-sm text-zinc-500">best streak {g.top()}</p>
      <div class="mt-2 grid w-full grid-cols-2 gap-3">
        <button class="min-h-12 rounded-xl bg-zinc-800 font-bold hover:bg-zinc-700" onClick={g.menu}>
          Categories
        </button>
        <button class="min-h-12 rounded-xl bg-emerald-500 font-bold text-zinc-950" onClick={() => g.start(g.cat()!)}>
          Play again
        </button>
      </div>
    </div>
  );
}
