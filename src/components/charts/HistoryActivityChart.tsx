import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { History, Language } from '../../constants/interfaces/interface';
import { useSettings } from '../../context/SettingsContext';
import colors from '../../constants/themes/colors';
import useDayRefreshKey from '../../hooks/useDayRefreshKey';

type ChartDays = 7 | 30;

interface HistoryActivityChartProps {
  history: History[];
  days: ChartDays;
  height?: number;
}

interface ChartBarItem {
  key: string;
  label: string;
  value: number;
  isToday: boolean;
  fullDate: Date;
}

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getWeekdayLabel(date: Date, language: Language): string {
  return date.toLocaleDateString(language, { weekday: 'narrow' });
}

function getShortMonthDay(date: Date, language: Language): string {
  return date.toLocaleDateString(language, {
    month: 'long',
    day: 'numeric',
  });
}

function buildChartData(
  history: History[],
  days: ChartDays,
  language: Language,
): ChartBarItem[] {
  const today = startOfDay(new Date());
  const startDate = addDays(today, -(days - 1));
  const countsMap = new Map<string, number>();

  for (const item of history) {
    const itemDate = startOfDay(new Date(item.timestamp));

    if (itemDate < startDate || itemDate > today) {
      continue;
    }

    const key = formatDateKey(itemDate);
    countsMap.set(key, (countsMap.get(key) ?? 0) + item.correctWords);
  }

  const result: ChartBarItem[] = [];

  for (let index = 0; index < days; index++) {
    const currentDate = addDays(startDate, index);
    const key = formatDateKey(currentDate);

    result.push({
      key,
      label: days === 7 ? getWeekdayLabel(currentDate, language) : '',
      value: countsMap.get(key) ?? 0,
      isToday: formatDateKey(currentDate) === formatDateKey(today),
      fullDate: currentDate,
    });
  }

  return result;
}

export default function HistoryActivityChart({
  history,
  days,
  height = 100,
}: HistoryActivityChartProps) {
  const { theme, language } = useSettings();
  const themeColors = colors[theme];
  const dayKey = useDayRefreshKey();

  const chartData = useMemo(
    () => buildChartData(history, days, language),
    [history, days, language, dayKey],
  );

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(item => item.value), 1);
  }, [chartData]);

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.barsRow}>
        {chartData.map(item => {
          const barHeightPercent = item.value === 0 ? 0 : item.value / maxValue;

          return (
            <View key={item.key} style={styles.barItem}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    {
                      maxHeight: days === 7 ? height - 26 : undefined,
                      height: `${barHeightPercent * 100}%`,
                      backgroundColor: item.isToday
                        ? themeColors.accent
                        : item.value === 0
                        ? themeColors.mainDim
                        : themeColors.main,
                    },
                  ]}
                />
              </View>

              {days === 7 ? (
                <Text
                  style={[styles.weekdayLabel, { color: themeColors.main }]}
                >
                  {item.label}
                </Text>
              ) : null}
            </View>
          );
        })}
      </View>

      {days === 30 ? (
        <View style={styles.bottomDateRow}>
          <Text style={[styles.dateLabel, { color: themeColors.main }]}>
            {getShortMonthDay(chartData[0].fullDate, language)}
          </Text>

          <Text style={[styles.dateLabel, { color: themeColors.main }]}>
            {getShortMonthDay(
              chartData[chartData.length - 1].fullDate,
              language,
            )}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: '78%',
    flex: 1,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    minHeight: 8,
    borderRadius: 6,
  },
  weekdayLabel: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 18,
  },
  bottomDateRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
});
