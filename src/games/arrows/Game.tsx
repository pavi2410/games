import { useContext } from "solid-js";
import { ArrowsCtx } from "./ctx";
import { createArrows } from "./state";
import Header from "./Header";
import Board from "./Board";
import Picker from "./Picker";
import Menu from "./Menu";
import Result from "./Result";

function Panel() {
  const g = useContext(ArrowsCtx);
  // Phones: full-screen overlay. sm+: centered card capped by width and viewport height.
  const maxW = () => {
    const { w, h } = g.dims();
    return `min(${w * 60 + 32}px, max(240px, calc((100dvh - 220px) * ${w} / ${h})))`;
  };

  return (
    <div
      class="fixed inset-0 z-10 flex flex-col bg-white p-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:mx-auto sm:block sm:w-full sm:max-w-(--mw) sm:rounded-2xl sm:shadow-lg"
      style={{ "--mw": maxW() }}
    >
      <Header />
      <Board />
      <Result />
      <Menu />
      <Picker />
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
