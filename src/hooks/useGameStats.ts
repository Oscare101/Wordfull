import { useMemo } from 'react';
import { History } from '../constants/interfaces/interface';

type Result = {
  gamesAmountEasy: number;
  wordsAttemptsEasy: number;
  wordsMemorizedEasy: number;
  timePlayedEasy: number;
  gamesAmountHard: number;
  wordsAttemptsHard: number;
  wordsMemorizedHard: number;
  timePlayedHard: number;
  gamesAmountStamina: number;
  wordsAttemptsStamina: number;
  wordsMemorizedStamina: number;
  timePlayedStamina: number;
  averageTimePerGame: number;
  averageTimePerWord: number;
};

export default function useGameStats(history: History[]): Result {
  return useMemo(() => {
    let gamesAmountEasy = 0;
    let wordsAttemptsEasy = 0;
    let wordsMemorizedEasy = 0;
    let timePlayedEasy = 0;

    let gamesAmountHard = 0;
    let wordsAttemptsHard = 0;
    let wordsMemorizedHard = 0;
    let timePlayedHard = 0;

    let gamesAmountStamina = 0;
    let wordsAttemptsStamina = 0;
    let wordsMemorizedStamina = 0;
    let timePlayedStamina = 0;

    let totalTime = 0;
    let totalWords = 0;

    for (const item of history) {
      // --- count by mode ---
      if (item.mode === 'easy') {
        gamesAmountEasy++;
        wordsAttemptsEasy += item.wordsAmount ?? 0;
        wordsMemorizedEasy += item.correctWords ?? 0;
        timePlayedEasy += item.duration ?? 0;
      } else if (item.mode === 'hard') {
        gamesAmountHard++;
        wordsAttemptsHard += item.wordsAmount ?? 0;
        wordsMemorizedHard += item.correctWords ?? 0;
        timePlayedHard += item.duration ?? 0;
      } else if (item.mode === 'stamina') {
        gamesAmountStamina++;
        wordsAttemptsStamina += item.wordsAmount ?? 0;
        wordsMemorizedStamina += item.correctWords ?? 0;
        timePlayedStamina += item.duration ?? 0;
      }

      // --- accumulate ---
      totalTime += item.duration ?? 0;
      totalWords += item.wordsAmount ?? 0;
    }

    const totalGames = gamesAmountEasy + gamesAmountHard + gamesAmountStamina;

    return {
      gamesAmountEasy,
      wordsAttemptsEasy,
      wordsMemorizedEasy,
      timePlayedEasy,

      gamesAmountHard,
      wordsAttemptsHard,
      wordsMemorizedHard,
      timePlayedHard,

      gamesAmountStamina,
      wordsAttemptsStamina,
      wordsMemorizedStamina,
      timePlayedStamina,

      averageTimePerGame: totalGames > 0 ? totalTime / totalGames : 0,

      averageTimePerWord: totalWords > 0 ? totalTime / totalWords : 0,
    };
  }, [history]);
}
