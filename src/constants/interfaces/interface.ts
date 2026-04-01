import { ThemeType } from '../themes/themeType';

export type Language = 'en' | 'uk';
export const SUPPORTED_LANGUAGES: Language[] = ['en', 'uk'];

export type SystemWordPackKey =
  | 'simple_nouns'
  | 'complex_nouns'
  | 'abstract_nouns';

export const SYSTEM_WORD_PACK_KEYS: SystemWordPackKey[] = [
  'simple_nouns',
  'complex_nouns',
  'abstract_nouns',
];

export const DEFAULT_SYSTEM_WORD_PACK_KEYS: SystemWordPackKey[] = [
  'simple_nouns',
  'complex_nouns',
];

export interface User {
  theme: ThemeType;
  startDate: number;
  language: Language;
  selectedSystemWordPackKeys: SystemWordPackKey[];
  history: History[];
  statistics: Statistics;
}

export interface Statistics {
  wordsMemorized: number;
  wordsAttempted: number;
  timeSpent: number;
  games: number;
}

export interface WordPack {
  name: string;
  id: string;
  key?: SystemWordPackKey;
  isSystem: boolean;
  language: Language | null;
  words: string[];
  isDeleted?: boolean;
}

export interface History {
  id: string;
  timestamp: number;
  language: Language;
  duration: number;
  wordPackId: WordPack['id'];
  wordPackNameSnapshot: string;
  wordsAmount: number;
  words: string[];
  correctWords: number;
  inputs: string[];
  mode: GameMode;
}

export type GameMode = 'easy' | 'hard' | 'stamina';

export interface RulesInterface {
  defaultWordsAmount: number;
}
