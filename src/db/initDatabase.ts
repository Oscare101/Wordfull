import { db } from './database';
import { getInitialAppLanguage } from '../utils/getInitialAppLanguage';
import { DEFAULT_THEME } from '../constants/themes/themeType';
import { getDefaultWordPackIdByLanguage } from '../constants/wordPacks/defaultWordPack';

export async function initDatabase(): Promise<void> {
  console.log('initDatabase: started');

  // TODO only for dev reset db
  // await db.executeAsync(`DROP TABLE IF EXISTS settings`);
  // await db.executeAsync(`DROP TABLE IF EXISTS history`);
  // await db.executeAsync(`DROP TABLE IF EXISTS statistics`);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY NOT NULL,
      theme TEXT NOT NULL,
      language TEXT NOT NULL,
      selected_word_pack_id TEXT NOT NULL,
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

  console.log('initDatabase: settings table ensured');

  const existingResult = await db.executeAsync(
    'SELECT id, selected_word_pack_id, language FROM settings WHERE id = ? LIMIT 1',
    [1],
  );

  const existingRows = existingResult.results ?? [];
  const firstRow = existingRows[0] as
    | {
        id?: number;
        language?: string;
        selected_word_pack_id?: string | null;
      }
    | undefined;

  const hasSettingsRow = existingRows.length > 0;

  console.log('initDatabase: hasSettingsRow =', hasSettingsRow);

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
  }

  if (!hasSettingsRow) {
    const initialLanguage = getInitialAppLanguage();
    const initialWordPackId = getDefaultWordPackIdByLanguage(initialLanguage);

    await db.executeAsync(
      `
        INSERT INTO settings (
          id,
          theme,
          language,
          selected_word_pack_id,
          start_date
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [1, DEFAULT_THEME, initialLanguage, initialWordPackId, Date.now()],
    );

    console.log(
      'initDatabase: default settings inserted with language:',
      initialLanguage,
      'and word pack:',
      initialWordPackId,
    );

    return;
  }

  // Safety fix for already existing older DBs where selected_word_pack_id may be null
  if (!firstRow?.selected_word_pack_id) {
    const language = firstRow?.language === 'uk' ? 'uk' : 'en';
    const fallbackWordPackId = getDefaultWordPackIdByLanguage(language);

    await db.executeAsync(
      'UPDATE settings SET selected_word_pack_id = ? WHERE id = ?',
      [fallbackWordPackId, 1],
    );

    console.log(
      'initDatabase: fixed null selected_word_pack_id with fallback:',
      fallbackWordPackId,
    );
  }
}
