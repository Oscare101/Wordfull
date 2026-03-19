import { TextType } from './textType';

const english = {
  Settings: 'Settings',
  Theme: 'Theme',
  Language: 'Language',
  Ukrainian: 'Українська',
  English: 'English',
  // language screen
  YourLanguage: 'Your language',
  OtherLanguages: 'Other languages',
  AfterChangingLanguageWarning:
    'After changing the language, the word pack will be changed to the new language. You still can change it to any language you want in the word pack settings.',
  YourTheme: 'Your theme',
  OtherThemes: 'Other themes',
} satisfies Record<TextType, string>;

export default english;
