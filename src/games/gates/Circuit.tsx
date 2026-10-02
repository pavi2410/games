import { Repeat, Show, useContext } from "solid-js";
import { GatesCtx } from "./ctx";
import type { Tree } from "./levels";
import { LABEL } from "./logic";

type GateNode = Extract<Tree, { k: "gate" }>;

const wire = "bg-emerald-700";
const part =
  "flex min-h-11 min-w-14 touch-manipulation items-center justify-center rounded-lg px-2 font-mono text-sm font-bold";

function Socket(props: { path: number[] }) {
  const g = useContext(GatesCtx);
  return (
    <button
      aria-label="Empty socket"
      class="flex size-11 touch-manipulation items-center justify-center rounded-full border-2 border-dashed border-zinc-500 text-xl text-zinc-400 hover:border-emerald-400 hover:text-emerald-400"
      onClick={() => g.open(props.path)}
    >
      +
    </button>
  );
}

function GateView(props: { node: GateNode; path: number[] }) {
  const g = useContext(GatesCtx);
  const n = () => props.node.kids.length;
  return (
    <div class="flex items-center">
      <div class="flex flex-col">
        <Repeat count={n()}>
          {(i) => (
            <div class="relative flex items-center py-1.5 pr-6">
              <Slot node={props.node.kids[i]} path={[...props.path, i]} />
              <span class={`absolute top-1/2 right-0 h-0.5 w-6 -translate-y-1/2 ${wire}`} />
              <span
                class={`absolute right-0 w-0.5 ${wire}`}
                style={{ top: i === 0 ? "50%" : "0", bottom: i === n() - 1 ? "50%" : "0" }}
              />
            </div>
          )}
        </Repeat>
      </div>
      <span class={`h-0.5 w-3 ${wire}`} />
      <button
        class={`${part} bg-sky-500 text-zinc-950 active:bg-sky-400`}
        onClick={() => g.open(props.path)}
      >
        {LABEL[props.node.g]}
      </button>
    </div>
  );
}

/** A tree position: empty socket, input pin, or gate with its own sockets. */
function Slot(props: { node: Tree | null; path: number[] }) {
  const g = useContext(GatesCtx);
  const gate = () => (props.node && props.node.k === "gate" ? props.node : null);
  const input = () => (props.node && props.node.k === "in" ? props.node : null);

  return (
    <Show
      when={gate()}
      fallback={
        <Show when={input()} fallback={<Socket path={props.path} />}>
          {(i) => (
            <button
              class={`${part} min-w-11 bg-amber-400 text-zinc-950 active:bg-amber-300`}
              onClick={() => g.open(props.path)}
            >
              {i().name}
            </button>
          )}
        </Show>
      }
    >
      {(gn) => <GateView node={gn()} path={props.path} />}
    </Show>
  );
}

/** The schematic: tree on the left, OUT lamp on the right. */
export default function Circuit() {
  const g = useContext(GatesCtx);
  return (
    <div class="overflow-x-auto rounded-xl bg-zinc-950 p-4 ring-1 ring-zinc-800 [background-image:radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px]">
      <div class="flex min-w-max items-center">
        <Slot node={g.root()} path={[]} />
        <span class={`h-0.5 w-6 ${wire}`} />
        <span
          class={[
            "flex min-h-11 min-w-14 items-center justify-center rounded-lg font-mono text-sm font-bold",
            g.result().ok ? "bg-emerald-400 text-zinc-950" : "bg-zinc-800 text-zinc-400",
          ]}
        >
          OUT
        </span>
      </div>
    </div>
  );
}
