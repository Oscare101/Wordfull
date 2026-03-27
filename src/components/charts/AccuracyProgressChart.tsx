import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { History, Language } from '../../constants/interfaces/interface';
import { useSettings } from '../../context/SettingsContext';
import colors from '../../constants/themes/colors';

type ChartDays = 7 | 30;

interface AccuracyProgressChartProps {
  history: History[];
  days?: ChartDays;
  height?: number;
  lineColor?: string;
  accuracyColor?: string;
}

interface DayPoint {
  key: string;
  date: Date;
  label: string;
  totalCorrectWords: number;
  totalAttemptedWords: number;
  accuracy: number;
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

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function buildChartDays(
  history: History[],
  days: ChartDays,
  language: Language,
): DayPoint[] {
  const today = startOfDay(new Date());
  const startDate = addDays(today, -(days - 1));

  const map = new Map<
    string,
    {
      date: Date;
      totalCorrectWords: number;
      totalAttemptedWords: number;
    }
  >();

  for (const item of history) {
    const itemDate = startOfDay(new Date(item.timestamp));

    if (itemDate < startDate || itemDate > today) {
      continue;
    }

    const key = formatDateKey(itemDate);
    const prev = map.get(key);

    if (prev) {
      prev.totalCorrectWords += item.correctWords;
      prev.totalAttemptedWords += item.wordsAmount;
    } else {
      map.set(key, {
        date: itemDate,
        totalCorrectWords: item.correctWords,
        totalAttemptedWords: item.wordsAmount,
      });
    }
  }

  const result: DayPoint[] = [];

  for (let index = 0; index < days; index++) {
    const currentDate = addDays(startDate, index);
    const key = formatDateKey(currentDate);
    const existing = map.get(key);

    const totalCorrectWords = existing?.totalCorrectWords ?? 0;
    const totalAttemptedWords = existing?.totalAttemptedWords ?? 0;

    result.push({
      key,
      date: currentDate,
      label: getWeekdayLabel(currentDate, language),
      totalCorrectWords,
      totalAttemptedWords,
      accuracy:
        totalAttemptedWords > 0 ? totalCorrectWords / totalAttemptedWords : 0,
    });
  }

  return result;
}

function buildPath(points: { x: number; y: number }[]): string {
  if (!points.length) {
    return '';
  }

  return points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(' ');
}

function AccuracyProgressChart({
  history,
  days = 7,
  height = 150,
  lineColor,
  accuracyColor,
}: AccuracyProgressChartProps) {
  const { theme, language } = useSettings();
  const themeColors = colors[theme];

  const data = useMemo(
    () => buildChartDays(history, days, language),
    [history, days, language],
  );

  const chartWidth = days === 7 ? 360 : 520;
  const chartHeight = height;
  const topPadding = 16;
  const bottomPadding = 32;
  const leftPadding = 14;
  const rightPadding = 14;

  const innerWidth = chartWidth - leftPadding - rightPadding;
  const innerHeight = chartHeight - topPadding - bottomPadding;

  const maxCorrectWords = Math.max(
    ...data.map(item => item.totalCorrectWords),
    1,
  );

  const black = lineColor ?? themeColors.main;
  const white = accuracyColor ?? colors[theme].accent;
  const dashed = themeColors.main;
  const labelColor = themeColors.main;

  const xStep = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth;

  const correctWordPoints = data.map((item, index) => {
    const x = leftPadding + index * xStep;
    const normalized = item.totalCorrectWords / maxCorrectWords;
    const y = topPadding + innerHeight - normalized * innerHeight;

    return { x, y };
  });

  const accuracyPoints = data.map((item, index) => {
    const x = leftPadding + index * xStep;
    const normalized = clamp(item.accuracy, 0, 1);
    const y = topPadding + innerHeight - normalized * innerHeight - 2;

    return { x, y };
  });

  const correctWordsPath = buildPath(correctWordPoints);
  const accuracyPath = buildPath(accuracyPoints);

  return (
    <View style={[styles.container, { height: chartHeight }]}>
      <Svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      >
        {data.map((item, index) => {
          const x = leftPadding + index * xStep;

          return (
            <React.Fragment key={item.key}>
              <Line
                key={`divider-${index}`}
                x1={x}
                y1={topPadding}
                x2={x}
                y2={topPadding + innerHeight}
                stroke={dashed}
                strokeWidth={1}
                strokeDasharray="4 6"
                opacity={0.6}
              />
              <Text
                key={'label-' + index}
                style={{
                  left: (x - 6) * 0.93,
                  bottom: 10,
                  position: 'absolute',
                  fontSize: 16,
                  color: labelColor,
                }}
              >
                {item.label}
              </Text>
            </React.Fragment>
          );
        })}

        <Path d={accuracyPath} stroke={white} strokeWidth={2} fill="none" />

        <Path d={correctWordsPath} stroke={black} strokeWidth={2} fill="none" />

        {accuracyPoints.map((point, index) => {
          const isLast = index === accuracyPoints.length - 1;
          const isNull = data[index].totalCorrectWords === 0;

          return (
            // <Line
            //   key={`accuracy-point-${index}`}
            //   x1={point.x - xStep / 3}
            //   y1={point.y}
            //   x2={point.x + xStep / 3}
            //   y2={point.y}
            //   stroke={isNull ? 'transparent' : white}
            //   strokeWidth={2}
            // />
            <Circle
              key={`accuracy-point-${index}`}
              cx={point.x}
              cy={point.y}
              r={6}
              fill={isNull ? 'transparent' : isLast ? white : themeColors.bg}
              stroke={isNull ? 'transparent' : white}
              strokeWidth={2}
            />
          );
        })}

        {correctWordPoints.map((point, index) => {
          const isLast = index === correctWordPoints.length - 1;
          const isNull = data[index].totalCorrectWords === 0;

          return (
            <Rect
              key={`correct-point-${index}`}
              x={point.x - 6}
              y={point.y - 6}
              width={12}
              height={12}
              rx={2}
              fill={isNull ? 'transparent' : isLast ? black : themeColors.bg}
              stroke={isNull ? 'transparent' : black}
              strokeWidth={2}
            />
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  labelItem: {
    flex: 1,
    alignItems: 'center',
  },
  labelText: {
    fontSize: 18,
  },
});

export default React.memo(AccuracyProgressChart);
