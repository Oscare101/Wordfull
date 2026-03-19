import { Language } from '../interfaces/interface';
import { TextType } from './textType';

import english from './english';
import ukrainian from './ukrainian';

const text: Record<Language, Record<TextType, string>> = {
  en: english,
  uk: ukrainian,
};

export default text;
