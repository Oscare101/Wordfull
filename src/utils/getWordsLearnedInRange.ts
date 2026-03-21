import { History } from '../constants/interfaces/interface';

function getStartOfTodayTimestamp(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function getStartOfDaysAgo(days: number): number {
  const startOfToday = getStartOfTodayTimestamp();
  return startOfToday - days * 24 * 60 * 60 * 1000;
}

export function getWordsLearnedInLastDays(
  history: History[],
  days: number,
): number {
  const start = getStartOfDaysAgo(days - 1); // include today
  const now = Date.now();

  let total = 0;

  for (const item of history) {
    if (item.timestamp >= start && item.timestamp <= now) {
      total += item.correctWords;
    }
  }

  return total;
}
