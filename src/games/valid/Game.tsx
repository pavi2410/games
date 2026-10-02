import { Show, useContext } from "solid-js";
import { ValidCtx } from "./ctx";
import { createValid } from "./state";
import Picker from "./Picker";
import Play from "./Play";
import Result from "./Result";

function Screen() {
  const g = useContext(ValidCtx);
  return (
    <Show when={g.cat()} fallback={<Picker />}>
      <Show when={!g.over()} fallback={<Result />}>
        <Play />
      </Show>
    </Show>
  );
}

export default function ValidOrNope() {
  return (
    <ValidCtx value={createValid()}>
      <Screen />
    </ValidCtx>
  );
}
