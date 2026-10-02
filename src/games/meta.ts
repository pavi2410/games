/** Plain game data (no components) so build tooling can import it too. */
export const SITE = "https://games.pavi2410.com";
export const SITE_NAME = "Game Room";
export const SITE_DESC =
  "Tiny browser games for programmers: Minesweeper, Arrows, Regex Golf, Logic Gates and more. No ads, no sign-ups, just play.";

export interface GameMeta {
  id: string;
  title: string;
  blurb: string;
}

export const GAMES: GameMeta[] = [
  { id: "minesweeper", title: "Minesweeper", blurb: "Clear the board without hitting a mine." },
  { id: "arrows", title: "Arrows", blurb: "Slide every arrow out of the maze without crashing." },
  { id: "regex", title: "Regex Golf", blurb: "Match the good words, dodge the bad. Shortest regex wins." },
  { id: "gates", title: "Logic Gates", blurb: "Build circuits that match a truth table with the fewest gates." },
  { id: "valid", title: "Valid or Nope", blurb: "Is that email, URL or IP address actually valid? Swipe fast." },
];
