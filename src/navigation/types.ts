import { GameMode, SystemWordPackKey } from '../constants/interfaces/interface';

export type RootStackParamList = {
  HomeScreen: undefined;
  SettingsScreen: undefined;
  LanguageScreen: undefined;
  UserDataScreen: undefined;
  ThemeScreen: undefined;
  WordPacksScreen: undefined;
  WordPackPreviewScreen: { wordPackKey: SystemWordPackKey };
  GameModesScreen: undefined;
  PreGameScreen: { mode: GameMode };
  GameScreen: { wordsAmount: number; mode: GameMode; words: string[] };
  CheckScreen: {
    start: number;
    finish: number;
    words: string[];
    mode: GameMode;
    wordsAmount: number;
  };
  GameResultsScreen: {
    words: string[];
    inputs: string[];
    time: number;
    mode: GameMode;
  };
  StatisticsScreen: undefined;
  WordsAmountScreen: undefined;
  PersonalBestsScreen: undefined;
  AccuracyScreen: undefined;
  LearningScreen: undefined;
  AverageStatsScreen: undefined;
  ChapterScreen: { chapterId: string };
};
