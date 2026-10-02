export const LEVELS = {
  easy: { label: "Beginner", w: 9, h: 9, mines: 10 },
  medium: { label: "Intermediate", w: 16, h: 16, mines: 40 },
  hard: { label: "Expert", w: 30, h: 16, mines: 99 },
} as const;

export type LevelId = keyof typeof LEVELS;
export type Level = (typeof LEVELS)[LevelId];
export const LEVEL_IDS = Object.keys(LEVELS) as LevelId[];

export interface Dims {
  w: number;
  h: number;
  mines: number;
}

/**
 * Narrow-portrait layout: cap width, grow tall. Same cells + mines,
 * so difficulty is unchanged — Expert 30x16 becomes 16x30.
 */
export function layoutFor(id: LevelId, narrow: boolean): Dims {
  const l = LEVELS[id];
  if (!narrow) return { w: l.w, h: l.h, mines: l.mines };
  return { w: Math.min(l.w, l.h), h: Math.max(l.w, l.h), mines: l.mines };
}
