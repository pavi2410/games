import { For, Show, useContext } from "solid-js";
import { RegexCtx } from "./ctx";
import { LEVELS } from "./levels";
import { stars } from "./logic";

const SYMBOLS = ["^", "$", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\", "\\d", "\\w", "-"];

export default function Editor() {
  const g = useContext(RegexCtx);
  let input!: HTMLInputElement;

  /** Insert at the cursor without dismissing the mobile keyboard. */
  const insert = (sym: string) => {
    const s = input.selectionStart ?? input.value.length;
    const e = input.selectionEnd ?? s;
    input.setRangeText(sym, s, e, "end");
    g.edit(input.value);
    input.focus();
  };

  const par = () => g.level().par.length;

  return (
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-1 rounded-lg bg-zinc-950 px-3 py-2 font-mono text-lg ring-1 ring-zinc-700 focus-within:ring-emerald-500">
        <span class="text-zinc-600">/</span>
        <input
          ref={(el) => (input = el)}
          value={g.src()}
          onInput={(e) => g.edit(e.currentTarget.value)}
          class="min-w-0 flex-1 bg-transparent text-emerald-300 outline-none"
          placeholder="your regex"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck={false}
          aria-label="Regular expression"
        />
        <span class="text-zinc-600">/</span>
        <span class="ml-1 rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-400" title="length / par">
          {g.src().length}/{par()}
        </span>
      </div>

      <div class="flex flex-wrap gap-1.5">
        <For each={SYMBOLS}>
          {(s) => (
            <button
              class="min-h-9 min-w-9 touch-manipulation rounded-md bg-zinc-800 px-2 font-mono text-sm text-zinc-200 active:bg-zinc-600"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => insert(s)}
            >
              {s}
            </button>
          )}
        </For>
      </div>

      <p class="min-h-5 text-sm" role="status">
        <Show
          when={!g.result().error}
          fallback={<span class="text-amber-400">⚠ {g.result().error}</span>}
        >
          <span class="text-zinc-400">
            {g.result().correct}/{g.result().total} correct
          </span>
        </Show>
      </p>

      <Show when={g.result().ok}>
        <div class="flex items-center justify-between rounded-lg bg-emerald-950 px-3 py-2.5 ring-1 ring-emerald-700">
          <div>
            <div class="font-bold text-emerald-300">
              Solved! {"★".repeat(stars(g.src().length, par()))}
              <span class="text-emerald-900">{"★".repeat(3 - stars(g.src().length, par()))}</span>
            </div>
            <div class="text-xs text-emerald-200/80">
              {g.src().length} chars · par {par()}
            </div>
          </div>
          <Show when={g.li() < LEVELS.length - 1} fallback={<span class="text-sm text-emerald-200">All done 🎉</span>}>
            <button class="min-h-10 rounded-lg bg-emerald-500 px-4 font-bold text-zinc-950 active:bg-emerald-400" onClick={g.next}>
              Next →
            </button>
          </Show>
        </div>
      </Show>
    </div>
  );
}
