import { Theme } from '../interfaces/interface';
import darkBlue from './darkBlue';
import olive from './olive';
import { ThemeType } from './themeType';

const colors: Record<ThemeType, Theme> = {
  olive: olive,
  darkBlue: darkBlue,
};

export default colors;
