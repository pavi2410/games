import { useContext } from "solid-js";
import { GameCtx } from "./ctx";
import Header from "./Header";
import Board from "./Board";

// Panel width fits both axes: full width on desktop, but capped by
// viewport height on short screens so the page never scrolls.
export default function Panel() {
  const g = useContext(GameCtx);
  return (
    <div class="flex justify-center">
      <div
        class="w-full rounded-md bg-[#bdbdbd] p-2 shadow-[inset_2px_2px_0_#ffffff,inset_-2px_-2px_0_#7b7b7b] sm:p-3"
        style={{
          "max-width": `min(${g.cols() * 32 + 24}px, max(200px, calc((100dvh - 280px) * ${g.cols()} / ${g.rows()})))`,
        }}
      >
        <Header />
        <Board />
      </div>
    </div>
  );
}
