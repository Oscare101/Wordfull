import {
  History,
  GameMode,
  Language,
} from '../../constants/interfaces/interface';
import { historyRepository } from './historyRepository';
import { statisticsRepository } from './statisticsRepository';

interface SaveCompletedGameParams {
  duration: number;
  mode: GameMode;
  wordPackId: string;
  wordPackNameSnapshot: string;
  words: string[];
  inputs: string[];
  language: Language;
}

function generateHistoryId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function normalizeWordForCompare(word: string): string {
  return word
    .trim()
    .toLowerCase()
    .normalize('NFC')
    .replace(/['’ʼ`ʹʻ՚ꞌ]/g, '');
}

export function countCorrectWords(words: string[], inputs: string[]): number {
  return words.reduce((acc, word, index) => {
    const normalizedWord = normalizeWordForCompare(word);
    const normalizedInput = normalizeWordForCompare(inputs[index] ?? '');

    return acc + (normalizedWord === normalizedInput ? 1 : 0);
  }, 0);
}

export const gameResultsRepository = {
  async saveCompletedGame(params: SaveCompletedGameParams): Promise<History> {
    const correctWords = countCorrectWords(params.words, params.inputs);

    const historyItem: History = {
      id: generateHistoryId(),
      timestamp: Date.now(),
      duration: params.duration,
      language: params.language,
      mode: params.mode,
      wordPackId: params.wordPackId,
      wordPackNameSnapshot: params.wordPackNameSnapshot,
      wordsAmount: params.words.length,
      words: params.words,
      correctWords,
      inputs: params.inputs,
    };

    await historyRepository.create(historyItem);

    await statisticsRepository.increment({
      wordsMemorized: correctWords,
      wordsAttempted: params.words.length,
      timeSpent: params.duration,
      games: 1,
    });

    return historyItem;
  },
};
