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
  // game modes screen
  NewGame: 'New Game',
  Easy: 'Easy',
  Hard: 'Hard',
  Stamina: 'Stamina',
  EasyTitle: 'Easy Mode',
  HardTitle: 'Hard Mode',
  StaminaTitle: 'Stamina Mode',
  Start: 'Start',
  easyDescription:
    '• Limited number of words\n• You can go back to previous ones\n• Open list of all words',
  hardDescription:
    "• Limited number of words\n• You can't go back to previous cards\n• List of words is unavailable",
  staminaDescription:
    "• Unlimited number of words\n• You can't go back to previous cards\n• List of words is unavailable",
  gamePreambula:
    '• There will be cards with words on the screen\n• Switch between them and remember them in the correct order in the shortest time\n• After that, go to the check and enter all the words\n• Complete the attempt and check the result',
  startWhenReady: "Start when you're ready\nThe time will start immediately",
  WordsAmount: 'Number of words for exercise',
  wordsMaxWarning: 'Maximum number of words available #',
  CloseGameWarningTitle: 'Stop game',
  CloseGameWarning:
    "Are you sure you want to stop the game?\nThe attempt will be counted, but the progress won't be saved",
  goBack: 'Go back',
  Stop: 'Stop',
  Check: 'Check',
  IfYouReadyToCheck: "If you've learned all the words and are ready to check",
  list: 'list',
  backToCards: 'to cards',
  timeMemorizing: 'time for memorizing',
  sec: 'sec.',
  min: 'min.',
  hours: 'hours.',
  IfYouEnteredWords:
    "If you've entered all the words and are ready to finish the attempt",
  Finish: 'Finish',
  ConfirmWarningTitle: 'Finish attempt',
  ConfirmWarning: 'Finish the attempt, even with empty fields',
} satisfies Record<TextType, string>;

export default english;
