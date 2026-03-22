import { useMemo } from 'react';
import { useHistory } from '../context/HistoryContext';

// const {
//   wordsLearnedToday,
//   accuracyToday,

//   wordsLearnedWeek,
//   accuracyWeek,
//   wordsLearnedWeekDailyAverage,

//   wordsLearnedMonth,
//   accuracyMonth,
//   wordsLearnedMonthDailyAverage,

//   wordsLearnedYear,
//   accuracyYear,
//   wordsLearnedYearDailyAverage,

//   wordsLearnedTotal,
//   accuracyTotal,
//   wordsLearnedDailyAverage,
// } = usePeriodStats();

function getStartOfTodayTimestamp(): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

function getStartOfDaysAgo(days: number): number {
  const startOfToday = getStartOfTodayTimestamp();
  return startOfToday - days * 24 * 60 * 60 * 1000;
}

function getDayKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function usePeriodStats() {
  const { history } = useHistory();

  return useMemo(() => {
    const now = Date.now();

    const ranges = {
      today: getStartOfTodayTimestamp(),
      week: getStartOfDaysAgo(6),
      month: getStartOfDaysAgo(29),
      year: getStartOfDaysAgo(364),
    };

    let wordsLearnedToday = 0;
    let wordsAttemptToday = 0;

    let wordsLearnedWeek = 0;
    let wordsAttemptWeek = 0;

    let wordsLearnedMonth = 0;
    let attemptedWordsMonth = 0;

    let wordsLearnedYear = 0;
    let attemptedWordsYear = 0;

    let wordsLearnedTotal = 0;
    let attemptedWordsTotal = 0;

    const activeDaysWeek = new Set<string>();
    const activeDaysMonth = new Set<string>();
    const activeDaysYear = new Set<string>();
    const activeDaysTotal = new Set<string>();

    for (const item of history) {
      const ts = item.timestamp;
      const correctWords = item.correctWords;
      const dayKey = getDayKey(ts);

      wordsLearnedTotal += correctWords;
      attemptedWordsTotal += item.wordsAmount;
      activeDaysTotal.add(dayKey);

      if (ts >= ranges.year && ts <= now) {
        wordsLearnedYear += correctWords;
        attemptedWordsYear += item.wordsAmount;
        activeDaysYear.add(dayKey);

        if (ts >= ranges.month) {
          wordsLearnedMonth += correctWords;
          attemptedWordsMonth += item.wordsAmount;
          activeDaysMonth.add(dayKey);

          if (ts >= ranges.week) {
            wordsLearnedWeek += correctWords;
            wordsAttemptWeek += item.wordsAmount;
            activeDaysWeek.add(dayKey);

            if (ts >= ranges.today) {
              wordsLearnedToday += correctWords;
              wordsAttemptToday += item.wordsAmount;
            }
          }
        }
      }
    }

    const buildAverage = (total: number, activeDaysCount: number): number => {
      if (activeDaysCount === 0) {
        return 0;
      }

      return total / activeDaysCount;
    };

    return {
      wordsLearnedToday,
      accuracyToday:
        wordsAttemptToday > 0 ? wordsLearnedToday / wordsAttemptToday : 0,

      wordsLearnedWeek,
      accuracyWeek:
        wordsAttemptWeek > 0 ? wordsLearnedWeek / wordsAttemptWeek : 0,
      wordsLearnedWeekDailyAverage: buildAverage(
        wordsLearnedWeek,
        activeDaysWeek.size,
      ),

      wordsLearnedMonth,
      accuracyMonth:
        attemptedWordsMonth > 0 ? wordsLearnedMonth / attemptedWordsMonth : 0,
      wordsLearnedMonthDailyAverage: buildAverage(
        wordsLearnedMonth,
        activeDaysMonth.size,
      ),

      wordsLearnedYear,
      accuracyYear:
        attemptedWordsYear > 0 ? wordsLearnedYear / attemptedWordsYear : 0,
      wordsLearnedYearDailyAverage: buildAverage(
        wordsLearnedYear,
        activeDaysYear.size,
      ),

      wordsLearnedTotal,
      accuracyTotal:
        attemptedWordsTotal > 0 ? wordsLearnedTotal / attemptedWordsTotal : 0,
      wordsLearnedDailyAverage: buildAverage(
        wordsLearnedTotal,
        activeDaysTotal.size,
      ),
    };
  }, [history]);
}
