import { NativeModules } from 'react-native';
import colors from '../constants/themes/colors';
import { ThemeType } from '../constants/themes/themeType';

const { HistoryWidgetModule } = NativeModules;

export async function updateHistoryWidgetTheme(theme: ThemeType) {
  if (!HistoryWidgetModule?.updateTheme) return;

  const palette = colors[theme];

  await HistoryWidgetModule.updateTheme(
    palette.card, // bgColor
    palette.cardTitle, // textColor
    palette.main, // barMainColor
    palette.accent, // barAccentColor
    palette.border, // barMutedColor
  );
}
