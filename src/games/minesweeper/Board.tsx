import { Repeat } from "solid-js";
import { useContext } from "solid-js";
import { GameCtx } from "./ctx";
import Cell from "./Cell";

export default function Board() {
  const g = useContext(GameCtx);
  return (
    <div class="max-w-full overflow-x-auto">
      <div
        class="mx-auto grid w-max gap-px bg-zinc-900 p-px"
        style={{ "grid-template-columns": `repeat(${g.cols()}, max-content)` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Repeat count={g.count()}>{(i) => <Cell i={i} />}</Repeat>
      </div>
    </div>
  );
}
