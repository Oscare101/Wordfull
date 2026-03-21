import { useMemo } from 'react';
import { useHistory } from '../context/HistoryContext';
import { History } from '../constants/interfaces/interface';

// const top5Games = useTopBestGames(5);

function sortBestGames(history: History[]): History[] {
  return [...history].sort((a, b) => {
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
  });
}

export function useTopBestGames(limit: number = 5) {
  const { history } = useHistory();

  return useMemo(() => {
    return sortBestGames(history).slice(0, limit);
  }, [history, limit]);
}
