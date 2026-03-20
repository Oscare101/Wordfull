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
