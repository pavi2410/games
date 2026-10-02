import { RegexCtx } from "./ctx";
import { createRegex } from "./state";
import Chips from "./Chips";
import Words from "./Words";
import Editor from "./Editor";
import { useContext } from "solid-js";

function Screen() {
  const g = useContext(RegexCtx);
  return (
    <div class="mx-auto flex w-full max-w-xl flex-col gap-4">
      <Chips />
      <div>
        <h2 class="text-xl font-bold">
          <span class="font-mono text-emerald-400">#{g.li() + 1}</span> {g.level().title}
        </h2>
        <p class="text-sm text-zinc-400">{g.level().tip}</p>
      </div>
      <Words />
      <Editor />
    </div>
  );
}

export default function RegexGolf() {
  return (
    <RegexCtx value={createRegex()}>
      <Screen />
    </RegexCtx>
  );
}
