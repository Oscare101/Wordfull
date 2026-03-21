import { History } from '../constants/interfaces/interface';

// const top5Games = getTopBestGames(history, 5);

export function getTopBestGames(
  history: History[],
  limit: number = 5,
): History[] {
  return [...history]
    .sort((a, b) => {
      if (b.correctWords !== a.correctWords) {
        return b.correctWords - a.correctWords;
      }

      const aAccuracy = a.wordsAmount > 0 ? a.correctWords / a.wordsAmount : 0;
      const bAccuracy = b.wordsAmount > 0 ? b.correctWords / b.wordsAmount : 0;

      if (bAccuracy !== aAccuracy) {
        return bAccuracy - aAccuracy;
      }

      if (a.duration !== b.duration) {
        return a.duration - b.duration;
      }

      return b.timestamp - a.timestamp;
    })
    .slice(0, limit);
}
