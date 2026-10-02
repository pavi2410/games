import { For } from "solid-js";

type Kind = "circle" | "square" | "tri" | "ring" | "plus" | "star";

// Fixed layout (no randomness) so it's stable between renders.
const BITS: { k: Kind; x: number; y: number; s: number; c: string; d: number; t: number }[] = [
  { k: "circle", x: 6, y: 12, s: 38, c: "#ff9ecb", d: 0, t: 13 },
  { k: "square", x: 88, y: 8, s: 30, c: "#8fb8ff", d: 2, t: 16 },
  { k: "tri", x: 20, y: 70, s: 40, c: "#ffd36e", d: 4, t: 15 },
  { k: "ring", x: 92, y: 46, s: 46, c: "#7fe3c8", d: 1, t: 18 },
  { k: "plus", x: 48, y: 6, s: 28, c: "#c3a6ff", d: 3, t: 14 },
  { k: "star", x: 78, y: 82, s: 36, c: "#ff9ecb", d: 5, t: 17 },
  { k: "circle", x: 62, y: 62, s: 22, c: "#8fb8ff", d: 6, t: 12 },
  { k: "square", x: 4, y: 44, s: 24, c: "#7fe3c8", d: 2, t: 19 },
  { k: "tri", x: 70, y: 28, s: 26, c: "#c3a6ff", d: 7, t: 15 },
  { k: "plus", x: 36, y: 88, s: 30, c: "#ffd36e", d: 1, t: 16 },
  { k: "ring", x: 12, y: 90, s: 30, c: "#8fb8ff", d: 4, t: 13 },
  { k: "star", x: 94, y: 70, s: 22, c: "#ffd36e", d: 3, t: 18 },
];

function Bit(props: { k: Kind; s: number; c: string }) {
  const stroke = props.c;
  return (
    <svg width={props.s} height={props.s} viewBox="0 0 40 40" fill={props.k === "ring" || props.k === "plus" ? "none" : props.c}>
      {props.k === "circle" && <circle cx="20" cy="20" r="18" />}
      {props.k === "square" && <rect x="4" y="4" width="32" height="32" rx="8" />}
      {props.k === "tri" && <path d="M20 4 L37 34 L3 34 Z" stroke={stroke} stroke-width="4" stroke-linejoin="round" />}
      {props.k === "ring" && <circle cx="20" cy="20" r="15" stroke={stroke} stroke-width="7" />}
      {props.k === "plus" && <path d="M20 5 V35 M5 20 H35" stroke={stroke} stroke-width="8" stroke-linecap="round" />}
      {props.k === "star" && (
        <path
          d="M20 3 L25 15 L38 16 L28 25 L31 37 L20 30 L9 37 L12 25 L2 16 L15 15 Z"
          stroke={stroke}
          stroke-width="3"
          stroke-linejoin="round"
        />
      )}
    </svg>
  );
}

/** Slow-drifting candy shapes behind the home content. */
export default function Float() {
  return (
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      <For each={BITS}>
        {(b) => (
          <div
            class="animate-float absolute opacity-70"
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              "animation-duration": `${b.t}s`,
              "animation-delay": `-${b.d}s`,
            }}
          >
            <Bit k={b.k} s={b.s} c={b.c} />
          </div>
        )}
      </For>
    </div>
  );
}
