import { lazy, type Component } from "solid-js";
import { GAMES, type GameMeta } from "./meta";

export interface GameInfo extends GameMeta {
  component: Component;
}

const loaders: Record<string, () => Promise<{ default: Component }>> = {
  minesweeper: () => import("./minesweeper/Game"),
  arrows: () => import("./arrows/Game"),
  regex: () => import("./regex/Game"),
  gates: () => import("./gates/Game"),
  valid: () => import("./valid/Game"),
};

export const games: GameInfo[] = GAMES.map((g) => ({ ...g, component: lazy(loaders[g.id]) }));
