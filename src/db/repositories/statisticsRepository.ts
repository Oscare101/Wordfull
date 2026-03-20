import { db } from '../database';
import { Statistics } from '../../constants/interfaces/interface';

function mapStatisticsRow(row: Record<string, unknown>): Statistics {
  return {
    wordsMemorized: Number(row.words_memorized),
    wordsAttempted: Number(row.words_attempted),
    timeSpent: Number(row.time_spent),
    games: Number(row.games),
  };
}

export const statisticsRepository = {
  async get(): Promise<Statistics | null> {
    const result = await db.executeAsync(
      'SELECT * FROM statistics WHERE id = ? LIMIT 1',
      [1],
    );

    const firstRow = result.results?.[0];
    if (!firstRow) {
      return null;
    }

    return mapStatisticsRow(firstRow as Record<string, unknown>);
  },

  async increment(params: {
    wordsMemorized: number;
    wordsAttempted: number;
    timeSpent: number;
    games?: number;
  }): Promise<void> {
    await db.executeAsync(
      `
        UPDATE statistics
        SET
          words_memorized = words_memorized + ?,
          words_attempted = words_attempted + ?,
          time_spent = time_spent + ?,
          games = games + ?
        WHERE id = ?
      `,
      [
        params.wordsMemorized,
        params.wordsAttempted,
        params.timeSpent,
        params.games ?? 1,
        1,
      ],
    );
  },
};
