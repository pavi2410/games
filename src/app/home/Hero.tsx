import { For, createSignal, onSettled } from "solid-js";

const TITLE = "Game Room";
const COLORS = ["#ff6fa8", "#ffa94d", "#f5c518", "#36c9a0", "#4d96ff", "#9b6dff"];
const TAGLINES = [
  "Pick a game. Lose an hour.",
  "Tiny games, big brain energy.",
  "Tap. Think. Repeat.",
  "No ads. No sign-ups. Just play.",
];

export default function Hero() {
  const [i, setI] = createSignal(Math.floor(Math.random() * TAGLINES.length));

  onSettled(() => {
    const id = setInterval(() => setI((n) => (n + 1) % TAGLINES.length), 3600);
    return () => clearInterval(id);
  });

  return (
    <header class="mb-8 text-center sm:mb-12">
      <h1 class="font-display flex flex-wrap justify-center gap-x-1 text-5xl font-bold sm:text-7xl" aria-label={TITLE}>
        <For each={[...TITLE]}>
          {(ch, n) =>
            ch === " " ? (
              <span class="w-3 sm:w-5" />
            ) : (
              <span
                aria-hidden="true"
                class="animate-bob inline-block drop-shadow-[0_4px_0_rgba(59,42,99,0.15)]"
                style={{ color: COLORS[n() % COLORS.length], "animation-delay": `${n() * 0.12}s` }}
              >
                {ch}
              </span>
            )
          }
        </For>
      </h1>
      <p class="font-display mt-3 h-7 text-lg font-medium text-[#6b5a94] sm:text-xl">{TAGLINES[i()]}</p>
    </header>
  );
}
