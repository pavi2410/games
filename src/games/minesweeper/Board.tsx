import { Repeat, useContext } from "solid-js";
import { GameCtx } from "./ctx";
import Cell from "./Cell";

export default function Board() {
  const g = useContext(GameCtx);
  return (
    <div
      class="mx-auto w-full touch-manipulation rounded-xs bg-[#7b7b7b] p-1.5 shadow-[inset_2px_2px_0_#7b7b7b,inset_-2px_-2px_0_#ffffff] select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        class="grid w-full gap-0 border-r border-b border-[#7b7b7b]"
        style={{ "grid-template-columns": `repeat(${g.cols()}, minmax(0, 1fr))` }}
      >
        <Repeat count={g.count()}>{(i) => <Cell i={i} />}</Repeat>
      </div>
    </div>
  );
}
