import { db } from './database';
import { getInitialAppLanguage } from '../utils/getInitialAppLanguage';
import { DEFAULT_THEME } from '../constants/themes/themeType';

export async function initDatabase(): Promise<void> {
  console.log('initDatabase: started');

  // TODO only for dev reset db
  // await db.executeAsync(`DROP TABLE IF EXISTS settings`);

  await db.executeAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY NOT NULL,
      theme TEXT NOT NULL,
      language TEXT NOT NULL,
      selected_word_pack_id TEXT,
      start_date INTEGER NOT NULL
    )
  `);

  console.log('initDatabase: settings table ensured');

  const existingResult = await db.executeAsync(
    'SELECT id FROM settings WHERE id = ? LIMIT 1',
    [1],
  );

  const existingRows = existingResult.results ?? [];
  const hasSettingsRow = existingRows.length > 0;

  console.log('initDatabase: hasSettingsRow =', hasSettingsRow);

  if (!hasSettingsRow) {
    const initialLanguage = getInitialAppLanguage();

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
      [1, DEFAULT_THEME, initialLanguage, null, Date.now()],
    );

    console.log(
      'initDatabase: default settings inserted with language:',
      initialLanguage,
    );
  }
}
