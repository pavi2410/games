import { useContext } from "solid-js";
import { GameCtx } from "./ctx";

const NUM = [
  "",
  "text-blue-400",
  "text-green-400",
  "text-red-400",
  "text-indigo-400",
  "text-amber-600",
  "text-cyan-400",
  "text-zinc-200",
  "text-zinc-400",
];

export default function CellView(props: { i: number }) {
  const g = useContext(GameCtx);
  const c = () => g.cells[props.i];
  const lost = () => g.status() === "lost";

  const label = () => {
    const x = c();
    if (x.flag) return lost() && !x.mine ? "✕" : "⚑";
    if (!x.open) return "";
    return x.mine ? "✸" : x.n || "";
  };

  return (
    <button
      tabindex={-1}
      class={[
        "flex size-7 items-center justify-center text-sm font-bold select-none sm:size-8",
        c().open ? "bg-zinc-800" : "bg-zinc-600 hover:bg-zinc-500",
        { "bg-red-700!": c().boom, "text-red-300": c().flag && !lost(), [NUM[c().n]]: c().open && !c().mine },
      ]}
      onClick={() => g.tap(props.i)}
      onContextMenu={(e) => {
        e.preventDefault();
        g.flag(props.i);
      }}
      onAuxClick={(e) => {
        if (e.button === 1) {
          e.preventDefault();
          g.chord(props.i);
        }
      }}
    >
      {label()}
    </button>
  );
}
