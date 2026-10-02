import { For, Index, useContext } from "solid-js";
import { GatesCtx } from "./ctx";

const bit = (v: boolean | null) => (v === null ? "·" : v ? "1" : "0");

/** Target vs. your circuit, row by row. */
export default function Table() {
  const g = useContext(GatesCtx);
  const th = "px-3 py-1.5 text-center text-xs font-bold tracking-wider text-zinc-400 uppercase";
  const td = "px-3 py-1.5 text-center";

  return (
    <table class="w-full overflow-hidden rounded-xl bg-zinc-900 font-mono text-sm ring-1 ring-zinc-800">
      <thead class="bg-zinc-950">
        <tr>
          <For each={g.level().inputs}>{(name) => <th class={`${th} text-amber-400`}>{name}</th>}</For>
          <th class={th}>Target</th>
          <th class={th}>Yours</th>
        </tr>
      </thead>
      <tbody>
        <For each={g.result().rows}>
          {(r) => (
            <tr class="border-t border-zinc-800">
              <Index each={r.vals}>{(v) => <td class={`${td} text-zinc-300`}>{bit(v())}</td>}</Index>
              <td class={`${td} text-zinc-100`}>{bit(r.want)}</td>
              <td
                class={[
                  td,
                  "font-bold",
                  r.got === null ? "text-zinc-600" : r.got === r.want ? "bg-emerald-950 text-emerald-300" : "bg-red-950 text-red-300",
                ]}
              >
                {bit(r.got)}
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
