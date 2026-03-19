import { TextType } from './textType';

const ukrainian = {
  Settings: 'Налаштування',
  Theme: 'Тема',
  Language: 'Мова',
  Ukrainian: 'Українська',
  English: 'English',
  // language screen
  YourLanguage: 'Ваша мова',
  OtherLanguages: 'Інші мови',
  AfterChangingLanguageWarning:
    'Після зміни мови, словниковий набір буде змінено на нову мову. Ви все одно можете змінити його на будь-яку мову, яку бажаєте в налаштуваннях словникового набору.',
  // theme screen
  YourTheme: 'Ваша тема',
  OtherThemes: 'Інші теми',
} satisfies Record<TextType, string>;

export default ukrainian;
