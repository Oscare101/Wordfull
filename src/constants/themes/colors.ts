import blackWhite from './blackWhite';
import darkBlue from './darkBlue';
import darkRed from './darkRed';
import olive from './olive';
import sky from './sky';
import { ThemeType, Theme } from './themeType';

const colors: Record<ThemeType, Theme> = {
  olive: olive,
  darkBlue: darkBlue,
  darkRed: darkRed,
  sky: sky,
  blackWhite: blackWhite,
};

export default colors;
