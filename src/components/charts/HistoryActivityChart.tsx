import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { History, Language } from '../../constants/interfaces/interface';
import { useSettings } from '../../context/SettingsContext';
import colors from '../../constants/themes/colors';
import useDayRefreshKey from '../../hooks/useDayRefreshKey';
import { NumberFormat, WordsTitleFromAmount } from '../../functions/functions';

type ChartDays = 7 | 30;

interface HistoryActivityChartProps {
  history: History[];
  days: ChartDays;
  height?: number;
  interactive?: boolean;
  onInteractionStateChange?: (isInteracting: boolean) => void;
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

function getBarHeight(
  value: number,
  maxValue: number,
  chartHeight: number,
): number {
  if (chartHeight <= 0) {
    return 0;
  }

  const rawHeight = value === 0 ? 0 : (value / maxValue) * chartHeight;
  return Math.min(Math.max(rawHeight, 8), chartHeight);
}

function getTouchedBarIndex(
  locationX: number,
  chartWidth: number,
  itemsCount: number,
): number | null {
  if (chartWidth <= 0 || itemsCount === 0) {
    return null;
  }

  const nextIndex = Math.floor((locationX / chartWidth) * itemsCount);

  return Math.max(0, Math.min(itemsCount - 1, nextIndex));
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
  interactive = true,
  onInteractionStateChange,
}: HistoryActivityChartProps) {
  const { theme, language } = useSettings();
  const themeColors = colors[theme];
  const dayKey = useDayRefreshKey();
  const isMonthChart = days === 30 && interactive;
  const [chartAreaWidth, setChartAreaWidth] = useState(0);
  const [chartAreaHeight, setChartAreaHeight] = useState(0);
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const isInteractingRef = useRef(false);
  const chartAreaRef = useRef<View>(null);
  const chartAreaPageXRef = useRef(0);

  const chartData = useMemo(
    () => buildChartData(history, days, language),
    [history, days, language, dayKey],
  );

  const maxValue = useMemo(() => {
    return Math.max(...chartData.map(item => item.value), 1);
  }, [chartData]);

  const setInteractionState = useCallback(
    (isInteracting: boolean) => {
      if (isInteractingRef.current === isInteracting) {
        return;
      }

      isInteractingRef.current = isInteracting;
      onInteractionStateChange?.(isInteracting);
    },
    [onInteractionStateChange],
  );

  const clearActiveBar = useCallback(() => {
    setActiveBarIndex(null);
    setInteractionState(false);
  }, [setInteractionState]);

  const updateActiveBar = useCallback(
    (pageX: number) => {
      if (!interactive) {
        return;
      }

      const relativeX = pageX - chartAreaPageXRef.current;
      const nextIndex = getTouchedBarIndex(
        relativeX,
        chartAreaWidth,
        chartData.length,
      );

      if (nextIndex === null) {
        return;
      }

      setActiveBarIndex(currentIndex =>
        currentIndex === nextIndex ? currentIndex : nextIndex,
      );
      setInteractionState(true);
    },
    [chartAreaWidth, chartData.length, interactive, setInteractionState],
  );

  const handleChartAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height: nextHeight } = event.nativeEvent.layout;
    setChartAreaWidth(width);
    setChartAreaHeight(nextHeight);
    // Measure absolute screen offset so we can translate pageX correctly.
    // requestAnimationFrame gives layout time to commit before measuring.
    requestAnimationFrame(() => {
      chartAreaRef.current?.measureInWindow(x => {
        chartAreaPageXRef.current = x;
      });
    });
  }, []);

  useEffect(() => {
    if (!interactive) {
      clearActiveBar();
    }
  }, [clearActiveBar, interactive]);

  useEffect(() => {
    return () => {
      onInteractionStateChange?.(false);
    };
  }, [onInteractionStateChange]);

  return (
    <View style={[styles.container, { height }]}>
      <View
        ref={chartAreaRef}
        style={styles.chartArea}
        onLayout={handleChartAreaLayout}
        onStartShouldSetResponder={() => interactive}
        onMoveShouldSetResponder={() => interactive}
        onResponderGrant={event => {
          // Re-measure on every grant so scroll position changes are accounted for.
          chartAreaRef.current?.measureInWindow(x => {
            chartAreaPageXRef.current = x;
            updateActiveBar(event.nativeEvent.pageX);
          });
        }}
        onResponderMove={event => {
          updateActiveBar(event.nativeEvent.pageX);
        }}
        onResponderRelease={clearActiveBar}
        onResponderTerminate={clearActiveBar}
      >
        <View style={styles.barsRow}>
          {chartData.map((item, index) => {
            const barHeightPercent =
              item.value === 0 ? 0 : item.value / maxValue;
            const isActive = activeBarIndex === index;
            // const tooltipTop = Math.max(
            //   chartAreaHeight -
            //     getBarHeight(item.value, maxValue, chartAreaHeight) -
            //     42,
            //   0,
            // );

            const tooltipTop = -50;

            return (
              <View
                key={item.key}
                style={[styles.barItem, isActive ? styles.activeBarItem : null]}
              >
                {isMonthChart && isActive ? (
                  <View
                    pointerEvents="none"
                    style={[styles.tooltipContainer, { top: tooltipTop }]}
                  >
                    <View
                      style={[
                        styles.tooltipBubble,
                        {
                          backgroundColor: themeColors.main,
                          borderColor: themeColors.main,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tooltipText,
                          { color: themeColors.cardTitle },
                        ]}
                      >
                        {NumberFormat(item.value, language)}
                        {'\n'}
                        {WordsTitleFromAmount(item.value, language)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.tooltipArrow,
                        {
                          borderTopColor: themeColors.main,
                        },
                      ]}
                    />
                  </View>
                ) : null}

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      {
                        maxHeight: days === 7 ? height - 26 : undefined,
                        height: `${barHeightPercent * 100}%`,
                        backgroundColor: isActive
                          ? themeColors.accent
                          : item.isToday
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
  chartArea: {
    flex: 1,
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
    position: 'relative',
  },
  activeBarItem: {
    zIndex: 2,
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
  tooltipContainer: {
    position: 'absolute',
    left: -60,
    right: -60,
    alignItems: 'center',
    zIndex: 3,
  },
  tooltipBubble: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  tooltipText: {
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
    fontWeight: '600',
    flexShrink: 0,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  dateLabel: {
    fontSize: 14,
    lineHeight: 20,
  },
});
