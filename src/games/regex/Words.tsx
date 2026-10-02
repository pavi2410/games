import { For, useContext } from "solid-js";
import { RegexCtx } from "./ctx";

const pill = (state: boolean | null) =>
  state === null
    ? "bg-zinc-800 text-zinc-300"
    : state
      ? "bg-emerald-900 text-emerald-200"
      : "bg-red-900/70 text-red-200";

const mark = (state: boolean | null) => (state === null ? "·" : state ? "✓" : "✗");

function Col(props: { title: string; sub: string; words: string[]; states: (boolean | null)[]; accent: string }) {
  return (
    <div class="min-w-0 flex-1">
      <h3 class={`text-xs font-bold tracking-wider uppercase ${props.accent}`}>{props.title}</h3>
      <p class="mb-2 text-[11px] text-zinc-500">{props.sub}</p>
      <ul class="flex flex-col gap-1.5">
        <For each={props.words}>
          {(w, i) => (
            <li class={`flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 font-mono text-sm transition-colors ${pill(props.states[i()])}`}>
              <span class="truncate">{w}</span>
              <span class="font-bold">{mark(props.states[i()])}</span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

/** The two word lists with live pass/fail. */
export default function Words() {
  const g = useContext(RegexCtx);
  return (
    <div class="flex gap-3">
      <Col title="Match" sub="regex must hit all" words={g.level().match} states={g.result().hits} accent="text-emerald-400" />
      <Col title="Avoid" sub="regex must hit none" words={g.level().avoid} states={g.result().avoids} accent="text-red-400" />
    </div>
  );
}
