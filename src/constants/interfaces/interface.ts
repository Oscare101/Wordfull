import { ThemeType } from '../themes/themeType';

export interface User {
  theme: ThemeType;
  startDate: number;
  language: Language;
  wordPack: WordPack['id'];
  history: History[];
  statistics: Statistics;
}

export interface Statistics {
  wordsMemorized: number; // successfully memorized words
  wordsAttempted: number; // all attempted words (including incorrect ones)
  timeSpent: number; // in milliseconds
  games: number; // number of memorization sessions
  bestAttemptsByWordsAmount: History[]; // best 10 games with most words memorized in it
}

export type Language = 'en' | 'uk';
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'uk'];

export interface WordPack {
  name: string;
  id: string;
  isSystem: boolean; // to check if the wordpack is system or user created
  language: Language | null;
  words: string[];
  isDeleted?: boolean;
}

export interface History {
  id: string;
  timestamp: number;
  duration: number; // milliseconds
  wordPackId: WordPack['id'];
  wordPackNameSnapshot: string;
  wordsAmount: number;
  words: string[]; // what words did he have to memorize
  correctWords: number;
  inputs: string[]; // what user wrote after memorizing
}

export type GameMode = 'easy' | 'hard' | 'stamina';

export interface RulesInterface {
  defaultWordsAmount: number;
}
