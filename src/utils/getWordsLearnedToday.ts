import { History } from '../constants/interfaces/interface';

function getStartOfTodayTimestamp(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export function getWordsLearnedToday(history: History[]): number {
  const startOfToday = getStartOfTodayTimestamp();

  return history.reduce((total, item) => {
    if (item.timestamp >= startOfToday) {
      return total + item.correctWords;
    }

    return total;
  }, 0);
}
