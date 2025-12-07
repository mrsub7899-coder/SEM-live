// backend/src/rank/rank.utils.ts

export function calculateLevel(rankPoints: number): number {
  let level = 1;
  while (rankPoints >= level * level * 50) {
    level++;
  }
  return level;
}
