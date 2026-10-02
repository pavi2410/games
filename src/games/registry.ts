import { lazy, type Component } from "solid-js";

export interface GameInfo {
  id: string;
  title: string;
  blurb: string;
  component: Component;
}

export const games: GameInfo[] = [
  {
    id: "minesweeper",
    title: "Minesweeper",
    blurb: "Clear the board without hitting a mine.",
    component: lazy(() => import("./minesweeper/Game")),
  },
  {
    id: "arrows",
    title: "Arrows",
    blurb: "Slide every arrow out of the maze without crashing.",
    component: lazy(() => import("./arrows/Game")),
  },
  {
    id: "regex",
    title: "Regex Golf",
    blurb: "Match the good words, dodge the bad. Shortest regex wins.",
    component: lazy(() => import("./regex/Game")),
  },
  {
    id: "gates",
    title: "Logic Gates",
    blurb: "Build circuits that match a truth table with the fewest gates.",
    component: lazy(() => import("./gates/Game")),
  },
  {
    id: "valid",
    title: "Valid or Nope",
    blurb: "Is that email, URL or IP address actually valid? Swipe fast.",
    component: lazy(() => import("./valid/Game")),
  },
];
