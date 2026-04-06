import { NativeModules } from 'react-native';
import { Language } from '../constants/interfaces/interface';

const { HistoryWidgetModule } = NativeModules;

export async function updateHistoryWidgetLanguage(language: Language) {
  if (!HistoryWidgetModule?.updateLanguage) return;

  await HistoryWidgetModule.updateLanguage(language);
}
