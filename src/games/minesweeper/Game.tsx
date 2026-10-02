import { GameCtx } from "./ctx";
import { createGame } from "./state";
import Panel from "./Panel";

export default function Minesweeper() {
  return (
    <GameCtx value={createGame()}>
      <Panel />
    </GameCtx>
  );
}
