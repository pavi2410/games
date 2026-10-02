import { Repeat, useContext } from "solid-js";
import { ArrowsCtx } from "./ctx";
import { HEARTS } from "./state";

export default function Header() {
  const g = useContext(ArrowsCtx);
  const icon =
    "flex size-10 touch-manipulation items-center justify-center rounded-full bg-sky-100 text-xl font-bold text-sky-600 active:bg-sky-200";

  return (
    <div class="mb-2 flex items-center justify-between">
      <a href="/" aria-label="Back to games" class={icon}>
        ‹
      </a>
      <div class="flex flex-col items-center leading-tight">
        <span class="text-lg font-bold text-sky-600">Level {g.levelNo()}</span>
        <span class="flex gap-0.5 text-base" aria-label={`${g.hearts()} hearts left`}>
          <Repeat count={HEARTS}>
            {(i) => <span class={i < g.hearts() ? "text-red-500" : "text-zinc-300"}>♥</span>}
          </Repeat>
        </span>
      </div>
      <button class={icon} onClick={g.openMenu} aria-label="Menu">
        ☰
      </button>
    </div>
  );
}
