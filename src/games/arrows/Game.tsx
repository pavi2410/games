import { useContext } from "solid-js";
import { ArrowsCtx } from "./ctx";
import { createArrows } from "./state";
import Header from "./Header";
import Board from "./Board";

function Panel() {
  const g = useContext(ArrowsCtx);
  // Fit viewport height on phones; cap width on desktop.
  const maxW = () => {
    const { w, h } = g.dims();
    return `min(${w * 60 + 32}px, max(240px, calc((100dvh - 220px) * ${w} / ${h})))`;
  };

  return (
    <div class="flex justify-center">
      <div class="w-full rounded-2xl bg-white p-3 shadow-lg" style={{ "max-width": maxW() }}>
        <Header />
        <Board />
      </div>
    </div>
  );
}

export default function ArrowsGame() {
  return (
    <ArrowsCtx value={createArrows()}>
      <Panel />
    </ArrowsCtx>
  );
}
