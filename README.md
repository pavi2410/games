# Game Room

A small collection of browser games, built with **Solid 2.0** on a plain Vite SPA. Mobile-first, no backend, progress saved in `localStorage`.

## Games

| Game | What it is |
| --- | --- |
| Minesweeper | Three board sizes, long-press to flag, chording, sound effects |
| Arrows | Slide every arrow out of a dense maze. Generated levels are solvable by construction |
| Regex Golf | Match the good words, dodge the bad ones with the shortest regex |
| Logic Gates | Build circuits that match a truth table with the fewest gates |
| Valid or Nope | Is that email, URL, IP, hex color or UUID valid? Fast swipe rounds |

## Stack

- [Solid 2.0 RC](https://github.com/solidjs/solid) and `@solidjs/router` 2.0 (next)
- Vite 8, Tailwind CSS 4, TypeScript 7
- pnpm (managed via [mise](https://mise.jdx.dev))

## Develop

```sh
pnpm install
pnpm dev      # start dev server
pnpm build    # typecheck + production build
```

## Structure

```
src/
  app/          shell, router, home page
  games/        one folder per game, plus registry.ts
  lib/          sound, storage, viewport helpers
```

## Add a game

1. Create `src/games/<id>/Game.tsx` with a default-exported component.
2. Add an entry to `src/games/registry.ts`. The route is generated from it.
3. Optionally add card art in `src/app/home/looks.tsx` and a progress chip in `stats.ts`.
