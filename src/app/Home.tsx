import { For } from "solid-js";
import { games } from "../games/registry";

export default function Home() {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={games}>
        {(g) => (
          <a href={`/${g.id}`} class="rounded-lg bg-zinc-800 p-5 hover:bg-zinc-700">
            <h2 class="text-lg font-semibold">{g.title}</h2>
            <p class="mt-1 text-sm text-zinc-400">{g.blurb}</p>
          </a>
        )}
      </For>
    </div>
  );
}
