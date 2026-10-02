export const LEVELS = {
  easy: { label: "Beginner", w: 9, h: 9, mines: 10 },
  medium: { label: "Intermediate", w: 16, h: 16, mines: 40 },
  hard: { label: "Expert", w: 30, h: 16, mines: 99 },
} as const;

export type LevelId = keyof typeof LEVELS;
export type Level = (typeof LEVELS)[LevelId];
export const LEVEL_IDS = Object.keys(LEVELS) as LevelId[];
