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

  NumberOfWordsForExercise: 'Кількість слів для вправи',
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
  correctWordsMemorized: 'вивчених слів',
  TotalWordsMemorized: 'Усього вивчених слів',
  Words: 'Слів', // 4 5 6 7 8 9 0
  Words23: 'Слова', // 2 3
  Word: 'Слово', // 1
  Days: 'Днів',
  Day: 'День',
  PersonalBestResults: 'Особисті найкращі результати',
  Today: 'Сьогодні',
  Yesterday: 'Вчора',
  PastWeek: 'Минулого тижня',
  PastMonth: 'Минулого місяця',
  PastYear: 'Минулого року',
  AllTime: 'За весь час',
  Accuracy: 'Точність',
  inPastWeek: 'за минулий тиждень',
  inPastMonth: 'за минулий місяць',
  inPastYear: 'за минулий рік',
  inPast30Days: 'за минулі 30 днів',
  inAllTime: 'за весь час',
  DailyAverage: 'Середнє за день',
  TimePlaying: 'Час ігор',
  GamesCompleted: 'Завершених ігор',
  MondayShort: 'Пн',
  TuesdayShort: 'Вт',
  WednesdayShort: 'Ср',
  ThursdayShort: 'Чт',
  FridayShort: 'Пт',
  SaturdayShort: 'Сб',
  SundayShort: 'Нд',
  WordsAmount: 'Кількість слів',
  UserData: 'Дані користувача',
  Export: 'Експорт',
  ExportDescription:
    'Експортовані дані можна використовувати як резервну копію або для перенесення вашого прогресу на інший пристрій.\nЕкспортуючи дані, ви не втрачаєте свій прогрес на цьому пристрої. Під час імпорту даних на поточний пристрій попередні дані будуть перезаписані',
  Import: 'Імпорт',
  ImportDescription:
    'Імпортовані дані перезапишуть весь ваш поточний прогрес.\nПісля завантаження файлу вам буде показано вікно для підтвердження вашого вибору з короткими даними файлу',
  DangerZone: 'Небезпечна зона',
  WipeData: 'Стерти дані',
  WipeDataDescription:
    'Ця дія видалить всі ваші дані та прогрес у грі та дозволить вам почати спочатку',
  Statistics: 'Статистика',
  quote1:
    '“Інтелектуальний ріст повинен починатися з народження і припинятися лише після смерті.”',
  quote1Author: 'Альберт Ейнштейн',
} satisfies Record<TextType, string>;

export default ukrainian;
