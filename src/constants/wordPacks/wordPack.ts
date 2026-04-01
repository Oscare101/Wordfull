import {
  DEFAULT_SYSTEM_WORD_PACK_KEYS,
  Language,
  SystemWordPackKey,
  WordPack,
} from '../interfaces/interface';
import { abstract_noun_en_500 } from './abstract-nouns-en-500';
import { abstract_noun_uk_500 } from './abstract-nouns-uk-500';
import { common_noun_en_100 } from './common-nouns-en-100';
import { common_noun_uk_100 } from './common-nouns-uk-100';
import { complex_noun_en_900 } from './complex-nouns-en-900';
import { complex_noun_uk_900 } from './complex-nouns-uk-900';

type SystemWordPacksByLanguage = Record<
  Language,
  Partial<Record<SystemWordPackKey, WordPack>>
>;

export const SYSTEM_WORD_PACKS: SystemWordPacksByLanguage = {
  en: {
    simple_nouns: common_noun_en_100,
    complex_nouns: complex_noun_en_900,
    abstract_nouns: abstract_noun_en_500,
  },
  uk: {
    simple_nouns: common_noun_uk_100,
    complex_nouns: complex_noun_uk_900,
    abstract_nouns: abstract_noun_uk_500,
  },
};

export function getAllSystemWordPacks(): WordPack[] {
  return Object.values(SYSTEM_WORD_PACKS).flatMap(languagePacks =>
    Object.values(languagePacks).filter(Boolean),
  ) as WordPack[];
}

export function getSystemWordPackByKey(
  language: Language,
  key: SystemWordPackKey,
): WordPack | undefined {
  return SYSTEM_WORD_PACKS[language]?.[key];
}

export function getSystemWordPacksByLanguage(language: Language): WordPack[] {
  return Object.values(SYSTEM_WORD_PACKS[language]).filter(
    Boolean,
  ) as WordPack[];
}

export function getSystemWordPacksByKeys(
  language: Language,
  keys: SystemWordPackKey[],
): WordPack[] {
  return keys
    .map(key => getSystemWordPackByKey(language, key))
    .filter(Boolean) as WordPack[];
}

export function getMergedSystemWordPackByLanguageAndKeys(
  language: Language,
  keys: SystemWordPackKey[],
): WordPack {
  const packs = getSystemWordPacksByKeys(language, keys);

  const safePacks =
    packs.length > 0
      ? packs
      : getSystemWordPacksByKeys(language, DEFAULT_SYSTEM_WORD_PACK_KEYS);

  const uniqueWords = Array.from(
    new Set(safePacks.flatMap(pack => pack.words)),
  );

  const mergedName =
    safePacks.length === 1
      ? safePacks[0].name
      : safePacks.map(pack => pack.name).join(' + ');

  const mergedId = `system-${language}-${safePacks
    .map(pack => pack.key ?? pack.id)
    .join('+')}`;

  return {
    id: mergedId,
    key: undefined,
    name: mergedName,
    isSystem: true,
    language,
    words: uniqueWords,
  };
}
