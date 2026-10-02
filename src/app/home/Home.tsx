import { For } from "solid-js";
import { games } from "../../games/registry";
import Float from "./Float";
import GameCard from "./GameCard";
import Hero from "./Hero";

export default function Home() {
  return (
    <div class="relative">
      <Float />
      <div class="relative z-10 pt-4 sm:pt-10">
        <Hero />
        <div class="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          <For each={games}>{(g, i) => <GameCard game={g} index={i()} />}</For>
        </div>
      </div>
    </div>
  );
}
