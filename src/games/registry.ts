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
];
