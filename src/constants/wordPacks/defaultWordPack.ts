import { Language } from '../interfaces/interface';
import { common_noun_en_100 } from './common-nouns-en-100';
import { common_noun_uk_100 } from './common-nouns-uk-100';

export function getDefaultWordPackIdByLanguage(language: Language): string {
  switch (language) {
    case 'uk':
      return common_noun_uk_100.id;
    case 'en':
    default:
      return common_noun_en_100.id;
  }
}
