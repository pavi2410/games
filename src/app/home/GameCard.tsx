import { Show } from "solid-js";
import type { GameInfo } from "../../games/registry";
import { lookFor } from "./looks";
import { statFor } from "./stats";

/** Chunky "button" tile: tilted at rest, straightens and lifts on hover. */
export default function GameCard(props: { game: GameInfo; index: number }) {
  const look = lookFor(props.game.id);
  const stat = statFor(props.game.id);
  const tilt = props.index % 2 ? 1.5 : -1.5;

  return (
    <a
      href={`/${props.game.id}`}
      class={`animate-pop group block rounded-3xl border-b-8 bg-white p-3 text-left shadow-[0_10px_24px_-8px_rgba(59,42,99,0.25)] transition-transform duration-150 [transform:rotate(var(--tilt))] hover:[transform:translateY(-4px)_rotate(0deg)] active:[transform:translateY(2px)_rotate(0deg)] active:border-b-4 sm:p-4 ${look.lip}`}
      style={{ "--tilt": `${tilt}deg`, "animation-delay": `${props.index * 90}ms` }}
    >
      <div class={`${look.bg} mb-3 flex h-32 items-center justify-center rounded-2xl p-3 sm:h-36`}>
        <div class="h-full w-full transition-transform group-hover:animate-wiggle">{look.art}</div>
      </div>

      <div class="flex items-start justify-between gap-2 px-1">
        <div class="min-w-0">
          <h2 class="font-display text-xl font-bold text-[#3b2a63] sm:text-2xl">{props.game.title}</h2>
          <p class="text-sm leading-snug text-[#6b5a94]">{props.game.blurb}</p>
        </div>
        <span class={`font-display shrink-0 rounded-full px-4 py-1.5 text-sm font-bold text-white ${look.btn}`}>Play</span>
      </div>

      <div class="mt-3 px-1">
        <Show
          when={stat}
          fallback={<span class="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-600">New!</span>}
        >
          {(s) => <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{s()}</span>}
        </Show>
      </div>
    </a>
  );
}
