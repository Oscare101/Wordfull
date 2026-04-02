import { Language } from '../constants/interfaces/interface';

export function GetLanguageName(appLanguage: Language, dataLanguage: Language) {
  const languagesData: { [key in Language]: { [key in Language]: string } } = {
    en: {
      en: 'English',
      uk: 'Ukrainian',
    },
    uk: {
      en: 'Англійська',
      uk: 'Українська',
    },
  };

  if (languagesData[dataLanguage] && languagesData[dataLanguage][appLanguage]) {
    return languagesData[appLanguage][dataLanguage];
  }
  return dataLanguage;
}
