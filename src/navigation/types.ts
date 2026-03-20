import { GameMode } from '../constants/interfaces/interface';

export type RootStackParamList = {
  HomeScreen: undefined;
  SettingsScreen: undefined;
  LanguageScreen: undefined;
  ThemeScreen: undefined;
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
};
