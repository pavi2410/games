import { createSignal, onSettled, untrack } from "solid-js";

/** True on narrow portrait phones. Updates on rotate/resize. */
export function createNarrowPortrait() {
  const query = () => window.matchMedia("(max-width: 640px) and (orientation: portrait)");
  const [narrow, setNarrow] = createSignal(untrack(() => query().matches));

  onSettled(() => {
    const m = query();
    const onChange = (e: MediaQueryListEvent) => setNarrow(e.matches);
    m.addEventListener("change", onChange);
    setNarrow(m.matches);
    return () => m.removeEventListener("change", onChange);
  });

  return narrow;
}
