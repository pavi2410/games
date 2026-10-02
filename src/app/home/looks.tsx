import type { JSX } from "@solidjs/web";

const frame = { viewBox: "0 0 120 80", class: "h-full w-full" } as const;

const minesweeper = (
  <svg {...frame}>
    <g fill="#f3f4f6" stroke="#9ca3af" stroke-width="2">
      <MiniBoard />
    </g>
    <circle cx="60" cy="42" r="12" fill="#3b2a63" />
    <g stroke="#3b2a63" stroke-width="3" stroke-linecap="round">
      <path d="M60 24 V30 M60 54 V60 M42 42 H48 M72 42 H78 M47 29 L51 33 M73 29 L69 33 M47 55 L51 51 M73 55 L69 51" />
    </g>
    <circle cx="56" cy="38" r="3" fill="#fff" opacity="0.7" />
    <path d="M96 24 V46" stroke="#3b2a63" stroke-width="3" stroke-linecap="round" />
    <path d="M96 24 L110 30 L96 37 Z" fill="#ff4d6d" />
  </svg>
);

/** 4x3 mini board tiles. */
function MiniBoard() {
  return (
    <>
      {[0, 1, 2].flatMap((r) =>
        [0, 1, 2, 3].map((c) => <rect x={8 + c * 26} y={8 + r * 22} width="22" height="18" rx="4" />),
      )}
    </>
  );
}

const arrows = (
  <svg {...frame}>
    <g fill="none" stroke="#3b2a63" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 20 H52 V44" />
      <path d="M30 64 H78 V30" />
      <path d="M64 14 H100 V58" />
    </g>
    <g fill="#3b2a63">
      <path d="M52 56 L45 44 H59 Z" />
      <path d="M78 18 L71 30 H85 Z" />
      <path d="M100 70 L93 58 H107 Z" />
    </g>
  </svg>
);

const regex = (
  <svg {...frame}>
    <rect x="8" y="14" width="104" height="52" rx="12" fill="#1f2937" />
    <circle cx="20" cy="26" r="3" fill="#ff6fa8" />
    <circle cx="30" cy="26" r="3" fill="#f5c518" />
    <circle cx="40" cy="26" r="3" fill="#36c9a0" />
    <text x="60" y="52" text-anchor="middle" font-family="ui-monospace, monospace" font-size="20" font-weight="700" fill="#6ee7b7">
      /a+b/
    </text>
    <rect x="94" y="40" width="5" height="16" fill="#6ee7b7" />
  </svg>
);

const gates = (
  <svg {...frame}>
    <g fill="none" stroke="#3b2a63" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 30 H34 M8 50 H34 M82 40 H112" />
      <path d="M34 18 H56 A22 22 0 0 1 56 62 H34 Z" fill="#fff3bf" />
    </g>
    <circle cx="8" cy="30" r="5" fill="#ff9ecb" />
    <circle cx="8" cy="50" r="5" fill="#8fb8ff" />
    <circle cx="112" cy="40" r="5" fill="#36c9a0" />
    <text x="52" y="46" text-anchor="middle" font-family="ui-monospace, monospace" font-size="13" font-weight="700" fill="#3b2a63">
      AND
    </text>
  </svg>
);

const fallback = (
  <svg {...frame}>
    <circle cx="60" cy="40" r="22" fill="#c3a6ff" />
    <path d="M52 30 L74 40 L52 50 Z" fill="#fff" />
  </svg>
);

export interface Look {
  art: JSX.Element;
  /** Tile backdrop + 3D lip colour (full class strings so Tailwind keeps them). */
  bg: string;
  lip: string;
  btn: string;
}

const LOOKS: Record<string, Look> = {
  minesweeper: { art: minesweeper, bg: "bg-pink-200", lip: "border-pink-400", btn: "bg-pink-500" },
  arrows: { art: arrows, bg: "bg-sky-200", lip: "border-sky-400", btn: "bg-sky-500" },
  regex: { art: regex, bg: "bg-emerald-200", lip: "border-emerald-400", btn: "bg-emerald-500" },
  gates: { art: gates, bg: "bg-amber-200", lip: "border-amber-400", btn: "bg-amber-500" },
};

export const lookFor = (id: string): Look =>
  LOOKS[id] ?? { art: fallback, bg: "bg-violet-200", lip: "border-violet-400", btn: "bg-violet-500" };
