import { For, onSettled, Show, useContext } from "solid-js";
import { ValidCtx } from "./ctx";

/** One round: a card, two answer buttons, instant feedback. */
export default function Play() {
  const g = useContext(ValidCtx);
  const answered = () => g.pick() !== null;
  const right = () => g.pick() === g.card().ok;
  const last = () => g.i() + 1 >= g.deck().length;

  onSettled(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") g.answer(false);
      else if (e.key === "ArrowRight") (answered() ? g.next() : g.answer(true));
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  });

  return (
    <div class="mx-auto flex w-full max-w-md flex-col gap-4">
      <div class="flex items-center justify-between gap-3">
        <button class="text-sm text-zinc-400 hover:text-zinc-200" onClick={g.menu}>
          ‹ Categories
        </button>
        <span class="font-mono text-sm text-amber-300">{g.streak() > 1 ? `🔥 ${g.streak()}` : ""}</span>
      </div>

      <div class="flex gap-1">
        <For each={g.deck()}>
          {(_, k) => (
            <span
              class={[
                "h-2 flex-1 rounded-full",
                g.marks()[k()] === undefined ? (k() === g.i() ? "bg-zinc-500" : "bg-zinc-800") : g.marks()[k()] ? "bg-emerald-500" : "bg-rose-500",
              ]}
            />
          )}
        </For>
      </div>

      <div
        class={[
          "flex min-h-40 flex-col justify-between gap-4 rounded-2xl border-2 bg-zinc-900 p-5 transition-colors",
          !answered() ? "border-zinc-700" : right() ? "border-emerald-500" : "border-rose-500",
        ]}
      >
        <span class="w-fit rounded-full bg-zinc-800 px-3 py-1 text-xs font-bold tracking-wide text-zinc-300 uppercase">
          {g.card().kind}
        </span>
        <p class="font-mono text-xl leading-snug font-bold break-all whitespace-pre-wrap sm:text-2xl">{g.card().s}</p>
      </div>

      <Show
        when={answered()}
        fallback={
          <div class="grid grid-cols-2 gap-3">
            <button
              class="min-h-16 touch-manipulation rounded-2xl bg-rose-500 text-xl font-bold text-white transition active:scale-95"
              onClick={() => g.answer(false)}
            >
              ✗ Nope
            </button>
            <button
              class="min-h-16 touch-manipulation rounded-2xl bg-emerald-500 text-xl font-bold text-zinc-950 transition active:scale-95"
              onClick={() => g.answer(true)}
            >
              ✓ Valid
            </button>
          </div>
        }
      >
        <div class={["rounded-2xl p-4 text-sm", right() ? "bg-emerald-950 text-emerald-200" : "bg-rose-950 text-rose-200"]}>
          <p class="mb-1 text-base font-bold">{right() ? "Correct!" : "Not quite."}</p>
          {g.card().ok ? "Valid. Nothing wrong with it." : `Invalid: ${g.card().why}.`}
        </div>
        <button
          class="min-h-14 touch-manipulation rounded-2xl bg-zinc-100 text-lg font-bold text-zinc-950 transition active:scale-95"
          onClick={g.next}
        >
          {last() ? "See score" : "Next →"}
        </button>
      </Show>
    </div>
  );
}
