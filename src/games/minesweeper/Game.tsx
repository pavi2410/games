import { GameCtx } from "./ctx";
import { createGame } from "./state";
import Header from "./Header";
import Board from "./Board";

export default function Minesweeper() {
  return (
    <GameCtx value={createGame()}>
      <Header />
      <Board />
      <p class="mt-4 text-center text-xs text-zinc-500">
        Click to reveal, right-click to flag, click a satisfied number to chord.
      </p>
    </GameCtx>
  );
}
