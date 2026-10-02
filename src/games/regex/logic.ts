import type { Level } from "./levels";

export interface Result {
  error: string | null;
  /** Per word: true = correct, false = wrong, null = not evaluated yet. */
  hits: (boolean | null)[];
  avoids: (boolean | null)[];
  correct: number;
  total: number;
  ok: boolean;
}

export const stars = (len: number, par: number) => (len <= par ? 3 : len <= par + 3 ? 2 : 1);

export function evaluate(lv: Level, src: string): Result {
  const total = lv.match.length + lv.avoid.length;
  const idle = (error: string | null): Result => ({
    error,
    hits: lv.match.map(() => null),
    avoids: lv.avoid.map(() => null),
    correct: 0,
    total,
    ok: false,
  });

  if (!src) return idle(null);
  let re: RegExp;
  try {
    re = new RegExp(src);
  } catch (e) {
    return idle((e as Error).message.replace(/^Invalid regular expression: \/[\s\S]*\/[a-z]*: /, ""));
  }

  const hits = lv.match.map((w) => re.test(w));
  const avoids = lv.avoid.map((w) => !re.test(w));
  const correct = hits.filter(Boolean).length + avoids.filter(Boolean).length;
  return { error: null, hits, avoids, correct, total, ok: correct === total };
}
