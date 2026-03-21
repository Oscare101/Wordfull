import { db } from '../database';
import { initDatabase } from '../initDatabase';

export type RawSettingsRow = {
  id: number;
  theme: string;
  language: string;
  selected_word_pack_id: string;
  start_date: number;
};

export type RawStatisticsRow = {
  id: number;
  words_memorized: number;
  words_attempted: number;
  time_spent: number;
  games: number;
};

export type RawHistoryRow = {
  id: string;
  timestamp: number;
  duration: number;
  mode: string;
  word_pack_id: string;
  word_pack_name_snapshot: string;
  words_amount: number;
  correct_words: number;
  words_json: string;
  inputs_json: string;
  language: string;
};

export type BackupData = {
  settings: RawSettingsRow[];
  statistics: RawStatisticsRow[];
  history: RawHistoryRow[];
};

export const backupRepository = {
  async readAllTables(): Promise<BackupData> {
    const settingsResult = await db.executeAsync('SELECT * FROM settings');
    const statisticsResult = await db.executeAsync('SELECT * FROM statistics');
    const historyResult = await db.executeAsync(
      'SELECT * FROM history ORDER BY timestamp DESC',
    );

    return {
      settings: (settingsResult.results ?? []) as RawSettingsRow[],
      statistics: (statisticsResult.results ?? []) as RawStatisticsRow[],
      history: (historyResult.results ?? []) as RawHistoryRow[],
    };
  },

  async wipeAllTables(): Promise<void> {
    await db.executeAsync('DELETE FROM history');
    await db.executeAsync('DELETE FROM statistics');
    await db.executeAsync('DELETE FROM settings');
  },

  async restoreAllTables(data: BackupData): Promise<void> {
    await db.executeAsync('BEGIN TRANSACTION');

    try {
      await db.executeAsync('DELETE FROM history');
      await db.executeAsync('DELETE FROM statistics');
      await db.executeAsync('DELETE FROM settings');

      for (const row of data.settings) {
        await db.executeAsync(
          `
          INSERT INTO settings (
            id,
            theme,
            language,
            selected_word_pack_id,
            start_date
          ) VALUES (?, ?, ?, ?, ?)
          `,
          [
            row.id,
            row.theme,
            row.language,
            row.selected_word_pack_id,
            row.start_date,
          ],
        );
      }

      for (const row of data.statistics) {
        await db.executeAsync(
          `
          INSERT INTO statistics (
            id,
            words_memorized,
            words_attempted,
            time_spent,
            games
          ) VALUES (?, ?, ?, ?, ?)
          `,
          [
            row.id,
            row.words_memorized,
            row.words_attempted,
            row.time_spent,
            row.games,
          ],
        );
      }

      for (const row of data.history) {
        await db.executeAsync(
          `
          INSERT INTO history (
            id,
            timestamp,
            duration,
            mode,
            word_pack_id,
            word_pack_name_snapshot,
            words_amount,
            correct_words,
            words_json,
            inputs_json,
            language
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            row.id,
            row.timestamp,
            row.duration,
            row.mode,
            row.word_pack_id,
            row.word_pack_name_snapshot,
            row.words_amount,
            row.correct_words,
            row.words_json,
            row.inputs_json,
            row.language,
          ],
        );
      }

      await db.executeAsync('COMMIT');
    } catch (error) {
      await db.executeAsync('ROLLBACK');
      throw error;
    }
  },

  async wipeAndInit(): Promise<void> {
    await this.wipeAllTables();
    await initDatabase();
  },
};
