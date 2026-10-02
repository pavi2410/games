import { createEffect, createMemo, createSignal, Show, type ParentComponent } from "solid-js";
import { useBeforeLeave, useLocation } from "@solidjs/router";

import { GAMES, SITE_NAME } from "../games/meta";

const HOME_TITLE = `${SITE_NAME}: tiny browser games for programmers`;
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const COVER_MS = 220;

/**
 * App frame: candy iris-wipe between routes, route-aware body theme, and a
 * fade-in for each new page (opacity only: a transform would break fixed overlays).
 */
const Shell: ParentComponent = (props) => {
  const loc = useLocation();
  const [cover, setCover] = createSignal(false);
  const home = () => loc.pathname === "/";

  // New <main> per route so the fade-in replays on every navigation.
  const page = createMemo(() => {
    loc.pathname;
    return <main class="animate-page-in">{props.children}</main>;
  });

  // Wipe out, navigate, wipe in.
  useBeforeLeave((e) => {
    if (e.defaultPrevented || reduced()) return;
    e.preventDefault();
    setCover(true);
    setTimeout(() => e.retry(true), COVER_MS);
  });

  createEffect(
    () => loc.pathname,
    (p) => {
      document.body.classList.toggle("candy", p === "/");
      const g = GAMES.find((x) => p === `/${x.id}`);
      document.title = g ? `${g.title} · ${SITE_NAME}` : HOME_TITLE;
      setTimeout(() => setCover(false), 90);
    },
  );

  return (
    <>
      <div class="mx-auto max-w-5xl p-4">
        <Show when={!home()}>
          <header class="mb-6">
            <a
              href="/"
              class="font-display inline-flex items-center gap-1 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-zinc-100 hover:bg-white/20"
            >
              ‹ Games
            </a>
          </header>
        </Show>
        {page()}
      </div>

      <div
        aria-hidden="true"
        class="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(135deg,#ff9ecb,#ffd36e,#7fe3c8,#8fb8ff)] transition-[clip-path] duration-200 ease-in-out"
        style={{ "clip-path": `circle(${cover() ? "150%" : "0%"} at 50% 50%)` }}
      />
    </>
  );
};

export default Shell;
