import { onCleanup, useContext } from "solid-js";
import { GameCtx } from "./ctx";

// Classic number colors on the gray panel.
const NUM = [
  "",
  "text-blue-700",
  "text-green-700",
  "text-red-600",
  "text-indigo-900",
  "text-amber-800",
  "text-teal-700",
  "text-black",
  "text-gray-500",
];

const LONG_PRESS_MS = 350;
const MOVE_TOLERANCE_PX = 10;

export default function CellView(props: { i: number }) {
  const g = useContext(GameCtx);
  const c = () => g.cells[props.i];
  const lost = () => g.status() === "lost";

  let timer: number | undefined;
  let startX = 0;
  let startY = 0;
  let held = false;

  const clear = () => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
  onCleanup(clear);

  /** Touch long-press to flag (right-click covers desktop). */
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== "touch") return;
    held = false;
    startX = e.clientX;
    startY = e.clientY;
    clear();
    timer = window.setTimeout(() => {
      timer = undefined;
      held = true;
      g.flag(props.i);
      navigator.vibrate?.(25);
    }, LONG_PRESS_MS);
  };
  const onMove = (e: PointerEvent) => {
    if (timer !== undefined && Math.hypot(e.clientX - startX, e.clientY - startY) > MOVE_TOLERANCE_PX) {
      clear();
    }
  };
  const onUp = () => clear();

  const onTap = () => {
    if (held) {
      held = false;
      return;
    }
    g.tap(props.i);
  };

  const label = () => {
    const x = c();
    if (x.flag) return lost() && !x.mine ? "✕" : "🚩";
    if (!x.open) return "";
    return x.mine ? "💣" : x.n || "";
  };

  return (
    <button
      tabindex={-1}
      draggable={false}
      class={[
        "flex aspect-square w-full touch-manipulation items-center justify-center leading-none font-bold select-none [-webkit-touch-callout:none]",
        g.cols() > 20 ? "text-[11px] sm:text-sm" : g.cols() > 12 ? "text-sm sm:text-base" : "text-lg sm:text-xl",
        c().open
          ? "border-t border-l border-[#7b7b7b] bg-[#bdbdbd]"
          : "bg-[#bdbdbd] shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#7b7b7b] active:shadow-[inset_1px_1px_2px_#7b7b7b]",
        {
          "bg-[#ff5a5a]!": c().boom,
          "text-red-600": c().flag && lost() && !c().mine,
          "text-zinc-900": c().flag && !lost(),
          [NUM[c().n]]: c().open && !c().mine,
        },
      ]}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onClick={onTap}
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
