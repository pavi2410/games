import { For, Show, useContext } from "solid-js";
import { ArrowsCtx } from "./ctx";

const ANGLE = { E: 0, S: 90, W: 180, N: 270 } as const;

export default function Board() {
  const g = useContext(ArrowsCtx);

  return (
    <svg
      viewBox={`0 0 ${g.dims().w} ${g.dims().h}`}
      class="block w-full touch-manipulation overflow-hidden rounded-xl bg-white select-none"
    >
      <For each={g.shapes}>
        {(s, id) => (
          <Show when={!s.gone}>
            <g class="cursor-pointer" onClick={() => g.tap(id())}>
              <path
                d={s.d}
                fill="none"
                stroke="transparent"
                stroke-width="0.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                pointer-events="stroke"
              />
              <path
                d={s.d}
                fill="none"
                stroke={g.bad().includes(id()) ? "#ef4444" : "#111"}
                stroke-width="0.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <polygon
                points="0.34,0 -0.08,-0.26 -0.08,0.26"
                fill={g.bad().includes(id()) ? "#ef4444" : "#111"}
                transform={`translate(${s.hx} ${s.hy}) rotate(${ANGLE[s.dir]})`}
              />
            </g>
          </Show>
        )}
      </For>
    </svg>
  );
}
