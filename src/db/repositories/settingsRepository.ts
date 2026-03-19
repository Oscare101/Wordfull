import { db } from '../database';
import { Language } from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';

export interface SettingsRow {
  id: number;
  theme: string;
  language: string;
  selected_word_pack_id: string | null;
  start_date: number;
}

export interface AppSettings {
  theme: ThemeType;
  language: Language;
  selectedWordPackId: string | null;
  startDate: number;
}

function mapSettingsRow(row: Record<string, unknown>): SettingsRow {
  return {
    id: Number(row.id),
    theme: String(row.theme),
    language: String(row.language),
    selected_word_pack_id:
      row.selected_word_pack_id == null
        ? null
        : String(row.selected_word_pack_id),
    start_date: Number(row.start_date),
  };
}

function mapToAppSettings(row: SettingsRow): AppSettings {
  return {
    theme: row.theme as ThemeType,
    language: row.language as Language,
    selectedWordPackId: row.selected_word_pack_id,
    startDate: row.start_date,
  };
}

export const settingsRepository = {
  async get(): Promise<AppSettings | null> {
    const result = await db.executeAsync(
      'SELECT * FROM settings WHERE id = ? LIMIT 1',
      [1],
    );

    const firstRow = result.results?.[0];
    if (!firstRow) {
      return null;
    }

    const settingsRow = mapSettingsRow(firstRow as Record<string, unknown>);
    return mapToAppSettings(settingsRow);
  },

  async updateTheme(theme: ThemeType): Promise<void> {
    await db.executeAsync('UPDATE settings SET theme = ? WHERE id = ?', [
      theme,
      1,
    ]);
  },

  async updateLanguage(language: Language): Promise<void> {
    await db.executeAsync('UPDATE settings SET language = ? WHERE id = ?', [
      language,
      1,
    ]);
  },

  async updateSelectedWordPack(wordPackId: string | null): Promise<void> {
    await db.executeAsync(
      'UPDATE settings SET selected_word_pack_id = ? WHERE id = ?',
      [wordPackId, 1],
    );
  },
};
