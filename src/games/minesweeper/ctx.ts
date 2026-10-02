import { createContext } from "solid-js";
import type { Game } from "./state";

export const GameCtx = createContext<Game>();
