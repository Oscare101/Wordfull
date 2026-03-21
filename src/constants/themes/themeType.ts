export type ThemeType = 'olive' | 'darkBlue' | 'darkRed';

export const DEFAULT_THEME: ThemeType = 'olive';

export interface Theme {
  name: string;
  id: ThemeType;
  bg: string;
  main: string;
  comment: string;
  accent: string;
  card: string;
  success: string;
  error: string;
  warning: string;
  buttonActive: string;
  buttonInactive: string;
  buttonTitleActive: string;
  buttonTitleInactive: string;
  barStyle: 'light-content' | 'dark-content';
  bgDim: string;
  bgShadow: string;
  border: string;
}
