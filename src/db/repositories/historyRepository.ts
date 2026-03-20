import { db } from '../database';
import {
  GameMode,
  History,
  Language,
} from '../../constants/interfaces/interface';

interface HistoryRow {
  id: string;
  timestamp: number;
  duration: number;
  language: Language;
  mode: string;
  word_pack_id: string;
  word_pack_name_snapshot: string;
  words_amount: number;
  correct_words: number;
  words_json: string;
  inputs_json: string;
}

function mapHistoryRow(row: Record<string, unknown>): History {
  return {
    id: String(row.id),
    timestamp: Number(row.timestamp),
    language: String(row.language) as Language,
    duration: Number(row.duration),
    mode: String(row.mode) as GameMode,
    wordPackId: String(row.word_pack_id),
    wordPackNameSnapshot: String(row.word_pack_name_snapshot),
    wordsAmount: Number(row.words_amount),
    correctWords: Number(row.correct_words),
    words: JSON.parse(String(row.words_json)),
    inputs: JSON.parse(String(row.inputs_json)),
  };
}

export const historyRepository = {
  async create(history: History): Promise<void> {
    await db.executeAsync(
      `
        INSERT INTO history (
          id,
          timestamp,
          duration,
          language,
          mode,
          word_pack_id,
          word_pack_name_snapshot,
          words_amount,
          correct_words,
          words_json,
          inputs_json
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        history.id,
        history.timestamp,
        history.duration,
        history.language,
        history.mode,
        history.wordPackId,
        history.wordPackNameSnapshot,
        history.wordsAmount,
        history.correctWords,
        JSON.stringify(history.words),
        JSON.stringify(history.inputs),
      ],
    );
  },

  async getAll(): Promise<History[]> {
    const result = await db.executeAsync(
      `
        SELECT *
        FROM history
        ORDER BY timestamp DESC
      `,
    );

    const rows = result.results ?? [];
    return rows.map(row => mapHistoryRow(row as Record<string, unknown>));
  },

  async getBestAttempts(limit: number = 10): Promise<History[]> {
    const result = await db.executeAsync(
      `
        SELECT *
        FROM history
        ORDER BY correct_words DESC, duration ASC
        LIMIT ?
      `,
      [limit],
    );

    const rows = result.results ?? [];
    return rows.map(row => mapHistoryRow(row as Record<string, unknown>));
  },
};
