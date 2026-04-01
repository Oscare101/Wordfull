import { db } from './database';
import { getInitialAppLanguage } from '../utils/getInitialAppLanguage';
import { DEFAULT_THEME } from '../constants/themes/themeType';
import { DEFAULT_SYSTEM_WORD_PACK_KEYS } from '../constants/interfaces/interface';
import { stringifySelectedSystemWordPackKeys } from './repositories/settingsRepository';

type TableInfoRow = {
  name?: string;
};

export async function initDatabase(): Promise<void> {
  if (__DEV__) console.log('initDatabase: started');

  // TODO only for dev reset db
  // await db.executeAsync(`DROP TABLE IF EXISTS settings`);
  // await db.executeAsync(`DROP TABLE IF EXISTS history`);
  // await db.executeAsync(`DROP TABLE IF EXISTS statistics`);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY NOT NULL,
      theme TEXT NOT NULL,
      language TEXT NOT NULL,
      selected_system_word_pack_keys_json TEXT,
      start_date INTEGER NOT NULL
    )
  `);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS history (
      id TEXT PRIMARY KEY NOT NULL,
      timestamp INTEGER NOT NULL,
      duration INTEGER NOT NULL,
      mode TEXT NOT NULL,
      word_pack_id TEXT NOT NULL,
      word_pack_name_snapshot TEXT NOT NULL,
      words_amount INTEGER NOT NULL,
      correct_words INTEGER NOT NULL,
      words_json TEXT NOT NULL,
      inputs_json TEXT NOT NULL,
      language TEXT NOT NULL
    )
  `);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS statistics (
      id INTEGER PRIMARY KEY NOT NULL,
      words_memorized INTEGER NOT NULL,
      words_attempted INTEGER NOT NULL,
      time_spent INTEGER NOT NULL,
      games INTEGER NOT NULL
    )
  `);

  if (__DEV__) console.log('initDatabase: base tables ensured');

  // For old installed apps:
  // if settings table already existed with the old schema,
  // CREATE TABLE IF NOT EXISTS will NOT add the new column.
  // So we must check it manually and add the new column if needed.
  const tableInfoResult = await db.executeAsync('PRAGMA table_info(settings)');
  const tableInfoRows = (tableInfoResult.results ?? []) as TableInfoRow[];

  const hasSelectedSystemWordPackKeysColumn = tableInfoRows.some(
    row => row.name === 'selected_system_word_pack_keys_json',
  );

  if (!hasSelectedSystemWordPackKeysColumn) {
    await db.executeAsync(`
      ALTER TABLE settings
      ADD COLUMN selected_system_word_pack_keys_json TEXT
    `);

    if (__DEV__)
      console.log(
        'initDatabase: added selected_system_word_pack_keys_json column',
      );
  }

  const statisticsResult = await db.executeAsync(
    'SELECT id FROM statistics WHERE id = ? LIMIT 1',
    [1],
  );

  if (!statisticsResult.results?.length) {
    await db.executeAsync(
      `
      INSERT INTO statistics (
        id,
        words_memorized,
        words_attempted,
        time_spent,
        games
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [1, 0, 0, 0, 0],
    );

    if (__DEV__) console.log('initDatabase: default statistics inserted');
  }

  const existingSettingsResult = await db.executeAsync(
    `
      SELECT
        id,
        language,
        selected_system_word_pack_keys_json
      FROM settings
      WHERE id = ?
      LIMIT 1
    `,
    [1],
  );

  const existingSettingsRows = existingSettingsResult.results ?? [];
  const firstSettingsRow = existingSettingsRows[0] as
    | {
        id?: number;
        language?: string;
        selected_system_word_pack_keys_json?: string | null;
      }
    | undefined;

  const hasSettingsRow = existingSettingsRows.length > 0;

  if (__DEV__) console.log('initDatabase: hasSettingsRow =', hasSettingsRow);

  const defaultSelectedSystemWordPackKeysJson =
    stringifySelectedSystemWordPackKeys(DEFAULT_SYSTEM_WORD_PACK_KEYS);

  if (!hasSettingsRow) {
    const initialLanguage = getInitialAppLanguage();

    await db.executeAsync(
      `
        INSERT INTO settings (
          id,
          theme,
          language,
          selected_system_word_pack_keys_json,
          start_date
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [
        1,
        DEFAULT_THEME,
        initialLanguage,
        defaultSelectedSystemWordPackKeysJson,
        Date.now(),
      ],
    );

    if (__DEV__)
      console.log(
        'initDatabase: default settings inserted with language:',
        initialLanguage,
        'and selected keys:',
        defaultSelectedSystemWordPackKeysJson,
      );

    return;
  }

  // Existing user:
  // old versions had no user-controlled pack settings,
  // so we simply replace missing value with the new default selection.
  if (!firstSettingsRow?.selected_system_word_pack_keys_json) {
    await db.executeAsync(
      `
        UPDATE settings
        SET selected_system_word_pack_keys_json = ?
        WHERE id = ?
      `,
      [defaultSelectedSystemWordPackKeysJson, 1],
    );

    if (__DEV__)
      console.log(
        'initDatabase: fixed missing selected_system_word_pack_keys_json with default value:',
        defaultSelectedSystemWordPackKeysJson,
      );
  }
}
