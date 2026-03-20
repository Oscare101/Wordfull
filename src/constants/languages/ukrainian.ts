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
  // game modes screen
  NewGame: 'Нова гра',
  Easy: 'Легко',
  Hard: 'Складно',
  Stamina: 'Витривалість',
  EasyTitle: 'Легкий режим',
  HardTitle: 'Складний режим',
  StaminaTitle: 'Режим на витривалість',
  Start: 'Почати',
  easyDescription:
    '• Обмежена кількість слів\n• Можна повертатись до попередніх\n• Відкритий список всіх слів',
  hardDescription:
    '• Обмежена кількість слів\n• До попередніх карток повертатись не можна\n• Список слів недоступний',
  staminaDescription:
    '• Небмежена кількість слів\n• До попередніх карток повертатись не можна\n• Список слів недоступний',
  gamePreambula:
    '• На екрані будуть карточки зі словами\n• Перемикайтесь між ними та запам’ятайте їх у правильному порядку за найкоротший час\n• Після цього перейдіть до перевірки і введіть всі слова\n• Завершіть спробу та ознайомтесь із результатом',
  startWhenReady: 'Починайте коли будете готові\nЧас почнеться одразу',

  WordsAmount: 'Кількість слів для вправи',
  wordsMaxWarning: 'Максимальна кількість слів доступна #',
  CloseGameWarningTitle: 'Припинити гру',
  CloseGameWarning:
    'Ви точно хочете припинити гру?\nСпроба буде зарахована, проте прогрес не збережеться',
  goBack: 'Повернутись',
  Stop: 'Припинити',
  Check: 'Перевірити',
  IfYouReadyToCheck: 'Якщо ви вивчили всі слова і готові перейти до перевірки',
  list: 'cписок',
  backToCards: 'до карток',
  timeMemorizing: 'час запам’ятовування',
  sec: 'сек',
  min: 'хв',
  hours: 'год',
  IfYouEnteredWords: 'Якщо ви ввели всі слова і готові завершити спробу',
  Finish: 'Завершити',
  ConfirmWarningTitle: 'Завершити спробу',
  ConfirmWarning: 'Завершити спробу, навіть з наявними пустими полями',
} satisfies Record<TextType, string>;

export default ukrainian;
