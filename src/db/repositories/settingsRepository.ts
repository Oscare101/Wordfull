import { db } from '../database';
import {
  DEFAULT_SYSTEM_WORD_PACK_KEYS,
  Language,
  SYSTEM_WORD_PACK_KEYS,
  SystemWordPackKey,
} from '../../constants/interfaces/interface';
import { ThemeType } from '../../constants/themes/themeType';

export interface SettingsRow {
  id: number;
  theme: string;
  language: string;
  selected_system_word_pack_keys_json: string | null;
  start_date: number;
}

export interface AppSettings {
  theme: ThemeType;
  language: Language;
  selectedSystemWordPackKeys: SystemWordPackKey[];
  startDate: number;
}

function isSystemWordPackKey(value: unknown): value is SystemWordPackKey {
  return (
    typeof value === 'string' &&
    SYSTEM_WORD_PACK_KEYS.includes(value as SystemWordPackKey)
  );
}

export function parseSelectedSystemWordPackKeys(
  value: string | null,
): SystemWordPackKey[] {
  if (!value) {
    return DEFAULT_SYSTEM_WORD_PACK_KEYS;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return DEFAULT_SYSTEM_WORD_PACK_KEYS;
    }

    const validKeys = parsed.filter(isSystemWordPackKey);

    if (validKeys.length === 0) {
      return DEFAULT_SYSTEM_WORD_PACK_KEYS;
    }

    return Array.from(new Set(validKeys));
  } catch {
    return DEFAULT_SYSTEM_WORD_PACK_KEYS;
  }
}

export function stringifySelectedSystemWordPackKeys(
  keys: SystemWordPackKey[],
): string {
  const validKeys = Array.from(new Set(keys.filter(isSystemWordPackKey)));

  if (validKeys.length === 0) {
    return JSON.stringify(DEFAULT_SYSTEM_WORD_PACK_KEYS);
  }

  return JSON.stringify(validKeys);
}

function mapSettingsRow(row: Record<string, unknown>): SettingsRow {
  return {
    id: Number(row.id),
    theme: String(row.theme),
    language: String(row.language),
    selected_system_word_pack_keys_json:
      typeof row.selected_system_word_pack_keys_json === 'string'
        ? row.selected_system_word_pack_keys_json
        : null,
    start_date: Number(row.start_date),
  };
}

function mapToAppSettings(row: SettingsRow): AppSettings {
  return {
    theme: row.theme as ThemeType,
    language: row.language as Language,
    selectedSystemWordPackKeys: parseSelectedSystemWordPackKeys(
      row.selected_system_word_pack_keys_json,
    ),
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

  async updateSelectedSystemWordPackKeys(
    keys: SystemWordPackKey[],
  ): Promise<void> {
    const json = stringifySelectedSystemWordPackKeys(keys);

    await db.executeAsync(
      'UPDATE settings SET selected_system_word_pack_keys_json = ? WHERE id = ?',
      [json, 1],
    );
  },
};
