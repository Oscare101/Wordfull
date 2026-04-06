import { NativeModules } from 'react-native';
import { historyRepository } from '../db/repositories/historyRepository';

const { HistoryWidgetModule } = NativeModules;

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function updateHistoryWidgetStats() {
  if (!HistoryWidgetModule?.updateStats) return;

  try {
    const history = await historyRepository.getAll();

    const today = startOfDay(new Date());

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return startOfDay(date);
    });

    const dayMap = new Map<number, number>();
    days.forEach(day => {
      dayMap.set(day.getTime(), 0);
    });

    history.forEach(item => {
      const itemDay = startOfDay(new Date(item.timestamp));
      const key = itemDay.getTime();

      if (dayMap.has(key)) {
        dayMap.set(key, (dayMap.get(key) || 0) + item.correctWords);
      }
    });

    const bars = days.map(day => dayMap.get(day.getTime()) || 0);
    const totalWords = bars.reduce((sum, value) => sum + value, 0);

    await HistoryWidgetModule.updateStats(totalWords, JSON.stringify(bars));
  } catch (error) {
    if (__DEV__) {
      console.error('updateHistoryWidgetStats error:', error);
    }
  }
}
