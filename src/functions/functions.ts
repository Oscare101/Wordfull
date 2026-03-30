import { Language } from '../constants/interfaces/interface';
import text from '../constants/languages/text';

export function GetRandomWords(words: string[], amount: number) {
  amount = Math.min(amount, words.length);

  const selectedWords = [];
  const usedIndices = new Set();

  while (selectedWords.length < amount) {
    const randomIndex = Math.floor(Math.random() * words.length);

    if (!usedIndices.has(randomIndex)) {
      selectedWords.push(words[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  return selectedWords;
}

export function TimeFormat(ms: number, language: Language) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor(ms / 60000) % 60;
  const seconds = Math.floor(ms / 1000) % 60;
  const oneTenthOfSecond = Math.floor(ms / 100) % 10;
  if (hours) {
    return `${hours} ${text[language].hours} ${minutes} ${text[language].min} ${seconds} ${text[language].sec}`;
  } else if (minutes) {
    return `${minutes} ${text[language].min} ${seconds} ${text[language].sec}`;
  } else {
    return `${seconds}.${oneTenthOfSecond} ${text[language].sec}`;
  }
}

export function NumberFormat(num: number, language: Language) {
  return num.toLocaleString();
}

export function WordsTitleFromAmount(count: number, language: Language) {
  if (count >= 10 && count <= 20) {
    return text[language].Words.toLocaleLowerCase();
  } else {
    return count % 10 === 1
      ? text[language].Word.toLocaleLowerCase()
      : count % 10 >= 2 && count % 10 <= 4
      ? text[language].Words23.toLocaleLowerCase()
      : text[language].Words.toLocaleLowerCase();
  }
}
