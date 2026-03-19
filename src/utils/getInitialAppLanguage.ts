import { getLocales } from 'react-native-localize';
import {
  Language,
  SUPPORTED_LANGUAGES,
} from '../constants/interfaces/interface';

export function getInitialAppLanguage(): Language {
  const locales = getLocales();

  // Example locale items may contain fields like:
  // languageCode: 'en'
  // languageTag: 'en-US'
  const firstSupported = locales.find(locale =>
    SUPPORTED_LANGUAGES.includes(locale.languageCode as Language),
  );

  if (firstSupported) {
    return firstSupported.languageCode as Language;
  }

  return SUPPORTED_LANGUAGES[0];
}
