import { Language, WordPack } from '../interfaces/interface';
import { common_noun_en_100 } from './common-nouns-en-100';
import { common_noun_uk_100 } from './common-nouns-uk-100';

export const SYSTEM_WORD_PACKS: WordPack[] = [
  common_noun_en_100,
  common_noun_uk_100,
];

export function getAllSystemWordPacks(): WordPack[] {
  return SYSTEM_WORD_PACKS;
}

export function getSystemWordPackById(id: string): WordPack | undefined {
  return SYSTEM_WORD_PACKS.find(pack => pack.id === id);
}

export function getSystemWordPacksByLanguage(language: Language): WordPack[] {
  return SYSTEM_WORD_PACKS.filter(pack => pack.language === language);
}

export function getDefaultWordPackIdByLanguage(language: Language): string {
  const pack = SYSTEM_WORD_PACKS.find(pack => pack.language === language);

  if (!pack) {
    throw new Error(`No default word pack found for language: ${language}`);
  }

  return pack.id;
}

export function getDefaultWordPackByLanguage(language: Language): WordPack {
  const pack = SYSTEM_WORD_PACKS.find(pack => pack.language === language);

  if (!pack) {
    throw new Error(`No default word pack found for language: ${language}`);
  }

  return pack;
}
